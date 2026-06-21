import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = (await request.json()) as {
      token?: string;
      newPassword?: string;
    };

    if (!token || !newPassword) {
      return Response.json({ error: "Token và mật khẩu mới là bắt buộc" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return Response.json({ error: "Mật khẩu mới phải có ít nhất 8 ký tự" }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!resetToken) {
      return Response.json({ error: "Token không hợp lệ hoặc đã được sử dụng" }, { status: 400 });
    }

    if (resetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return Response.json({ error: "Token đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
      select: { id: true },
    });

    if (!user) {
      return Response.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({ where: { token } }),
    ]);

    return Response.json({ message: "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập ngay." });
  } catch (error) {
    console.error("[reset-password/confirm]", error);
    return Response.json({ error: "Không thể đặt lại mật khẩu. Vui lòng thử lại sau." }, { status: 500 });
  }
}
