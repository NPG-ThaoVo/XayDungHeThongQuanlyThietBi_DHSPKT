import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

class TOTPRequired extends CredentialsSignin {
  code = "TOTP_REQUIRED";
}
class InvalidTOTP extends CredentialsSignin {
  code = "INVALID_TOTP";
}
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { recordAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma) as never,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mat khau", type: "password" },
        totpCode: { label: "Ma 2FA", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isValid = await bcrypt.compare(String(credentials.password), user.password);

        if (!isValid) {
          return null;
        }

        if (user.twoFactorEnabled && user.twoFactorSecret) {
          const cleanToken = String(credentials.totpCode ?? "").replace(/\s/g, "");
          if (!cleanToken) {
            throw new TOTPRequired();
          }
          const speakeasy = await import("speakeasy");
          const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: cleanToken,
            window: 10,
          });
          if (!verified) {
            throw new InvalidTOTP();
          }
        }

        await recordAuditLog(prisma, {
          userId: user.id,
          action: "LOGIN",
          entity: "User",
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          khoaId: user.khoaId,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.khoaId = user.khoaId;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = String(token.role ?? "SINH_VIEN");
        session.user.khoaId = typeof token.khoaId === "string" ? token.khoaId : null;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
