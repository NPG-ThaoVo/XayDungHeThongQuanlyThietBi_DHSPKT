"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { phanBoThietBi } from "@/app/actions/phan-bo.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type Option = {
  id: string;
  label: string;
  subLabel?: string;
};

type DeviceItem = {
  id: string;
  maThietBi: string;
  tenThietBi: string;
  danhMuc: string;
  khoa: string | null;
  phong: string | null;
  trangThai: string;
};

type MovementItem = {
  id: string;
  thietBi: { maThietBi: string; tenThietBi: string };
  tuPhong: string | null;
  denPhong: string | null;
  tuKhoa: string | null;
  denKhoa: string | null;
  lyDo: string | null;
  nguoiThucHien: string;
  ngayDiChuyen: string;
};

type SummaryCard = {
  title: string;
  value: string;
  note: string;
};

const emptyForm = {
  thietBiId: "",
  denPhong: "",
  denKhoa: "",
  lyDo: "",
};

export function PhanBoManagementPanel({
  devices,
  movements,
  rooms,
  faculties,
  summary,
}: {
  devices: DeviceItem[];
  movements: MovementItem[];
  rooms: Option[];
  faculties: Option[];
  summary: SummaryCard[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const unassignedCount = useMemo(
    () => devices.filter((d) => !d.phong && !d.khoa).length,
    [devices],
  );

  function updateField<K extends keyof typeof emptyForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function refreshPage(message: string) {
    setSuccess(message);
    setError(null);
    startTransition(() => { router.refresh(); });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await phanBoThietBi({
        thietBiId: form.thietBiId,
        denPhong: form.denPhong || undefined,
        denKhoa: form.denKhoa || undefined,
        lyDo: form.lyDo || undefined,
      });

      if (!result.success) throw new Error("Phân bổ thất bại");

      setForm(emptyForm);
      refreshPage("Phân bổ thiết bị thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.title} className="p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{item.title}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm text-slate-500">{item.note}</p>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        {/* Device List */}
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-lg font-semibold text-slate-950">Danh sách thiết bị</h3>
            <p className="mt-1 text-sm text-slate-500">
              {devices.length} thiết bị, {unassignedCount} chưa phân bổ.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Mã TB</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Tên thiết bị</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Danh mục</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Khoa</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Phòng</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">{item.maThietBi}</td>
                    <td className="px-4 py-3 text-slate-700">{item.tenThietBi}</td>
                    <td className="px-4 py-3 text-slate-700">{item.danhMuc}</td>
                    <td className="px-4 py-3 text-slate-700">{item.khoa ?? "--"}</td>
                    <td className="px-4 py-3 text-slate-700">{item.phong ?? "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Allocation Form */}
          <Card className="p-5">
            <h3 className="text-lg font-semibold text-slate-950">Phân bổ thiết bị</h3>
            <p className="mt-2 text-sm text-slate-500">
              Chọn thiết bị và vị trí đích để phân bổ.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Thiết bị</label>
                <select
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  value={form.thietBiId}
                  onChange={(e) => updateField("thietBiId", e.target.value)}
                  required
                >
                  <option value="">Chọn thiết bị</option>
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.maThietBi} — {d.tenThietBi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phòng đích</label>
                <select
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  value={form.denPhong}
                  onChange={(e) => updateField("denPhong", e.target.value)}
                >
                  <option value="">Không gán phòng</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}{r.subLabel ? ` (${r.subLabel})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Khoa đích</label>
                <select
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  value={form.denKhoa}
                  onChange={(e) => updateField("denKhoa", e.target.value)}
                >
                  <option value="">Không gán khoa</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Lý do (tuỳ chọn)</label>
                <Input
                  value={form.lyDo}
                  onChange={(e) => updateField("lyDo", e.target.value)}
                  placeholder="VD: Điều chuyển công tác"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Đang xử lý..." : "Phân bổ"}
              </Button>

              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
            </form>
          </Card>

          {/* Recent Movements */}
          <Card className="p-5">
            <h3 className="text-lg font-semibold text-slate-950">Lịch sử gần đây</h3>
            <div className="mt-4 space-y-3">
              {movements.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  Chưa có bản ghi di chuyển.
                </div>
              ) : (
                movements.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-100 p-3">
                    <p className="font-medium text-slate-950 text-sm">
                      {item.thietBi.maThietBi} — {item.thietBi.tenThietBi}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Từ {item.tuPhong ?? item.tuKhoa ?? "--"} → {item.denPhong ?? item.denKhoa ?? "--"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.lyDo ? `Lý do: ${item.lyDo} | ` : ""}
                      {item.nguoiThucHien} — {formatDate(item.ngayDiChuyen)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
