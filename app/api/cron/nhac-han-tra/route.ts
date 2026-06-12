export async function GET() {
  return Response.json(
    {
      skipped: true,
      reason:
        "Cron nhac-han-tra da duoc de tinh theo schema moi. Quy trình muon-tra khong con su dung.",
    },
    { status: 410 },
  );
}
