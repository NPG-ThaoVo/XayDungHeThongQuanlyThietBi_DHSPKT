"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { taoPhiếuMuon, duyetPhiếuMuon, traThietBi } from "@/app/actions/muon-tra.actions";

type ThietBiOption = { id: string; tenThietBi: string; maThietBi: string };
type PhieuMuonItem = {
  id: string;
  maPhieu: string;
  trangThai: string;
  mucDich: string;
  ngayMuon: string;
  ngayTraDuKien: string;
  ngayTraThucTe: string | null;
  tinhTrangTra: string | null;
  thietBi: { id: string; tenThietBi: string; maThietBi: string };
  nguoiMuon: { id: string; name: string; email: string };
};

type Props = {
  initialData: PhieuMuonItem[];
  thietBiList: ThietBiOption[];
  userRole: string;
};

const managerRoles = ["ADMIN", "THU_KHO", "TRUONG_KHOA"];

type CreateForm = {
  thietBiId: string;
  mucDich: string;
  ngayMuon: string;
  ngayTraDuKien: string;
};

const today = new Date().toISOString().slice(0, 10);
const emptyForm: CreateForm = { thietBiId: "", mucDich: "", ngayMuon: today, ngayTraDuKien: today };

export function MuonTraManagementPanel({ initialData, thietBiList, userRole }: Props) {
  const [data, setData] = useState<PhieuMuonItem[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tinhTrangTra, setTinhTrangTra] = useState("");
  const [returnTarget, setReturnTarget] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isManager = managerRoles.includes(userRole);
  function f(field: keyof CreateForm, val: string) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      try {
        await taoPhiếuMuon(form);
        setSuccess("Tạo phiếu mượn thành công! Chờ cán bộ duyệt.");
        setShowForm(false);
        setForm(emptyForm);
        window.location.reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tạo phiếu mượn");
      }
    });
  }

  function handleApprove(id: string, approved: boolean) {
    startTransition(async () => {
      try {
        await duyetPhiếuMuon(id, approved);
        setData((prev) =>
          prev.map((p) => (p.id === id ? { ...p, trangThai: approved ? "DA_DUYET" : "TU_CHOI" } : p)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi duyệt phiếu");
      }
    });
  }

  function handleReturn(id: string) {
    if (!tinhTrangTra) { setError("Vui lòng nhập tình trạng thiết bị khi trả"); return; }
    startTransition(async () => {
      try {
        await traThietBi(id, tinhTrangTra);
        setData((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, trangThai: "DA_TRA", ngayTraThucTe: new Date().toISOString(), tinhTrangTra }
              : p,
          ),
        );
        setReturnTarget(null);
        setTinhTrangTra("");
        setSuccess("Đã ghi nhận trả thiết bị thành công.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi trả thiết bị");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          {error ? <p className="text-sm text-rose-600 font-medium">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600 font-medium">{success}</p> : null}
        </div>
        <Button onClick={() => { setShowForm(true); setError(null); setSuccess(null); }}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo phiếu mượn
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Tạo phiếu mượn thiết bị</h3>
            <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }}>
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Thiết bị cần mượn *</label>
              <select value={form.thietBiId} onChange={(e) => f("thietBiId", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                <option value="">-- Chọn thiết bị --</option>
                {thietBiList.map((tb) => (
                  <option key={tb.id} value={tb.id}>{tb.tenThietBi} ({tb.maThietBi})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Mục đích *</label>
              <Input value={form.mucDich} onChange={(e) => f("mucDich", e.target.value)} placeholder="Mô tả mục đích (ít nhất 5 ký tự)" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Ngày mượn *</label>
              <Input type="date" value={form.ngayMuon} onChange={(e) => f("ngayMuon", `${e.target.value}T00:00:00.000Z`)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Ngày trả dự kiến *</label>
              <Input type="date" value={form.ngayTraDuKien} onChange={(e) => f("ngayTraDuKien", `${e.target.value}T00:00:00.000Z`)} />
            </div>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setShowForm(false); setForm(emptyForm); }}>Hủy</Button>
            <Button onClick={handleCreate} disabled={isPending}>
              {isPending ? "Đang tạo..." : "Gửi yêu cầu mượn"}
            </Button>
          </div>
        </div>
      )}

      {returnTarget && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-amber-800">Ghi nhận trả thiết bị</p>
            <button type="button" onClick={() => { setReturnTarget(null); setTinhTrangTra(""); }}>
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <div className="flex gap-3">
            <Input value={tinhTrangTra} onChange={(e) => setTinhTrangTra(e.target.value)} placeholder="Tình trạng thiết bị khi trả (VD: Tốt, Bị xước...)" className="flex-1" />
            <Button onClick={() => handleReturn(returnTarget)} disabled={isPending}>
              {isPending ? "Đang xử lý..." : "Xác nhận trả"}
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Mã phiếu</th>
              <th className="px-4 py-3 font-medium">Thiết bị</th>
              {isManager && <th className="px-4 py-3 font-medium">Người mượn</th>}
              <th className="px-4 py-3 font-medium">Mục đích</th>
              <th className="px-4 py-3 font-medium">Ngày mượn</th>
              <th className="px-4 py-3 font-medium">Ngày trả DK</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              {isManager && <th className="px-4 py-3 font-medium">Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={isManager ? 8 : 6} className="px-4 py-8 text-center text-slate-400 text-sm">
                  Chưa có phiếu mượn nào.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.maPhieu.slice(-8)}</td>
                  <td className="px-4 py-3 text-slate-700">{item.thietBi.tenThietBi}</td>
                  {isManager && <td className="px-4 py-3 text-slate-600">{item.nguoiMuon.name}</td>}
                  <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{item.mucDich}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(new Date(item.ngayMuon))}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(new Date(item.ngayTraDuKien))}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.trangThai} /></td>
                  {isManager && (
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {item.trangThai === "CHO_DUYET" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(item.id, true)}
                              disabled={isPending}
                              className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                            >
                              Duyệt
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApprove(item.id, false)}
                              disabled={isPending}
                              className="rounded-lg bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100"
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                        {item.trangThai === "DA_DUYET" && (
                          <button
                            type="button"
                            onClick={() => setReturnTarget(item.id)}
                            className="rounded-lg bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-100"
                          >
                            Ghi trả
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
