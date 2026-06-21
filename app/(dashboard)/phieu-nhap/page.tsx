import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { PhieuNhapManagementPanel } from "@/components/phieu-nhap/phieu-nhap-management-panel";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PhieuNhapPage() {
  const session = await auth();
  const userRole = session?.user?.role ?? "SINH_VIEN";

  const [phieuNhapList, nhaCungCapList] = await Promise.all([
    prisma.phieuNhap.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        nhaCungCap: { select: { id: true, tenNCC: true } },
        nguoiTao: { select: { id: true, name: true } },
        chiTiet: true,
      },
    }),
    prisma.nhaCungCap.findMany({ orderBy: { tenNCC: "asc" } }),
  ]);

  const totalValue = phieuNhapList.reduce((s, p) => s + Number(p.tongTien), 0);
  const totalItems = phieuNhapList.reduce(
    (s, p) => s + p.chiTiet.reduce((cs, ct) => cs + ct.soLuong, 0),
    0,
  );
  const pendingCount = phieuNhapList.filter((p) => p.trangThai === "CHO_DUYET").length;
  const doneCount = phieuNhapList.filter((p) => p.trangThai === "HOAN_TAT").length;

  return (
    <>
      <Topbar
        title="Phiếu nhập kho"
        description="Quản lý nhập kho, đối chiếu số lượng, nhà cung cấp và bảo hành theo lô."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng số phiếu</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{phieuNhapList.length}</p>
            <p className="mt-2 text-sm text-slate-500">Trong toàn bộ lịch sử</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng số lượng</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{totalItems}</p>
            <p className="mt-2 text-sm text-slate-500">Thiết bị và phụ kiện nhập kho</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng giá trị nhập</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{formatCurrency(totalValue)}</p>
            <p className="mt-2 text-sm text-slate-500">Giá trị tổng hợp của các phiếu</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Chờ duyệt</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{pendingCount}</p>
            <p className="mt-2 text-sm text-slate-500">{doneCount} phiếu đã hoàn tất</p>
          </Card>
        </section>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-950 mb-6">Danh sách phiếu nhập</h3>
          <PhieuNhapManagementPanel
            initialData={JSON.parse(JSON.stringify(phieuNhapList))}
            nhaCungCapList={nhaCungCapList}
            userRole={userRole}
          />
        </Card>
      </main>
    </>
  );
}
