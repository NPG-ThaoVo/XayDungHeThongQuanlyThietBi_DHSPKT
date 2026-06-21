"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/audit";
import { createUserSchema } from "@/lib/validations/user";

const ADMIN_PAGE_PATH = "/dashboard/quan-tri";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Chỉ ADMIN mới có quyền thực hiện thao tác này");
  }
  return session.user;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  khoaId?: string;
  maSoNV?: string;
}) {
  const actor = await requireAdmin();

  const parsed = createUserSchema.parse(data);

  const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (existing) throw new Error("Email đã được sử dụng bởi tài khoản khác");

  const hashedPassword = await bcrypt.hash(parsed.password, 12);

  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      password: hashedPassword,
      role: parsed.role as Parameters<typeof prisma.user.create>[0]["data"]["role"],
      khoaId: parsed.khoaId ?? null,
      maSoNV: data.maSoNV ?? null,
    },
  });

  await recordAuditLog(prisma, {
    userId: actor.id,
    action: "CREATE_USER",
    entity: "User",
    entityId: user.id,
    detail: `Email: ${user.email}, Role: ${user.role}`,
  });

  revalidatePath(ADMIN_PAGE_PATH);
  return { success: true, userId: user.id };
}

export async function updateUserRole(userId: string, role: string) {
  const actor = await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as Parameters<typeof prisma.user.update>[0]["data"]["role"] },
  });

  await recordAuditLog(prisma, {
    userId: actor.id,
    action: "UPDATE_USER_ROLE",
    entity: "User",
    entityId: userId,
    detail: `New role: ${role}`,
  });

  revalidatePath(ADMIN_PAGE_PATH);
}

export async function toggleUserStatus(userId: string) {
  const actor = await requireAdmin();

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isActive: true } });
  if (!user) throw new Error("Không tìm thấy tài khoản");

  const newStatus = !user.isActive;
  await prisma.user.update({ where: { id: userId }, data: { isActive: newStatus } });

  await recordAuditLog(prisma, {
    userId: actor.id,
    action: newStatus ? "ACTIVATE_USER" : "DEACTIVATE_USER",
    entity: "User",
    entityId: userId,
  });

  revalidatePath(ADMIN_PAGE_PATH);
}

export async function updateUser(
  userId: string,
  data: { name?: string; khoaId?: string | null; maSoNV?: string | null; phone?: string | null },
) {
  const actor = await requireAdmin();

  await prisma.user.update({ where: { id: userId }, data });

  await recordAuditLog(prisma, {
    userId: actor.id,
    action: "UPDATE_USER",
    entity: "User",
    entityId: userId,
  });

  revalidatePath(ADMIN_PAGE_PATH);
}

export async function resetUserPassword(userId: string, newPassword: string) {
  const actor = await requireAdmin();

  if (newPassword.length < 8) throw new Error("Mật khẩu phải có ít nhất 8 ký tự");

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });

  await recordAuditLog(prisma, {
    userId: actor.id,
    action: "RESET_USER_PASSWORD",
    entity: "User",
    entityId: userId,
  });

  revalidatePath(ADMIN_PAGE_PATH);
}
