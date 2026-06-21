import { NextRequest } from "next/server";

import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePhieuNhapSchema } from "@/lib/validations/phieu-nhap";

const allowedRoles = ["ADMIN", "THU_KHO"] as const;

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Không được xác thực" }, { status: 401 });

  const { id } = await params;
  const phieu = await prisma.phieuNhap.findUnique({
    where: { id },
    include: {
      nhaCungCap: true,
      nguoiTao: { select: { id: true, name: true, email: true } },
      chiTiet: true,
    },
  });

  if (!phieu) return Response.json({ error: "Không tìm thấy phiếu nhập" }, { status: 404 });
  return Response.json(phieu);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await auth();
  const user = session?.user;
  if (!user || !allowedRoles.includes(user.role as (typeof allowedRoles)[number])) {
    return Response.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = updatePhieuNhapSchema.parse(body);

    const phieu = await prisma.phieuNhap.update({
      where: { id },
      data: parsed,
    });

    await recordAuditLog(prisma, {
      userId: user.id,
      action: "UPDATE_STATUS",
      entity: "PhieuNhap",
      entityId: id,
      detail: `Trạng thái: ${parsed.trangThai}`,
    });

    return Response.json(phieu);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể cập nhật" },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Chỉ ADMIN mới có thể xóa phiếu nhập" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.phieuNhap.delete({ where: { id } });

  await recordAuditLog(prisma, {
    userId: user.id,
    action: "DELETE",
    entity: "PhieuNhap",
    entityId: id,
  });

  return Response.json({ success: true });
}
