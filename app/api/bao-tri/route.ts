import { NextRequest } from "next/server";

import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { baoTriCreateSchema } from "@/lib/validations/bao-tri";

const allowedRoles = ["ADMIN", "TRUONG_KHOA", "THU_KHO", "GIANG_VIEN"] as const;

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
    const thietBiId = searchParams.get("thietBiId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (thietBiId) {
      where.thietBiId = thietBiId;
    }

    if (status === "DANG_XU_LY") {
      where.ngayHoanThanh = null;
    }

    if (status === "HOAN_THANH") {
      where.ngayHoanThanh = { not: null };
    }

    if (search) {
      where.OR = [
        { loaiBaoTri: { contains: search, mode: "insensitive" } },
        { moTaVanDe: { contains: search, mode: "insensitive" } },
        { thietBi: { is: { maThietBi: { contains: search, mode: "insensitive" } } } },
        { thietBi: { is: { tenThietBi: { contains: search, mode: "insensitive" } } } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.baoTri.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          thietBi: {
            select: { id: true, maThietBi: true, tenThietBi: true, trangThai: true },
          },
          kyThuatVien: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.baoTri.count({ where }),
    ]);

    return Response.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể lay danh sach bao tri" },
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
    const parsed = baoTriCreateSchema.parse(body);

    const device = await prisma.thietBi.findUnique({
      where: { id: parsed.thietBiId },
      select: { id: true },
    });

    if (!device) {
      return Response.json({ error: "Không tìm thấy thiet bi" }, { status: 404 });
    }

    const baoTri = await prisma.baoTri.create({
      data: {
        thietBiId: parsed.thietBiId,
        loaiBaoTri: parsed.loaiBaoTri,
        moTaVanDe: parsed.moTaVanDe,
        kyThuatVienId: parsed.kyThuatVienId || null,
        ngayBatDau: new Date(parsed.ngayBatDau),
        chiPhi: parsed.chiPhi ?? null,
      },
    });

    await prisma.thietBi.update({
      where: { id: baoTri.thietBiId },
      data: { trangThai: "BAO_TRI" },
    });

    await recordAuditLog(prisma, {
      userId: user.id,
      action: "CREATE",
      entity: "BaoTri",
      entityId: baoTri.id,
    });

    return Response.json(baoTri, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tao phieu bao tri" },
      { status: 400 },
    );
  }
}
