import { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { baoCaoSummaryQuerySchema } from "@/lib/validations/bao-cao";

const allowedRoles = ["ADMIN", "TRUONG_KHOA"] as const;

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
    const url = new URL(request.url);
    const parsedQuery = baoCaoSummaryQuerySchema.parse({
      from: url.searchParams.get("from") ?? undefined,
      to: url.searchParams.get("to") ?? undefined,
    });

    const from = parsedQuery.from ? new Date(parsedQuery.from) : null;
    const to = parsedQuery.to ? new Date(parsedQuery.to) : null;

    const maintenanceWhere: Record<string, unknown> = {};
    if (from && to) {
      maintenanceWhere.ngayBatDau = { gte: from, lte: to };
    } else if (from) {
      maintenanceWhere.ngayBatDau = { gte: from };
    } else if (to) {
      maintenanceWhere.ngayBatDau = { lte: to };
    }

    const [khoaCount, totalDevices, goodDevices, maintenanceAgg] = await Promise.all([
      prisma.khoa.count({
        where: {
          thietBis: {
            some: {},
          },
        },
      }),
      prisma.thietBi.count(),
      prisma.thietBi.count({
        where: { trangThai: "TOT" },
      }),
      prisma.baoTri.aggregate({
        where: Object.keys(maintenanceWhere).length > 0 ? maintenanceWhere : undefined,
        _sum: {
          chiPhi: true,
        },
      }),
    ]);

    const percentGood = totalDevices === 0 ? 0 : Number(((goodDevices / totalDevices) * 100).toFixed(1));
    const chiPhi = Number(maintenanceAgg._sum.chiPhi || 0);

    return Response.json({
      khoaCount,
      totalDevices,
      goodDevices,
      percentGood,
      chiPhi,
      range: {
        from: from ? from.toISOString() : null,
        to: to ? to.toISOString() : null,
      },
    });
  } catch (error) {
    console.error("Failed to load summary report:", error);
    return Response.json(
      {
        error:
          "Không thể tải báo cáo do cơ sở dữ liệu không phản hồi. Vui lòng thử lại sau.",
      },
      { status: 503 },
    );
  }
}
