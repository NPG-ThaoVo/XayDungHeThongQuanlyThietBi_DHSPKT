"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { phanBoSchema } from "@/lib/validations/phan-bo";

const ALLOWED_ROLES = ["ADMIN", "THU_KHO", "TRUONG_KHOA"];
const PAGE_PATH = "/phan-bo";

export async function phanBoThietBi(data: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Bạn chưa đăng nhập");
  if (!ALLOWED_ROLES.includes(session.user.role)) throw new Error("Không có quyền thực hiện phân bổ");

  const parsed = phanBoSchema.parse(data);

  const device = await prisma.thietBi.findUnique({
    where: { id: parsed.thietBiId },
    include: { khoa: true, phong: true },
  });
  if (!device) throw new Error("Thiết bị không tồn tại");

  const oldPhongName = device.phong?.tenPhong ?? null;
  const oldKhoaName = device.khoa?.tenKhoa ?? null;

  let newPhongId = device.phongId;
  let newKhoaId = device.khoaId;
  let newPhongName: string | null = null;
  let newKhoaName: string | null = null;

  if (parsed.denPhong) {
    const phong = await prisma.phong.findUnique({ where: { id: parsed.denPhong } });
    if (!phong) throw new Error("Phòng không tồn tại");
    newPhongId = phong.id;
    newPhongName = phong.tenPhong;
  }

  if (parsed.denKhoa) {
    const khoa = await prisma.khoa.findUnique({ where: { id: parsed.denKhoa } });
    if (!khoa) throw new Error("Khoa không tồn tại");
    newKhoaId = khoa.id;
    newKhoaName = khoa.tenKhoa;
  }

  const result = await prisma.$transaction(async (tx) => {
    const record = await tx.lichSuDiChuyen.create({
      data: {
        thietBiId: parsed.thietBiId,
        tuPhong: oldPhongName,
        denPhong: newPhongName,
        tuKhoa: oldKhoaName,
        denKhoa: newKhoaName,
        lyDo: parsed.lyDo ?? null,
        nguoiThucHien: session.user.name ?? session.user.email ?? "Không rõ",
      },
    });

    await tx.thietBi.update({
      where: { id: parsed.thietBiId },
      data: {
        phongId: newPhongId,
        khoaId: newKhoaId,
      },
    });

    return record;
  });

  await recordAuditLog(prisma, {
    userId: session.user.id,
    action: "PHAN_BO",
    entity: "LichSuDiChuyen",
    entityId: result.id,
    detail: `Phân bổ thiết bị ${device.maThietBi} từ ${oldPhongName ?? "?"} -> ${newPhongName ?? "?"}, ${oldKhoaName ?? "?"} -> ${newKhoaName ?? "?"}`,
  });

  revalidatePath(PAGE_PATH);

  return { success: true, id: result.id };
}
