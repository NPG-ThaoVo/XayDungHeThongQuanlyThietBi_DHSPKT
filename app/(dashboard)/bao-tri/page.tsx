import { Topbar } from "@/components/layout/topbar";
import { MaintenanceManagementPanel } from "@/components/bao-tri/maintenance-management-panel";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const [items, devices, technicians] = await Promise.all([
    prisma.baoTri.findMany({
      include: {
        thietBi: {
          select: { id: true, maThietBi: true, tenThietBi: true, trangThai: true },
        },
        kyThuatVien: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.thietBi.findMany({
      select: { id: true, maThietBi: true, tenThietBi: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: { in: ["ADMIN", "TRUONG_KHOA", "THU_KHO", "GIANG_VIEN"] } },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const rows = items.map((item) => ({
    id: item.id,
    loaiBaoTri: item.loaiBaoTri,
    moTaVanDe: item.moTaVanDe,
    ketQua: item.ketQua,
    chiPhi: item.chiPhi ? Number(item.chiPhi) : null,
    ngayBatDau: item.ngayBatDau.toISOString(),
    ngayHoanThanh: item.ngayHoanThanh?.toISOString() ?? null,
    thietBi: {
      id: item.thietBi.id,
      maThietBi: item.thietBi.maThietBi,
      tenThietBi: item.thietBi.tenThietBi,
      trangThai: item.thietBi.trangThai,
    },
    kyThuatVien: item.kyThuatVien
      ? {
          id: item.kyThuatVien.id,
          name: item.kyThuatVien.name,
          email: item.kyThuatVien.email,
          role: item.kyThuatVien.role,
        }
      : null,
  }));

  const summary = [
    {
      title: "Tổng phiếu",
      value: rows.length.toString(),
      note: "Tối đa 50 phiếu gần nhất trên dashboard.",
    },
    {
      title: "Đang xử lý",
      value: rows.filter((item) => !item.ngayHoanThanh).length.toString(),
      note: "Phiếu chưa có ngày hoàn thành.",
    },
    {
      title: "Hoàn thành",
      value: rows.filter((item) => item.ngayHoanThanh).length.toString(),
      note: "Phiếu đã có ngày hoàn thành.",
    },
    {
      title: "Cập nhật",
      value: formatDate(new Date()),
      note: "Thời gian render server.",
    },
  ];

  const totalCost = rows.reduce((sum, item) => sum + (item.chiPhi ?? 0), 0);
  const openItems = rows.filter((item) => !item.ngayHoanThanh).length;
  const closedItems = rows.filter((item) => item.ngayHoanThanh).length;

  const deviceOptions = devices.map((device) => ({
    id: device.id,
    label: `${device.maThietBi} - ${device.tenThietBi}`,
  }));

  const technicianOptions = technicians.map((tech) => ({
    id: tech.id,
    label: `${tech.name} (${tech.role})`,
  }));

  return (
    <>
      <Topbar
        title="Bảo trì"
        description="Mô-đun dành cho tiến trình bảo trì, sửa chữa và nâng cấp thiết bị."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng phiếu</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{rows.length}</p>
            <p className="mt-2 text-sm text-slate-500">Danh sách bảo trì gần đây</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Đang xử lý</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{openItems}</p>
            <p className="mt-2 text-sm text-slate-500">Phiếu chưa có ngày hoàn thành</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Hoàn thành</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{closedItems}</p>
            <p className="mt-2 text-sm text-slate-500">Đã có kết quả xử lý</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng chi phí</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{formatCurrency(totalCost)}</p>
            <p className="mt-2 text-sm text-slate-500">Từ các phiếu đã ghi nhận</p>
          </Card>
        </section>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-950">Quy trình bảo trì</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Trang này theo dõi phiếu bảo trì, kỹ thuật viên phụ trách, chi phí và trạng thái hoàn
            thành. Bạn có thể tạo mới phiếu, giao việc và đóng phiếu ngay trong bảng dữ liệu.
          </p>
        </Card>

        <Card className="p-4">
          <MaintenanceManagementPanel
            items={rows}
            devices={deviceOptions}
            technicians={technicianOptions}
            summary={summary}
          />
        </Card>
      </main>
    </>
  );
}
