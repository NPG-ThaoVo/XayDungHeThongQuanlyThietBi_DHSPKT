import { Topbar } from "@/components/layout/topbar";
import { ThanhLyManagementPanel } from "@/components/thanh-ly/thanh-ly-management-panel";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ThanhLyPage() {
  const now = new Date();

  const [thanhLyRecords, candidates] = await Promise.all([
    prisma.thanhLy.findMany({
      include: {
        thietBi: { select: { maThietBi: true, tenThietBi: true } },
        nguoiThucHien: { select: { name: true } },
      },
      orderBy: { ngayThanhLy: "desc" },
      take: 10,
    }),
    prisma.thietBi.findMany({
      where: {
        trangThai: { not: "DA_THANH_LY" },
        OR: [
          { trangThai: "HONG" },
          { trangThai: "CHO_THANH_LY" },
          { trangThai: "THANH_LY" },
          { baoHanhDen: { lte: now } },
        ],
      },
      include: {
        danhMuc: { select: { tenDM: true } },
        phong: { select: { tenPhong: true } },
        khoa: { select: { tenKhoa: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
  ]);

  const totalLiquidated = thanhLyRecords.length;
  const totalRecoveryValue = thanhLyRecords.reduce((sum, r) => sum + Number(r.giaTriThuHoi), 0);
  const brokenCount = candidates.filter((d) => d.trangThai === "HONG").length;
  const expiredWarrantyCount = candidates.filter((d) => d.baoHanhDen && d.baoHanhDen <= now).length;

  const serializedCandidates = candidates.map((d) => ({
    id: d.id,
    maThietBi: d.maThietBi,
    tenThietBi: d.tenThietBi,
    danhMuc: d.danhMuc.tenDM,
    phong: d.phong?.tenPhong ?? null,
    khoa: d.khoa?.tenKhoa ?? null,
    giaTriBanDau: Number(d.giaTriBanDau),
    trangThai: d.trangThai,
    baoHanhDen: d.baoHanhDen?.toISOString() ?? null,
  }));

  const serializedRecords = thanhLyRecords.map((r) => ({
    id: r.id,
    thietBi: { maThietBi: r.thietBi.maThietBi, tenThietBi: r.thietBi.tenThietBi },
    giaTriThuHoi: Number(r.giaTriThuHoi),
    phuongThuc: r.phuongThuc,
    lyDo: r.lyDo,
    nguoiThucHien: r.nguoiThucHien.name,
    ngayThanhLy: r.ngayThanhLy.toISOString(),
  }));

  return (
    <>
      <Topbar
        title="Thanh lý"
        description="Quản lý tài sản không còn sử dụng, giá trị thu hồi và các bước duyệt."
      />
      <main className="space-y-6 p-6">
        <ThanhLyManagementPanel
          candidates={serializedCandidates}
          liquidatedRecords={serializedRecords}
          summary={[
            {
              title: "Cần xử lý",
              value: String(candidates.length),
              note: `${brokenCount} hỏng, ${expiredWarrantyCount} hết BH`,
            },
            {
              title: "Đã thanh lý",
              value: String(totalLiquidated),
              note: `Tổng giá trị thu hồi`,
            },
            {
              title: "Giá trị thu hồi",
              value: new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              }).format(totalRecoveryValue),
              note: "Từ các thiết bị đã thanh lý",
            },
            {
              title: "Thiết bị hỏng",
              value: String(brokenCount),
              note: `${candidates.length - brokenCount} thiết bị khác cần đánh giá`,
            },
          ]}
        />
      </main>
    </>
  );
}
