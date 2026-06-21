import { NextRequest } from "next/server";

import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { muonSchema } from "@/lib/validations/muon-tra";

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

  // Sinh viên và giảng viên chỉ thấy phiếu mượn của mình
  const limitedRoles = ["SINH_VIEN", "GIANG_VIEN"];
  if (limitedRoles.includes(user.role)) {
    where.nguoiMuonId = user.id;
  }

  const [data, total] = await Promise.all([
    prisma.phieuMuon.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        thietBi: { select: { id: true, tenThietBi: true, maThietBi: true } },
        nguoiMuon: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.phieuMuon.count({ where }),
  ]);

  return Response.json({ data, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;
  if (!user) return Response.json({ error: "Không được xác thực" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = muonSchema.parse(body);

    const thietBi = await prisma.thietBi.findUnique({
      where: { id: parsed.thietBiId },
      select: { id: true, trangThai: true, tenThietBi: true },
    });

    if (!thietBi) {
      return Response.json({ error: "Không tìm thấy thiết bị" }, { status: 404 });
    }
    if (thietBi.trangThai !== "TOT") {
      return Response.json(
        { error: `Thiết bị không sẵn sàng để mượn (trạng thái: ${thietBi.trangThai})` },
        { status: 400 },
      );
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

    return Response.json(phieu, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tạo phiếu mượn" },
      { status: 400 },
    );
  }
}
