import { NextRequest } from "next/server";

import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { kiemKeRoundUpdateSchema } from "@/lib/validations/kiem-ke";

const allowedRoles = ["ADMIN", "THU_KHO"] as const;

export async function GET(
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

  const { id } = await params;

  const round = await prisma.dotKiemKe.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          thietBi: {
            select: {
              id: true,
              maThietBi: true,
              tenThietBi: true,
              trangThai: true,
              phong: { select: { tenPhong: true } },
            },
          },
        },
        orderBy: { thietBi: { maThietBi: "asc" } },
      },
    },
  });

  if (!round) {
    return Response.json({ error: "Không tìm thấy dot kiem ke" }, { status: 404 });
  }

  return Response.json(round);
}

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
    const parsed = kiemKeRoundUpdateSchema.parse(body);

    const existing = await prisma.dotKiemKe.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return Response.json({ error: "Không tìm thấy dot kiem ke" }, { status: 404 });
    }

    const updated = await prisma.dotKiemKe.update({
      where: { id },
      data: {
        ...(parsed.trangThai ? { trangThai: parsed.trangThai } : {}),
        ...(parsed.ngayKetThuc !== undefined
          ? { ngayKetThuc: parsed.ngayKetThuc ? new Date(parsed.ngayKetThuc) : null }
          : {}),
      },
    });

    await recordAuditLog(prisma, {
      userId: user.id,
      action: "UPDATE",
      entity: "DotKiemKe",
      entityId: updated.id,
      detail: JSON.stringify({ trangThai: parsed.trangThai ?? undefined }),
    });

    return Response.json(updated);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể cap nhat dot kiem ke" },
      { status: 400 },
    );
  }
}
