import { Topbar } from "@/components/layout/topbar";
import { DeviceManagementPanel } from "@/components/thiet-bi/device-management-panel";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DevicesPage() {
  const [devices, danhMucs, phongs, khoas, nhaCungCaps] = await Promise.all([
    prisma.thietBi.findMany({
      include: {
        danhMuc: true,
        phong: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.danhMucThietBi.findMany({ orderBy: { tenDM: "asc" } }),
    prisma.phong.findMany({ orderBy: { tenPhong: "asc" } }),
    prisma.khoa.findMany({ orderBy: { tenKhoa: "asc" } }),
    prisma.nhaCungCap.findMany({ orderBy: { tenNCC: "asc" } }),
  ]);

  const totalDevices = devices.length;
  const totalValue = devices.reduce((sum, device) => sum + Number(device.giaTriBanDau), 0);
  const goodDevices = devices.filter((device) => device.trangThai === "TOT").length;
  const warningDevices = devices.filter((device) => ["HONG", "BAO_TRI", "THANH_LY"].includes(device.trangThai)).length;

  const deviceRows = devices.map((device) => ({
    id: device.id,
    maThietBi: device.maThietBi,
    tenThietBi: device.tenThietBi,
    moTa: device.moTa,
    thongSoKyThuat: device.thongSoKyThuat,
    serialNumber: device.serialNumber,
    namNhap: device.namNhap,
    giaTriBanDau: Number(device.giaTriBanDau),
    baoHanhDen: device.baoHanhDen?.toISOString() ?? null,
    trangThai: device.trangThai,
    danhMucId: device.danhMucId,
    nhaCungCapId: device.nhaCungCapId,
    khoaId: device.khoaId,
    phongId: device.phongId,
    danhMuc: { tenDM: device.danhMuc.tenDM },
    phong: device.phong ? { tenPhong: device.phong.tenPhong } : null,
  }));

  return (
    <>
      <Topbar
        title="Quản lý thiết bị"
        description="Danh sách thiết bị, thông tin cơ bản, trạng thái và các thao tác quản lý."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng thiết bị</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{totalDevices}</p>
            <p className="mt-2 text-sm text-slate-500">Tổng số tài sản đã đăng ký</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Trạng thái tốt</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{goodDevices}</p>
            <p className="mt-2 text-sm text-slate-500">Sẵn sàng sử dụng và phân bổ</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Cần xử lý</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{warningDevices}</p>
            <p className="mt-2 text-sm text-slate-500">Bảo trì, hỏng hoặc thanh lý</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng giá trị</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{formatCurrency(totalValue)}</p>
            <p className="mt-2 text-sm text-slate-500">Giá trị hạch toán hiện tại</p>
          </Card>
        </section>

        <Card className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Quản lý danh sách</h3>
              <p className="mt-2 text-sm text-slate-500">
                Tạo mới, cập nhật và xuất mã QR cho từng thiết bị trong hệ thống.
              </p>
            </div>
            <div className="rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">
              {danhMucs.length} danh mục • {phongs.length} phòng • {khoas.length} khoa
            </div>
          </div>
        </Card>

        <DeviceManagementPanel
          devices={deviceRows}
          danhMucs={danhMucs.map((item) => ({ id: item.id, label: item.tenDM }))}
          phongs={phongs.map((item) => ({ id: item.id, label: item.tenPhong }))}
          khoas={khoas.map((item) => ({ id: item.id, label: item.tenKhoa }))}
          nhaCungCaps={nhaCungCaps.map((item) => ({ id: item.id, label: item.tenNCC }))}
        />
      </main>
    </>
  );
}
