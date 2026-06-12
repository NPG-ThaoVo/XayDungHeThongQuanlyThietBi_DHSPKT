import { StatusBadge } from "@/components/shared/status-badge";

type BorrowItem = {
  id: string;
  maPhiếu: string;
  nguoiMuon: string;
  thietBi: string;
  ngayMuon: string;
  ngayTraDuKien: string;
  trangThai: string;
};

export function BorrowTable({ data }: { data: BorrowItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Ma phieu</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Người mượn</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Thiết bị</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Ngày mượn</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Hạn trả</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{item.maPhiếu}</td>
              <td className="px-4 py-3">{item.nguoiMuon}</td>
              <td className="px-4 py-3">{item.thietBi}</td>
              <td className="px-4 py-3">{item.ngayMuon}</td>
              <td className="px-4 py-3">{item.ngayTraDuKien}</td>
              <td className="px-4 py-3">
                <StatusBadge status={item.trangThai} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
