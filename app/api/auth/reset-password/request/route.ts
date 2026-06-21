import { NextRequest } from "next/server";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { sendEmail, buildPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string };
    if (!email) {
      return Response.json({ error: "Vui lòng nhập địa chỉ email" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true, isActive: true },
    });

    // Return 200 even if user not found to prevent email enumeration
    if (!user || !user.isActive) {
      return Response.json({
        message: "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.",
      });
    }

    // Invalidate existing tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email: user.email, token, expires },
    });

    const appUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: "Đặt lại mật khẩu — QLTHIETBI DHSPKT",
      body: buildPasswordResetEmail(resetUrl, user.name),
    });

    return Response.json({
      message: "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.",
    });
  } catch (error) {
    console.error("[reset-password/request]", error);
    return Response.json({ error: "Không thể xử lý yêu cầu. Vui lòng thử lại sau." }, { status: 500 });
  }
}
