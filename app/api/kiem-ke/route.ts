import { NextRequest } from "next/server";

import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { kiemKeRoundCreateSchema } from "@/lib/validations/kiem-ke";

const allowedRoles = ["ADMIN", "THU_KHO"] as const;

export async function GET(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return Response.json({ error: "Không được xác thực" }, { status: 401 });
  }

  if (!allowedRoles.includes(user.role as (typeof allowedRoles)[number])) {
    return Response.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "20");
    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (status) {
      where.trangThai = status;
    }

    if (search) {
      where.OR = [{ tenDot: { contains: search, mode: "insensitive" } }];
    }

    const [data, total] = await Promise.all([
      prisma.dotKiemKe.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          items: {
            select: { daXacNhãn: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.dotKiemKe.count({ where }),
    ]);

    return Response.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể lay danh sach kiem ke" },
      { status: 400 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return Response.json({ error: "Không được xác thực" }, { status: 401 });
  }

  if (!allowedRoles.includes(user.role as (typeof allowedRoles)[number])) {
    return Response.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = kiemKeRoundCreateSchema.parse(body);

    const thietBiIds =
      parsed.thietBiIds && parsed.thietBiIds.length > 0
        ? parsed.thietBiIds
        : (
            await prisma.thietBi.findMany({
              where: { trangThai: { not: "THANH_LY" } },
              select: { id: true },
              orderBy: { updatedAt: "desc" },
            })
          ).map((item) => item.id);

    if (thietBiIds.length === 0) {
      return Response.json({ error: "Không có thiết bị de tao dot kiem ke" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const dot = await tx.dotKiemKe.create({
        data: {
          tenDot: parsed.tenDot,
          ngayBatDau: new Date(parsed.ngayBatDau),
          trangThai: "DANG_THUC_HIEN",
          nguoiTao: user.name ?? "System",
        },
      });

      await tx.kiemKeItem.createMany({
        data: thietBiIds.map((thietBiId) => ({
          dotKiemKeId: dot.id,
          thietBiId,
          daXacNhãn: false,
        })),
        skipDuplicates: true,
      });

      await recordAuditLog(tx, {
        userId: user.id,
        action: "CREATE",
        entity: "DotKiemKe",
        entityId: dot.id,
        detail: JSON.stringify({ items: thietBiIds.length }),
      });

      return dot;
    });

    return Response.json(result, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tao dot kiem ke" },
      { status: 400 },
    );
  }
}
