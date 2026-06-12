export async function GET() {
  return Response.json(
    {
      error:
        "2FA setup da duoc de tinh trong schema moi. Can hoan tat luong NguoiDung/auth truoc khi kich hoat lai.",
    },
    { status: 410 },
  );
}

export async function POST() {
  return Response.json(
    {
      error:
        "2FA setup da duoc de tinh trong schema moi. Can hoan tat luong NguoiDung/auth truoc khi kich hoat lai.",
    },
    { status: 410 },
  );
}
