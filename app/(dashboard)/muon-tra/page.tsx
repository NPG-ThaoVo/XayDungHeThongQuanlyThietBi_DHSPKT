import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { MuonTraManagementPanel } from "@/components/muon-tra/muon-tra-management-panel";

export const dynamic = "force-dynamic";

export default async function MuonTraPage() {
  const session = await auth();
  const userRole = session?.user?.role ?? "SINH_VIEN";
  const userId = session?.user?.id ?? "";

  const managerRoles = ["ADMIN", "THU_KHO", "TRUONG_KHOA"];
  const isManager = managerRoles.includes(userRole);

  const [phieuList, thietBiList] = await Promise.all([
    prisma.phieuMuon.findMany({
      where: isManager ? {} : { nguoiMuonId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        thietBi: { select: { id: true, tenThietBi: true, maThietBi: true } },
        nguoiMuon: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.thietBi.findMany({
      where: { trangThai: "TOT" },
      select: { id: true, tenThietBi: true, maThietBi: true },
      orderBy: { tenThietBi: "asc" },
    }),
  ]);

  const totalCount = phieuList.length;
  const pendingCount = phieuList.filter((p) => p.trangThai === "CHO_DUYET").length;
  const activeCount = phieuList.filter((p) => p.trangThai === "DA_DUYET").length;
  const returnedCount = phieuList.filter((p) => p.trangThai === "DA_TRA").length;

  return (
    <>
      <Topbar
        title="Mượn - Trả thiết bị"
        description="Quản lý yêu cầu mượn, duyệt phiếu và ghi nhận trả thiết bị."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng phiếu mượn</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{totalCount}</p>
            <p className="mt-2 text-sm text-slate-500">Tất cả phiếu mượn</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Chờ duyệt</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{pendingCount}</p>
            <p className="mt-2 text-sm text-slate-500">Cần được phê duyệt</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Đang mượn</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{activeCount}</p>
            <p className="mt-2 text-sm text-slate-500">Thiết bị đang được sử dụng</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Đã trả</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{returnedCount}</p>
            <p className="mt-2 text-sm text-slate-500">Thiết bị đã được hoàn trả</p>
          </Card>
        </section>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-950 mb-6">Danh sách phiếu mượn</h3>
          <MuonTraManagementPanel
            initialData={JSON.parse(JSON.stringify(phieuList))}
            thietBiList={thietBiList}
            userRole={userRole}
            userId={userId}
          />
        </Card>
      </main>
    </>
  );
}
