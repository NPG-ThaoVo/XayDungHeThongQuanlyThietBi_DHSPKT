"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

type NhaCungCap = { id: string; tenNCC: string };
type ChiTietRow = { tenThietBi: string; soLuong: number; donGia: number; ghiChu: string };

type PhieuNhapItem = {
  id: string;
  maPhieu: string;
  trangThai: string;
  tongTien: number;
  ngayNhap: string;
  ghiChu: string | null;
  nhaCungCap: { id: string; tenNCC: string };
  nguoiTao: { name: string };
  chiTiet: Array<{ id: string; tenThietBi: string; soLuong: number; donGia: number }>;
};

type Props = {
  initialData: PhieuNhapItem[];
  nhaCungCapList: NhaCungCap[];
  userRole: string;
};

const emptyRow = (): ChiTietRow => ({ tenThietBi: "", soLuong: 1, donGia: 0, ghiChu: "" });

const TRANG_THAI_OPTIONS = [
  { value: "CHO_DUYET", label: "Chờ duyệt" },
  { value: "DA_DUYET", label: "Đã duyệt" },
  { value: "TU_CHOI", label: "Từ chối" },
  { value: "HOAN_TAT", label: "Hoàn tất" },
] as const;

export function PhieuNhapManagementPanel({ initialData, nhaCungCapList, userRole }: Props) {
  const router = useRouter();
  const [data, setData] = useState<PhieuNhapItem[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [selectedPhieu, setSelectedPhieu] = useState<PhieuNhapItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nhaCungCapId, setNhaCungCapId] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [chiTiet, setChiTiet] = useState<ChiTietRow[]>([emptyRow()]);

  const canWrite = userRole === "ADMIN" || userRole === "THU_KHO" || userRole === "TRUONG_KHOA";

  async function handleCreate() {
    if (!nhaCungCapId) { setError("Vui lòng chọn nhà cung cấp"); return; }
    const invalid = chiTiet.find((r) => !r.tenThietBi || r.soLuong < 1 || r.donGia <= 0);
    if (invalid) { setError("Vui lòng điền đầy đủ thông tin các dòng thiết bị"); return; }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/phieu-nhap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nhaCungCapId, ghiChu, chiTiet }),
      });
      const result = await res.json() as PhieuNhapItem & { error?: string };
      if (!res.ok) throw new Error(result.error ?? "Lỗi tạo phiếu nhập");
      setData((prev) => [result, ...prev]);
      setShowForm(false);
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateStatus(id: string, trangThai: string) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/phieu-nhap/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trangThai }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật trạng thái");
      setData((prev) =>
        prev.map((p) => (p.id === id ? { ...p, trangThai } : p)),
      );
      setSelectedPhieu(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setNhaCungCapId("");
    setGhiChu("");
    setChiTiet([emptyRow()]);
    setError(null);
  }

  function updateRow(index: number, field: keyof ChiTietRow, value: string | number) {
    setChiTiet((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  const tongTienForm = chiTiet.reduce((s, r) => s + r.soLuong * r.donGia, 0);

  return (
    <div className="space-y-6">
      {canWrite && !showForm && (
        <div className="flex justify-end">
          <Button onClick={() => { setShowForm(true); setError(null); }}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo phiếu nhập mới
          </Button>
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Tạo phiếu nhập mới</h3>
            <button onClick={() => { setShowForm(false); resetForm(); }} type="button">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Nhà cung cấp *</label>
              <select
                value={nhaCungCapId}
                onChange={(e) => setNhaCungCapId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {nhaCungCapList.map((n) => (
                  <option key={n.id} value={n.id}>{n.tenNCC}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Ghi chú</label>
              <Input value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Ghi chú..." />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-700">Danh sách thiết bị</p>
              <Button variant="secondary" size="sm" onClick={() => setChiTiet((p) => [...p, emptyRow()])}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Thêm dòng
              </Button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-500">
                    <th className="px-3 py-2 font-medium">Tên thiết bị</th>
                    <th className="px-3 py-2 font-medium w-20">SL</th>
                    <th className="px-3 py-2 font-medium w-32">Đơn giá (VNĐ)</th>
                    <th className="px-3 py-2 font-medium">Ghi chú</th>
                    <th className="px-3 py-2 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {chiTiet.map((row, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-2 py-1.5">
                        <Input value={row.tenThietBi} onChange={(e) => updateRow(i, "tenThietBi", e.target.value)} placeholder="Tên..." />
                      </td>
                      <td className="px-2 py-1.5">
                        <Input type="number" value={row.soLuong} min={1} onChange={(e) => updateRow(i, "soLuong", Number(e.target.value))} />
                      </td>
                      <td className="px-2 py-1.5">
                        <Input type="number" value={row.donGia} min={0} onChange={(e) => updateRow(i, "donGia", Number(e.target.value))} />
                      </td>
                      <td className="px-2 py-1.5">
                        <Input value={row.ghiChu} onChange={(e) => updateRow(i, "ghiChu", e.target.value)} placeholder="..." />
                      </td>
                      <td className="px-2 py-1.5">
                        {chiTiet.length > 1 && (
                          <button type="button" onClick={() => setChiTiet((p) => p.filter((_, j) => j !== i))}>
                            <X className="h-4 w-4 text-slate-400 hover:text-rose-500" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200 bg-slate-50">
                    <td colSpan={2} className="px-3 py-2 text-sm font-semibold text-slate-700">
                      Tổng tiền
                    </td>
                    <td colSpan={3} className="px-3 py-2 text-sm font-semibold text-teal-700">
                      {formatCurrency(tongTienForm)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {error ? <p className="text-sm text-rose-600 font-medium">{error}</p> : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setShowForm(false); resetForm(); }}>Hủy</Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? "Đang tạo..." : "Tạo phiếu nhập"}
            </Button>
          </div>
        </div>
      )}

      {selectedPhieu && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Chi tiết: {selectedPhieu.maPhieu}</h3>
            <button type="button" onClick={() => setSelectedPhieu(null)}>
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-teal-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-500">
                  <th className="px-3 py-2 font-medium">Tên thiết bị</th>
                  <th className="px-3 py-2 font-medium">Số lượng</th>
                  <th className="px-3 py-2 font-medium">Đơn giá</th>
                  <th className="px-3 py-2 font-medium">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedPhieu.chiTiet.map((ct) => (
                  <tr key={ct.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{ct.tenThietBi}</td>
                    <td className="px-3 py-2">{ct.soLuong}</td>
                    <td className="px-3 py-2">{formatCurrency(Number(ct.donGia))}</td>
                    <td className="px-3 py-2">{formatCurrency(Number(ct.donGia) * ct.soLuong)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {canWrite && (
            <div className="flex gap-2 flex-wrap">
              {TRANG_THAI_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  size="sm"
                  variant={selectedPhieu.trangThai === opt.value ? "default" : "secondary"}
                  onClick={() => handleUpdateStatus(selectedPhieu.id, opt.value)}
                  disabled={isLoading || selectedPhieu.trangThai === opt.value}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="overflow-auto rounded-2xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Mã phiếu</th>
              <th className="px-4 py-3 font-medium">Nhà cung cấp</th>
              <th className="px-4 py-3 font-medium">Tổng tiền</th>
              <th className="px-4 py-3 font-medium">Ngày nhập</th>
              <th className="px-4 py-3 font-medium">Người tạo</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">
                  Chưa có phiếu nhập nào.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setSelectedPhieu(selectedPhieu?.id === item.id ? null : item)}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{item.maPhieu}</td>
                  <td className="px-4 py-3 text-slate-700">{item.nhaCungCap.tenNCC}</td>
                  <td className="px-4 py-3 text-slate-700">{formatCurrency(Number(item.tongTien))}</td>
                  <td className="px-4 py-3 text-slate-700">{formatDate(new Date(item.ngayNhap))}</td>
                  <td className="px-4 py-3 text-slate-500">{item.nguoiTao?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.trangThai} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
