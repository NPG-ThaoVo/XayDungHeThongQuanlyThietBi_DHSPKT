import { Topbar } from "@/components/layout/topbar";
import { PhanBoManagementPanel } from "@/components/phan-bo/phan-bo-management-panel";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PhanBoPage() {
  const [devices, movements, rooms, faculties] = await Promise.all([
    prisma.thietBi.findMany({
      include: {
        khoa: true,
        phong: true,
        danhMuc: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.lichSuDiChuyen.findMany({
      include: {
        thietBi: { select: { maThietBi: true, tenThietBi: true } },
      },
      orderBy: { ngayDiChuyen: "desc" },
      take: 10,
    }),
    prisma.phong.findMany({ orderBy: { tenPhong: "asc" } }),
    prisma.khoa.findMany({ orderBy: { tenKhoa: "asc" } }),
  ]);

  const assignedDevices = devices.filter((item) => item.phongId || item.khoaId).length;
  const unassignedDevices = devices.length - assignedDevices;
  const assignedRooms = new Set(devices.filter((item) => item.phongId).map((item) => item.phongId)).size;
  const assignedFaculties = new Set(devices.filter((item) => item.khoaId).map((item) => item.khoaId)).size;

  const serializedDevices = devices.map((d) => ({
    id: d.id,
    maThietBi: d.maThietBi,
    tenThietBi: d.tenThietBi,
    danhMuc: d.danhMuc.tenDM,
    khoa: d.khoa?.tenKhoa ?? null,
    phong: d.phong?.tenPhong ?? null,
    trangThai: d.trangThai,
  }));

  const serializedMovements = movements.map((m) => ({
    id: m.id,
    thietBi: m.thietBi,
    tuPhong: m.tuPhong,
    denPhong: m.denPhong,
    tuKhoa: m.tuKhoa,
    denKhoa: m.denKhoa,
    lyDo: m.lyDo,
    nguoiThucHien: m.nguoiThucHien,
    ngayDiChuyen: m.ngayDiChuyen.toISOString(),
  }));

  const roomOptions = rooms.map((r) => ({
    id: r.id,
    label: r.tenPhong,
    subLabel: r.maPhong,
  }));

  const facultyOptions = faculties.map((f) => ({
    id: f.id,
    label: f.tenKhoa,
  }));

  return (
    <>
      <Topbar
        title="Phân bổ thiết bị"
        description="Quản lý việc gán thiết bị vào phòng, khoa và theo dõi lịch sử di chuyển."
      />
      <main className="space-y-6 p-6">
        <PhanBoManagementPanel
          devices={serializedDevices}
          movements={serializedMovements}
          rooms={roomOptions}
          faculties={facultyOptions}
          summary={[
            { title: "Đã phân bổ", value: String(assignedDevices), note: "Thiết bị có phòng/khoa" },
            { title: "Chưa phân bổ", value: String(unassignedDevices), note: "Thiết bị chưa gán vị trí" },
            { title: "Phòng đang dùng", value: String(assignedRooms), note: "Phòng có thiết bị" },
            { title: "Khoa tham gia", value: String(assignedFaculties), note: "Đơn vị nhận tài sản" },
          ]}
        />
      </main>
    </>
  );
}
