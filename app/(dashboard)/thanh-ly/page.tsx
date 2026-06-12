import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ThanhLyPage() {
  const [liquidatedDevices, brokenDevices, maintenanceDevices] = await Promise.all([
    prisma.thietBi.findMany({
      where: { trangThai: "THANH_LY" },
      include: { danhMuc: true, phong: true, khoa: true },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.thietBi.findMany({
      where: { trangThai: "HONG" },
      include: { danhMuc: true, phong: true, khoa: true },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    prisma.baoTri.findMany({
      include: {
        thietBi: {
          select: {
            maThietBi: true,
            tenThietBi: true,
            trangThai: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const liquidatedValue = liquidatedDevices.reduce((sum, item) => sum + Number(item.giaTriBanDau), 0);
  const brokenValue = brokenDevices.reduce((sum, item) => sum + Number(item.giaTriBanDau), 0);

  return (
    <>
      <Topbar
        title="Thanh lý"
        description="Quản lý tài sản không còn sử dụng, giá trị thu hồi và các bước duyệt."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tài sản thanh lý</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{liquidatedDevices.length}</p>
            <p className="mt-2 text-sm text-slate-500">Đang có trạng thái thanh lý</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Giá trị thu hồi</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {formatCurrency(liquidatedValue)}
            </p>
            <p className="mt-2 text-sm text-slate-500">Tổng giá trị ước tính</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Thiết bị hỏng</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{brokenDevices.length}</p>
            <p className="mt-2 text-sm text-slate-500">{formatCurrency(brokenValue)} giá trị ban đầu</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Phiếu bảo trì gần đây</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{maintenanceDevices.length}</p>
            <p className="mt-2 text-sm text-slate-500">Liên quan đến quy trình đánh giá</p>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-950">Danh sách thanh lý</h3>
            <p className="mt-2 text-sm text-slate-500">
              Các tài sản đã hoặc sắp được loại bỏ khỏi danh mục hoạt động.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-500">
                    <th className="px-4 py-3 font-medium">Mã TB</th>
                    <th className="px-4 py-3 font-medium">Tên thiết bị</th>
                    <th className="px-4 py-3 font-medium">Danh mục</th>
                    <th className="px-4 py-3 font-medium">Phòng</th>
                    <th className="px-4 py-3 font-medium">Giá trị</th>
                    <th className="px-4 py-3 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {liquidatedDevices.length === 0 ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
                        Chưa có tài sản nào trong trạng thái thanh lý.
                      </td>
                    </tr>
                  ) : (
                    liquidatedDevices.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-900">{item.maThietBi}</td>
                        <td className="px-4 py-3 text-slate-700">{item.tenThietBi}</td>
                        <td className="px-4 py-3 text-slate-700">{item.danhMuc.tenDM}</td>
                        <td className="px-4 py-3 text-slate-700">{item.phong?.tenPhong ?? "--"}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {formatCurrency(Number(item.giaTriBanDau))}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={item.trangThai} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-950">Thiết bị cần đánh giá</h3>
              <div className="mt-5 space-y-3">
                {brokenDevices.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    Không có thiết bị hỏng nào cần xử lý thanh lý.
                  </div>
                ) : (
                  brokenDevices.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                      <p className="font-medium text-slate-950">
                        {item.maThietBi} - {item.tenThietBi}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.danhMuc.tenDM} | {item.khoa?.tenKhoa ?? "--"} | {item.phong?.tenPhong ?? "--"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-950">Checklist thanh lý</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <li>1. Xác minh tình trạng và lý do loại bỏ.</li>
                <li>2. Đối chiếu giá trị thu hồi và biên bản duyệt.</li>
                <li>3. Cập nhật trạng thái tài sản và nhật ký hoạt động.</li>
                <li>4. Lưu phương án xử lý: bán, hủy hoặc tái sử dụng.</li>
              </ul>
              <div className="mt-5 rounded-2xl bg-slate-900 p-4 text-sm text-slate-300">
                Mục tiêu: kết thúc vòng đời tài sản rõ ràng, có dấu vết duyệt và kế toán.
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
