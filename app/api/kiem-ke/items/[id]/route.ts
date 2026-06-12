import { NextRequest } from "next/server";

import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { kiemKeItemUpdateSchema } from "@/lib/validations/kiem-ke";

const allowedRoles = ["ADMIN", "THU_KHO"] as const;

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
    const parsed = kiemKeItemUpdateSchema.parse(body);

    const existing = await prisma.kiemKeItem.findUnique({
      where: { id },
      select: { id: true, dotKiemKeId: true },
    });

    if (!existing) {
      return Response.json({ error: "Không tìm thấy item kiểm kê" }, { status: 404 });
    }

    const updated = await prisma.kiemKeItem.update({
      where: { id },
      data: {
        ...(parsed.trangThaiThucTe !== undefined
          ? { trangThaiThucTe: parsed.trangThaiThucTe ? parsed.trangThaiThucTe : null }
          : {}),
        ...(parsed.ghiChu !== undefined ? { ghiChu: parsed.ghiChu ? parsed.ghiChu : null } : {}),
        ...(parsed.daXacNhan !== undefined
          ? { daXacNhan: parsed.daXacNhan, ngayXacNhan: parsed.daXacNhan ? new Date() : null }
          : {}),
      },
    });

    await recordAuditLog(prisma, {
      userId: user.id,
      action: "UPDATE",
      entity: "KiemKeItem",
      entityId: updated.id,
      detail: JSON.stringify({ dotKiemKeId: existing.dotKiemKeId, daXacNhan: updated.daXacNhan }),
    });

    return Response.json(updated);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể cập nhật item kiểm kê" },
      { status: 400 },
    );
  }
}
