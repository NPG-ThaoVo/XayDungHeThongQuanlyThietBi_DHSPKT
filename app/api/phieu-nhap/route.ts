import { NextRequest } from "next/server";
import crypto from "crypto";

import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPhieuNhapSchema } from "@/lib/validations/phieu-nhap";

const allowedRoles = ["ADMIN", "THU_KHO", "TRUONG_KHOA"] as const;

export async function GET(request: NextRequest) {
  const session = await auth();
  const user = session?.user;
  if (!user) return Response.json({ error: "Không được xác thực" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "20");
  const trangThai = searchParams.get("trangThai");

  const where: Record<string, unknown> = {};
  if (trangThai) where.trangThai = trangThai;

  const [data, total] = await Promise.all([
    prisma.phieuNhap.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        nhaCungCap: { select: { id: true, tenNCC: true } },
        nguoiTao: { select: { id: true, name: true, email: true } },
        chiTiet: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.phieuNhap.count({ where }),
  ]);

  return Response.json({ data, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;
  if (!user || !allowedRoles.includes(user.role as (typeof allowedRoles)[number])) {
    return Response.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = createPhieuNhapSchema.parse(body);

    const tongTien = parsed.chiTiet.reduce(
      (sum, item) => sum + item.soLuong * item.donGia,
      0,
    );

    const phieuNhap = await prisma.phieuNhap.create({
      data: {
        maPhieu: `PN-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
        nhaCungCapId: parsed.nhaCungCapId,
        nguoiTaoId: user.id,
        tongTien,
        ghiChu: parsed.ghiChu,
        chiTiet: {
          create: parsed.chiTiet.map((item) => ({
            tenThietBi: item.tenThietBi,
            soLuong: item.soLuong,
            donGia: item.donGia,
            ghiChu: item.ghiChu,
          })),
        },
      },
      include: {
        chiTiet: true,
        nhaCungCap: true,
        nguoiTao: { select: { id: true, name: true, email: true } },
      },
    });

    await recordAuditLog(prisma, {
      userId: user.id,
      action: "CREATE",
      entity: "PhieuNhap",
      entityId: phieuNhap.id,
    });

    return Response.json(phieuNhap, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tạo phiếu nhập" },
      { status: 400 },
    );
  }
}
