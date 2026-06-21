import { NextRequest } from "next/server";

import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

const managerRoles = ["ADMIN", "THU_KHO", "TRUONG_KHOA"];

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth();
  const user = session?.user;
  if (!user) return Response.json({ error: "Không được xác thực" }, { status: 401 });

  const { id } = await params;
  const phieu = await prisma.phieuMuon.findUnique({
    where: { id },
    include: {
      thietBi: { select: { id: true, tenThietBi: true, maThietBi: true } },
      nguoiMuon: { select: { id: true, name: true, email: true } },
    },
  });

  if (!phieu) return Response.json({ error: "Không tìm thấy phiếu mượn" }, { status: 404 });

  // Users can only see their own phieu unless they are a manager
  if (!managerRoles.includes(user.role) && phieu.nguoiMuonId !== user.id) {
    return Response.json({ error: "Không có quyền xem phiếu này" }, { status: 403 });
  }

  return Response.json(phieu);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await auth();
  const user = session?.user;
  if (!user) return Response.json({ error: "Không được xác thực" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as {
    trangThai?: string;
    ghiChu?: string;
    tinhTrangTra?: string;
  };

  const phieu = await prisma.phieuMuon.findUnique({ where: { id } });
  if (!phieu) return Response.json({ error: "Không tìm thấy phiếu mượn" }, { status: 404 });

  // Permission: managers can do all actions; borrower can only cancel own pending request
  const isManager = managerRoles.includes(user.role);
  const isBorrower = phieu.nguoiMuonId === user.id;

  if (!isManager && !isBorrower) {
    return Response.json({ error: "Không có quyền cập nhật phiếu này" }, { status: 403 });
  }

  if (!isManager && body.trangThai !== "TU_CHOI") {
    return Response.json({ error: "Bạn chỉ có thể hủy phiếu mượn của mình" }, { status: 403 });
  }

  const updateData: Record<string, unknown> = {};
  if (body.trangThai) updateData.trangThai = body.trangThai;
  if (body.ghiChu !== undefined) updateData.ghiChu = body.ghiChu;
  if (body.tinhTrangTra) updateData.tinhTrangTra = body.tinhTrangTra;

  // If returning, set actual return date
  if (body.trangThai === "DA_TRA") {
    updateData.ngayTraThucTe = new Date();
  }

  const updated = await prisma.phieuMuon.update({ where: { id }, data: updateData });

  await recordAuditLog(prisma, {
    userId: user.id,
    action: "UPDATE_STATUS",
    entity: "PhieuMuon",
    entityId: id,
    detail: `Trạng thái: ${body.trangThai}`,
  });

  return Response.json(updated);
}
