import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const actionLabels: Record<string, string> = {
  CREATE: "Tạo mới",
  UPDATE: "Cập nhật",
  DELETE: "Xóa",
  LOGIN: "Đăng nhập",
};

export default async function NhatKyHoatDongPage() {
  const logs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const totalLogs = logs.length;
  const loginCount = logs.filter((item) => item.action === "LOGIN").length;
  const deviceLogs = logs.filter((item) => item.entity === "ThietBi").length;
  const todayCount = logs.filter((item) => {
    const createdAt = new Date(item.createdAt);
    const today = new Date();
    return createdAt.toDateString() === today.toDateString();
  }).length;

  return (
    <>
      <Topbar
        title="Nhật ký hoạt động"
        description="Theo dõi các thay đổi dữ liệu, đăng nhập và hành động quản trị gần đây."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng bản ghi</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{totalLogs}</p>
            <p className="mt-2 text-sm text-slate-500">Dữ liệu gần đây trong hệ thống</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Đăng nhập</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{loginCount}</p>
            <p className="mt-2 text-sm text-slate-500">Theo dõi an toàn truy cập</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Liên quan thiết bị</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{deviceLogs}</p>
            <p className="mt-2 text-sm text-slate-500">Log tạo, sửa và xóa tài sản</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Hôm nay</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{todayCount}</p>
            <p className="mt-2 text-sm text-slate-500">Sự kiện phát sinh trong ngày</p>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_0.85fr]">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Dòng hoạt động gần đây</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Các sự kiện này đã được lưu trực tiếp từ AuditLog.
                </p>
              </div>
              <div className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                {logs.length === 0 ? "Không có log" : "Cập nhật liên tục"}
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-500">
                    <th className="px-4 py-3 font-medium">Thời gian</th>
                    <th className="px-4 py-3 font-medium">Người dùng</th>
                    <th className="px-4 py-3 font-medium">Hành động</th>
                    <th className="px-4 py-3 font-medium">Đối tượng</th>
                    <th className="px-4 py-3 font-medium">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={5}>
                        Chưa có bản ghi nhật ký nào.
                      </td>
                    </tr>
                  ) : (
                    logs.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-slate-700">{formatDate(item.createdAt)}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900">{item.user.name}</p>
                          <p className="text-xs text-slate-500">{item.user.email}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {actionLabels[item.action] ?? item.action}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{item.entity}</td>
                        <td className="px-4 py-3 text-slate-700">{item.detail ?? "--"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-950">Kỷ luật ghi log</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <li>1. Mọi thao tác quản trị cần có log rõ ràng.</li>
                <li>2. Log đăng nhập giúp truy vết truy cập bất thường.</li>
                <li>3. Thay đổi dữ liệu quan trọng nên lưu thêm chi tiết.</li>
                <li>4. Nhật ký được ưu tiên ở trạng thái chỉ đọc để bảo toàn lịch sử.</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-950">Định dạng dùng</h3>
              <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p>Hành động: CREATE, UPDATE, DELETE, LOGIN</p>
                <p>Đối tượng: ThietBi, BaoTri, KiemKe, User</p>
                <p>Chi tiết: JSON mô tả thay đổi nếu có</p>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
