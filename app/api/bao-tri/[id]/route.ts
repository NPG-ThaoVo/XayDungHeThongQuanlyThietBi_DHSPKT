import { NextRequest } from "next/server";

import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { baoTriUpdateSchema } from "@/lib/validations/bao-tri";

const allowedRoles = ["ADMIN", "TRUONG_KHOA", "THU_KHO", "GIANG_VIEN"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return Response.json({ error: "Không được xác thực" }, { status: 401 });
  }

  if (!allowedRoles.includes(user.role as (typeof allowedRoles)[number])) {
    return Response.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = baoTriUpdateSchema.parse(body);

    const existing = await prisma.baoTri.findUnique({
      where: { id },
      select: { id: true, thietBiId: true },
    });

    if (!existing) {
      return Response.json({ error: "Không tìm thấy phieu bao tri" }, { status: 404 });
    }

    const updated = await prisma.baoTri.update({
      where: { id },
      data: {
        ...(parsed.loaiBaoTri ? { loaiBaoTri: parsed.loaiBaoTri } : {}),
        ...(parsed.moTaVanDe ? { moTaVanDe: parsed.moTaVanDe } : {}),
        ...(parsed.kyThuatVienId !== undefined
          ? { kyThuatVienId: parsed.kyThuatVienId ? parsed.kyThuatVienId : null }
          : {}),
        ...(parsed.ketQua !== undefined ? { ketQua: parsed.ketQua ? parsed.ketQua : null } : {}),
        ...(parsed.chiPhi !== undefined ? { chiPhi: parsed.chiPhi } : {}),
        ...(parsed.ngayHoanThanh !== undefined
          ? { ngayHoanThanh: parsed.ngayHoanThanh ? new Date(parsed.ngayHoanThanh) : null }
          : {}),
      },
    });

    await recordAuditLog(prisma, {
      userId: user.id,
      action: "UPDATE",
      entity: "BaoTri",
      entityId: updated.id,
    });

    return Response.json(updated);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể cap nhat bao tri" },
      { status: 400 },
    );
  }
}
