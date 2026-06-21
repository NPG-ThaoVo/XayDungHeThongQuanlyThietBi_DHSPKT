"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/audit";
import { muonSchema } from "@/lib/validations/muon-tra";

const BORROW_PAGE_PATH = "/dashboard/muon-tra";

export async function taoPhiếuMuon(data: {
  thietBiId: string;
  mucDich: string;
  ngayMuon: string;
  ngayTraDuKien: string;
}) {
  const session = await auth();
  const user = session?.user;
  if (!user) throw new Error("Bạn chưa đăng nhập");

  const parsed = muonSchema.parse(data);

  const thietBi = await prisma.thietBi.findUnique({
    where: { id: parsed.thietBiId },
    select: { trangThai: true },
  });

  if (!thietBi) throw new Error("Không tìm thấy thiết bị");
  if (thietBi.trangThai !== "TOT") {
    throw new Error(`Thiết bị không sẵn sàng để mượn (${thietBi.trangThai})`);
  }

  const phieu = await prisma.phieuMuon.create({
    data: {
      thietBiId: parsed.thietBiId,
      nguoiMuonId: user.id,
      mucDich: parsed.mucDich,
      ngayMuon: new Date(parsed.ngayMuon),
      ngayTraDuKien: new Date(parsed.ngayTraDuKien),
    },
  });

  await recordAuditLog(prisma, {
    userId: user.id,
    action: "CREATE",
    entity: "PhieuMuon",
    entityId: phieu.id,
  });

  revalidatePath(BORROW_PAGE_PATH);
  return { success: true, phieuId: phieu.id };
}

export async function duyetPhiếuMuon(phieuId: string, approved: boolean) {
  const session = await auth();
  const user = session?.user;
  if (!user) throw new Error("Bạn chưa đăng nhập");

  const allowedRoles = ["ADMIN", "THU_KHO", "TRUONG_KHOA"];
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Bạn không có quyền duyệt phiếu mượn");
  }

  const newStatus = approved ? "DA_DUYET" : "TU_CHOI";
  await prisma.phieuMuon.update({ where: { id: phieuId }, data: { trangThai: newStatus } });

  await recordAuditLog(prisma, {
    userId: user.id,
    action: approved ? "APPROVE" : "REJECT",
    entity: "PhieuMuon",
    entityId: phieuId,
  });

  revalidatePath(BORROW_PAGE_PATH);
}

export async function traThietBi(phieuId: string, tinhTrangTra: string) {
  const session = await auth();
  const user = session?.user;
  if (!user) throw new Error("Bạn chưa đăng nhập");

  const phieu = await prisma.phieuMuon.findUnique({ where: { id: phieuId } });
  if (!phieu) throw new Error("Không tìm thấy phiếu mượn");

  const allowedRoles = ["ADMIN", "THU_KHO"];
  const isBorrower = phieu.nguoiMuonId === user.id;

  if (!allowedRoles.includes(user.role) && !isBorrower) {
    throw new Error("Không có quyền thực hiện thao tác này");
  }

  await prisma.phieuMuon.update({
    where: { id: phieuId },
    data: {
      trangThai: "DA_TRA",
      ngayTraThucTe: new Date(),
      tinhTrangTra,
    },
  });

  await recordAuditLog(prisma, {
    userId: user.id,
    action: "RETURN",
    entity: "PhieuMuon",
    entityId: phieuId,
    detail: `Tình trạng: ${tinhTrangTra}`,
  });

  revalidatePath(BORROW_PAGE_PATH);
}
