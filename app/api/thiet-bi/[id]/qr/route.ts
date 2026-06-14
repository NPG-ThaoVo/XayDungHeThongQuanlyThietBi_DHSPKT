import { NextRequest } from "next/server";
import QRCode from "qrcode";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const allowedRoles = ["ADMIN", "TRUONG_KHOA", "THU_KHO", "GIANG_VIEN"] as const;

function buildDeviceQrLink(request: NextRequest, deviceId: string) {
  const baseUrl = request.nextUrl.origin;
  return `${baseUrl}/dashboard/thiet-bi/${deviceId}`;
}

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
  const force = request.nextUrl.searchParams.get("force") === "1";

  const device = await prisma.thietBi.findUnique({
    where: { id },
    select: { id: true, qrCode: true },
  });

  if (!device) {
    return Response.json({ error: "Không tìm thấy thiet bi" }, { status: 404 });
  }

  const link = buildDeviceQrLink(request, device.id);
  const qrCodeUrl = await QRCode.toDataURL(link);

  if (force || !device.qrCode) {
    await prisma.thietBi.update({
      where: { id: device.id },
      data: { qrCode: qrCodeUrl },
    });
  }

  return Response.json({ link, qrCodeUrl });
}
