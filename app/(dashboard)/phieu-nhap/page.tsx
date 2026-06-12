import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

const purchaseReceipts = [
  {
    id: "pn-001",
    maPhieu: "PN-001",
    nhaCungCap: "Công ty Thiết Bị HCM",
    soLuong: 12,
    tongTien: 168000000,
    ngayNhap: new Date("2026-06-10"),
    trangThai: "HOAN_TAT",
  },
  {
    id: "pn-002",
    maPhieu: "PN-002",
    nhaCungCap: "FPT Smart Edu",
    soLuong: 4,
    tongTien: 55600000,
    ngayNhap: new Date("2026-06-08"),
    trangThai: "CHO_DUYET",
  },
  {
    id: "pn-003",
    maPhieu: "PN-003",
    nhaCungCap: "Công ty Thiết Bị HCM",
    soLuong: 8,
    tongTien: 96000000,
    ngayNhap: new Date("2026-06-03"),
    trangThai: "DA_KIEM",
  },
];

const checklist = [
  "Xác nhận đơn đặt hàng",
  "Kiểm tra số lượng và serial",
  "Đối chiếu bảo hành và hóa đơn",
  "Cập nhật danh mục và phân bổ",
];

export default function PhieuNhapPage() {
  const totalValue = purchaseReceipts.reduce((sum, item) => sum + item.tongTien, 0);
  const totalQuantity = purchaseReceipts.reduce((sum, item) => sum + item.soLuong, 0);
  const awaitingCount = purchaseReceipts.filter((item) => item.trangThai === "CHO_DUYET").length;
  const completedCount = purchaseReceipts.filter((item) => item.trangThai === "HOAN_TAT").length;

  return (
    <>
      <Topbar
        title="Phiếu nhập"
        description="Quản lý nhập kho, đối chiếu số lượng, nhà cung cấp và bảo hành theo lô."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Phiếu trong kỳ</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{purchaseReceipts.length}</p>
            <p className="mt-2 text-sm text-slate-500">Đang theo dõi và đối chiếu</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng số lượng</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{totalQuantity}</p>
            <p className="mt-2 text-sm text-slate-500">Thiết bị và phụ kiện nhập kho</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng giá trị</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{formatCurrency(totalValue)}</p>
            <p className="mt-2 text-sm text-slate-500">Giá trị tổng hợp của các phiếu</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Chờ duyệt</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{awaitingCount}</p>
            <p className="mt-2 text-sm text-slate-500">{completedCount} phiếu đã hoàn tất</p>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Phiếu nhập gần đây</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Đối chiếu chứng từ, số lượng và trạng thái xử lý của từng phiếu.
                </p>
              </div>
              <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                Dữ liệu mẫu cho UI
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-500">
                    <th className="px-4 py-3 font-medium">Mã phiếu</th>
                    <th className="px-4 py-3 font-medium">Nhà cung cấp</th>
                    <th className="px-4 py-3 font-medium">Số lượng</th>
                    <th className="px-4 py-3 font-medium">Tổng tiền</th>
                    <th className="px-4 py-3 font-medium">Ngày nhập</th>
                    <th className="px-4 py-3 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseReceipts.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.maPhieu}</td>
                      <td className="px-4 py-3 text-slate-700">{item.nhaCungCap}</td>
                      <td className="px-4 py-3 text-slate-700">{item.soLuong}</td>
                      <td className="px-4 py-3 text-slate-700">{formatCurrency(item.tongTien)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatDate(item.ngayNhap)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.trangThai} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-950">Checklist nhập kho</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </main>
    </>
  );
}
