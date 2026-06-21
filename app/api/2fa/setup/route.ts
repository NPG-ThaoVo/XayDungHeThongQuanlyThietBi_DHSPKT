import { NextRequest } from "next/server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/audit";

export async function GET() {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return Response.json({ error: "Không được xác thực" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { twoFactorEnabled: true, email: true },
  });

  if (!dbUser) {
    return Response.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });
  }

  if (dbUser.twoFactorEnabled) {
    return Response.json({ enabled: true });
  }

  // Always generate fresh secret — button is disabled while loading so this runs once
  const secret = speakeasy.generateSecret({
    name: `QLTHIETBI DHSPKT:${dbUser.email}`,
    issuer: "QLTHIETBI DHSPKT",
    length: 20,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorSecret: secret.base32 },
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url ?? "");

  console.log(`[2FA GET] userId=${user.id} secret=${secret.base32}`);

  return Response.json({ enabled: false, secret: secret.base32, qrCode });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return Response.json({ error: "Không được xác thực" }, { status: 401 });
  }

  const { totpCode } = (await request.json()) as { totpCode?: string };
  const cleanCode = (totpCode ?? "").replace(/\s/g, "");

  if (cleanCode.length !== 6) {
    return Response.json({ error: "Vui lòng nhập đủ 6 chữ số" }, { status: 400 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { twoFactorSecret: true },
  });

  if (!dbUser?.twoFactorSecret) {
    return Response.json(
      { error: "Phiên thiết lập đã hết hạn. Vui lòng nhấn 'Kích hoạt 2FA' lại." },
      { status: 400 },
    );
  }

  console.log(`[2FA POST] userId=${user.id} dbSecret=${dbUser.twoFactorSecret} got=${cleanCode}`);

  const isValid = speakeasy.totp.verify({
    secret: dbUser.twoFactorSecret,
    encoding: "base32",
    token: cleanCode,
    window: 10, // ±5 minutes tolerance
  });

  if (!isValid) {
    const expected = speakeasy.totp({ secret: dbUser.twoFactorSecret, encoding: "base32" });
    console.warn(`[2FA] Verify failed. Expected=${expected} Got=${cleanCode}`);
    return Response.json(
      { error: `[DEBUG] Server expects: ${expected} — App shows: ${cleanCode}. Nếu 2 số này giống nhau mà vẫn lỗi, hãy báo lại.` },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: true },
  });

  await recordAuditLog(prisma, {
    userId: user.id,
    action: "ENABLE_2FA",
    entity: "User",
    entityId: user.id,
  });

  return Response.json({ success: true, message: "Bảo mật 2FA đã được kích hoạt thành công!" });
}

export async function DELETE() {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return Response.json({ error: "Không được xác thực" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });

  await recordAuditLog(prisma, {
    userId: user.id,
    action: "DISABLE_2FA",
    entity: "User",
    entityId: user.id,
  });

  return Response.json({ success: true, message: "Đã tắt bảo mật 2FA." });
}
