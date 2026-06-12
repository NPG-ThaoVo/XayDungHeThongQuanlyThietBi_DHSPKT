import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PhanBoPage() {
  const [devices, movements] = await Promise.all([
    prisma.thietBi.findMany({
      include: {
        khoa: true,
        phong: true,
        danhMuc: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
    prisma.lichSuDiChuyen.findMany({
      include: {
        thietBi: {
          select: {
            maThietBi: true,
            tenThietBi: true,
          },
        },
      },
      orderBy: { ngayDiChuyen: "desc" },
      take: 6,
    }),
  ]);

  const assignedDevices = devices.filter((item) => item.phongId || item.khoaId).length;
  const assignedRooms = new Set(devices.filter((item) => item.phongId).map((item) => item.phongId)).size;
  const assignedFaculties = new Set(devices.filter((item) => item.khoaId).map((item) => item.khoaId)).size;
  const movementCount = movements.length;

  return (
    <>
      <Topbar
        title="Phân bổ thiết bị"
        description="Theo dõi các tài sản đã gán phòng, khoa và lịch sử di chuyển gần đây."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Thiết bị đã gán</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{assignedDevices}</p>
            <p className="mt-2 text-sm text-slate-500">Có phòng hoặc khoa phân bổ</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Phòng đang sử dụng</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{assignedRooms}</p>
            <p className="mt-2 text-sm text-slate-500">Vị trí có thiết bị được ghi nhận</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Khoa tham gia</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{assignedFaculties}</p>
            <p className="mt-2 text-sm text-slate-500">Đơn vị đang nhận tài sản</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Lịch sử di chuyển</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{movementCount}</p>
            <p className="mt-2 text-sm text-slate-500">Bản ghi gần nhất trong hệ thống</p>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-950">Tài sản đang phân bổ</h3>
            <p className="mt-2 text-sm text-slate-500">
              Danh sách thiết bị, khoa và phòng hiện tại được lấy trực tiếp từ cơ sở dữ liệu.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-500">
                    <th className="px-4 py-3 font-medium">Mã TB</th>
                    <th className="px-4 py-3 font-medium">Tên thiết bị</th>
                    <th className="px-4 py-3 font-medium">Danh mục</th>
                    <th className="px-4 py-3 font-medium">Khoa</th>
                    <th className="px-4 py-3 font-medium">Phòng</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.maThietBi}</td>
                      <td className="px-4 py-3 text-slate-700">{item.tenThietBi}</td>
                      <td className="px-4 py-3 text-slate-700">{item.danhMuc.tenDM}</td>
                      <td className="px-4 py-3 text-slate-700">{item.khoa?.tenKhoa ?? "--"}</td>
                      <td className="px-4 py-3 text-slate-700">{item.phong?.tenPhong ?? "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-950">Lịch sử phân bổ gần đây</h3>
              <div className="mt-5 space-y-3">
                {movements.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    Chưa có bản ghi di chuyển nào trong hệ thống.
                  </div>
                ) : (
                  movements.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                      <p className="font-medium text-slate-950">
                        {item.thietBi.maThietBi} - {item.thietBi.tenThietBi}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Từ {item.tuPhong ?? "--"} đến {item.denPhong ?? "--"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Lý do: {item.lyDo ?? "--"} | {formatDate(item.ngayDiChuyen)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-950">Quy tắc phân bổ</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <li>1. Thiết bị phải có danh mục trước khi điều chuyển.</li>
                <li>2. Mỗi phân bổ cần có khoa, phòng và người bàn giao rõ ràng.</li>
                <li>3. Mỗi lần di chuyển cần ghi lý do và lưu lịch sử.</li>
                <li>4. Tài sản thanh lý không nên tiếp tục được phân bổ.</li>
              </ul>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
