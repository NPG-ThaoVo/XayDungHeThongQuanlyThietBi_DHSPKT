"use server";

import { recordAuditLog } from "@/lib/audit";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function logout() {
  const session = await auth();
  const user = session?.user;

  if (user?.id) {
    await recordAuditLog(prisma, {
      userId: user.id,
      action: "LOGOUT",
      entity: "User",
    });
  }

  await signOut({ redirectTo: "/login" });
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Xác thực không hợp lệ. Vui lòng đăng nhập lại." };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Vui lòng nhập đầy đủ thông tin." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Mật khẩu mới không khớp xác nhận." };
  }

  if (newPassword.length < 6) {
    return { error: "Mật khẩu mới phải dài ít nhất 6 ký tự." };
  }

  const bcrypt = await import("bcryptjs"); // Dynamic import to prevent client boundary issues

  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!userRecord || !userRecord.password) {
    return { error: "Không tìm thấy thông tin tài khoản." };
  }

  const isVald = await bcrypt.compare(currentPassword, userRecord.password);
  if (!isVald) {
    return { error: "Mật khẩu hiện tại không chính xác." };
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedNewPassword },
  });

  await recordAuditLog(prisma, {
    userId: session.user.id,
    action: "CHANGE_PASSWORD",
    entity: "User",
  });

  return { success: "Đổi mật khẩu thành công!" };
}
