"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { thanhLySchema } from "@/lib/validations/thanh-ly";

const ALLOWED_ROLES = ["ADMIN", "THU_KHO", "TRUONG_KHOA"];
const PAGE_PATH = "/thanh-ly";

export async function thanhLyThietBi(data: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Bạn chưa đăng nhập");
  if (!ALLOWED_ROLES.includes(session.user.role)) throw new Error("Không có quyền thực hiện thanh lý");

  const parsed = thanhLySchema.parse(data);

  // Look up user by email to handle stale JWT tokens after db reset
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true, name: true },
  });
  if (!currentUser) throw new Error("Tài khoản của bạn không tồn tại trong hệ thống. Vui lòng đăng nhập lại.");

  const device = await prisma.thietBi.findUnique({
    where: { id: parsed.thietBiId },
    select: { maThietBi: true, tenThietBi: true, trangThai: true },
  });
  if (!device) throw new Error("Thiết bị không tồn tại");
  if (device.trangThai === "DA_THANH_LY") throw new Error("Thiết bị đã được thanh lý trước đó");

  const result = await prisma.$transaction(async (tx) => {
    const record = await tx.thanhLy.create({
      data: {
        thietBiId: parsed.thietBiId,
        giaTriThuHoi: parsed.giaTriThuHoi,
        phuongThuc: parsed.phuongThuc,
        lyDo: parsed.lyDo ?? null,
        nguoiThucHienId: currentUser.id,
      },
    });

    await tx.thietBi.update({
      where: { id: parsed.thietBiId },
      data: { trangThai: "DA_THANH_LY" },
    });

    return record;
  });

  await recordAuditLog(prisma, {
    userId: currentUser.id,
    action: "THANH_LY",
    entity: "ThanhLy",
    entityId: result.id,
    detail: `Thanh lý ${device.maThietBi} - ${device.tenThietBi}, PT: ${parsed.phuongThuc}, GTH: ${parsed.giaTriThuHoi}`,
  });

  revalidatePath(PAGE_PATH);

  return { success: true, id: result.id };
}
