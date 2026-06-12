import { NextRequest } from "next/server";
import QRCode from "qrcode";

import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { thietBiSchema } from "@/lib/validations/thiet-bi";

export async function GET(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return Response.json({ error: "Không được xác thực" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search") ?? "";
  const khoaId = searchParams.get("khoaId");
  const trangThai = searchParams.get("trangThai");

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { tenThietBi: { contains: search, mode: "insensitive" } },
      { maThietBi: { contains: search, mode: "insensitive" } },
    ];
  }

  if (khoaId) {
    where.khoaId = khoaId;
  }

  if (trangThai) {
    where.trangThai = trangThai;
  }

  if (["SINH_VIEN", "GIANG_VIEN"].includes(user.role) && user.khoaId) {
    where.khoaId = user.khoaId;
  }

  const [data, total] = await Promise.all([
    prisma.thietBi.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        danhMuc: true,
        khoa: true,
        phong: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.thietBi.count({ where }),
  ]);

  return Response.json({
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user || !["ADMIN", "THU_KHO"].includes(user.role)) {
    return Response.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = thietBiSchema.parse(body);

  const thietBi = await prisma.thietBi.create({
    data: {
      ...parsed,
      baoHanhDen: parsed.baoHanhDen ? new Date(parsed.baoHanhDen) : null,
      hinhAnh: [],
    },
  });

  const qrCode = await QRCode.toDataURL(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/thiet-bi/${thietBi.id}`,
  );

  await prisma.thietBi.update({
    where: { id: thietBi.id },
    data: { qrCode },
  });

  await recordAuditLog(prisma, {
    userId: user.id,
    action: "CREATE",
    entity: "ThietBi",
    entityId: thietBi.id,
  });

  return Response.json(thietBi, { status: 201 });
}
