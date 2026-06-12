import { Topbar } from "@/components/layout/topbar";
import { InventoryManagementPanel } from "@/components/kiem-ke/inventory-management-panel";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const roundsData = await prisma.dotKiemKe.findMany({
    include: {
      items: {
        select: {
          daXacNhan: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  });

  const currentRoundData =
    (await prisma.dotKiemKe.findFirst({
      where: { trangThai: "DANG_THUC_HIEN" },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            thietBi: {
              select: {
                id: true,
                maThietBi: true,
                tenThietBi: true,
                trangThai: true,
                phong: { select: { tenPhong: true } },
              },
            },
          },
          orderBy: { thietBi: { maThietBi: "asc" } },
        },
      },
    })) ??
    (roundsData.length > 0
      ? await prisma.dotKiemKe.findUnique({
          where: { id: roundsData[0].id },
          include: {
            items: {
              include: {
                thietBi: {
                  select: {
                    id: true,
                    maThietBi: true,
                    tenThietBi: true,
                    trangThai: true,
                    phong: { select: { tenPhong: true } },
                  },
                },
              },
              orderBy: { thietBi: { maThietBi: "asc" } },
            },
          },
        })
      : null);

  const inventoryRounds = roundsData.map((round) => {
    const total = round.items.length;
    const confirmed = round.items.filter((item) => item.daXacNhan).length;
    const percent = total > 0 ? (confirmed / total) * 100 : 0;

    let trangThaiDisplay = round.trangThai;
    if (round.trangThai === "DANG_THUC_HIEN") trangThaiDisplay = "Đang thực hiện";
    if (round.trangThai === "HOAN_THANH") trangThaiDisplay = "Đã hoàn thành";

    return {
      id: round.id,
      tenDot: round.tenDot,
      trangThai: trangThaiDisplay,
      tong: total,
      daXacNhan: confirmed,
      percent,
    };
  });

  const currentRound = currentRoundData
    ? {
        id: currentRoundData.id,
        tenDot: currentRoundData.tenDot,
        trangThai: currentRoundData.trangThai,
        ngayBatDau: currentRoundData.ngayBatDau.toISOString(),
        ngayKetThuc: currentRoundData.ngayKetThuc?.toISOString() ?? null,
        items: currentRoundData.items.map((item) => ({
          id: item.id,
          thietBi: {
            id: item.thietBi.id,
            maThietBi: item.thietBi.maThietBi,
            tenThietBi: item.thietBi.tenThietBi,
            trangThai: item.thietBi.trangThai,
            phong: item.thietBi.phong ? { tenPhong: item.thietBi.phong.tenPhong } : null,
          },
          trangThaiThucTe: item.trangThaiThucTe,
          ghiChu: item.ghiChu,
          daXacNhan: item.daXacNhan,
          ngayXacNhan: item.ngayXacNhan?.toISOString() ?? null,
        })),
      }
    : null;

  const totalRounds = inventoryRounds.length;
  const activeRoundItems = currentRound?.items.length ?? 0;
  const confirmedItems = currentRound?.items.filter((item) => item.daXacNhan).length ?? 0;
  const completionRate =
    activeRoundItems > 0 ? Math.round((confirmedItems / activeRoundItems) * 100) : 0;

  return (
    <>
      <Topbar
        title="Kiểm kê"
        description="Khởi tạo đợt kiểm kê, đối chiếu thiết bị và xử lý chênh lệch."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng đợt</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{totalRounds}</p>
            <p className="mt-2 text-sm text-slate-500">Đợt kiểm kê gần đây</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Đang thực hiện</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{currentRound ? 1 : 0}</p>
            <p className="mt-2 text-sm text-slate-500">Đợt kiểm kê hiện tại</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Đã xác nhận</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{confirmedItems}</p>
            <p className="mt-2 text-sm text-slate-500">Trong đợt đang mở</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tỷ lệ hoàn thành</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{completionRate}%</p>
            <p className="mt-2 text-sm text-slate-500">Tiến độ xác nhận mục</p>
          </Card>
        </section>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-950">Hướng dẫn kiểm kê</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Mỗi đợt kiểm kê sẽ tạo danh sách thiết bị cần đối chiếu. Người phụ trách có thể xác
            nhận từng mục, ghi chú chênh lệch và đóng đợt khi tất cả mục đã được xử lý.
          </p>
          {currentRound ? (
            <p className="mt-3 text-sm text-slate-500">
              Đợt hiện tại: {currentRound.tenDot} | Bắt đầu: {formatDate(new Date(currentRound.ngayBatDau))}
            </p>
          ) : null}
        </Card>

        <Card className="p-4">
          <InventoryManagementPanel rounds={inventoryRounds} currentRound={currentRound} />
        </Card>
      </main>
    </>
  );
}
