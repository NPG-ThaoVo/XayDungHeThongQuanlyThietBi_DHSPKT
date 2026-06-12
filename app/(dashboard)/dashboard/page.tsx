import { Card } from "@/components/ui/card";
import { Topbar } from "@/components/layout/topbar";
import { dashboardStats, reports } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <>
      <Topbar
        title="Tổng quan hệ thống"
        description="Theo dõi tình trạng thiết bị, phiếu nghiệp vụ và mức độ sẵn sàng của kho."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item) => (
            <Card key={item.label} className="p-5">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.note}</p>
            </Card>
          ))}
        </section>
        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-950">Trạng thái triển khai</h3>
            <div className="mt-6 grid gap-4">
              {[
                "Prisma schema + seed đã được scaffold",
                "Auth.js credentials + middleware đã được thêm",
                "API route cho thiết bị, 2FA, cron đã có sẵn",
                "Dashboard module cho thiết bị, phiếu nhập, kiểm kê, báo cáo",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-950">Báo cáo nhanh</h3>
            <div className="mt-6 space-y-3">
              {reports.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <p className="mt-2 text-base font-medium text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </>
  );
}
