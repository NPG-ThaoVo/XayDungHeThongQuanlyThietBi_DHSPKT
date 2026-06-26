"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { thanhLyThietBi } from "@/app/actions/thanh-ly.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

type DeviceCandidate = {
  id: string;
  maThietBi: string;
  tenThietBi: string;
  danhMuc: string;
  phong: string | null;
  khoa: string | null;
  giaTriBanDau: number;
  trangThai: string;
  baoHanhDen: string | null;
};

type ThanhLyRecord = {
  id: string;
  thietBi: { maThietBi: string; tenThietBi: string };
  giaTriThuHoi: number;
  phuongThuc: string;
  lyDo: string | null;
  nguoiThucHien: string;
  ngayThanhLy: string;
};

type SummaryCard = {
  title: string;
  value: string;
  note: string;
};

const emptyForm = {
  thietBiId: "",
  giaTriThuHoi: "",
  phuongThuc: "",
  lyDo: "",
};

const phuongThucLabels: Record<string, string> = {
  BAN: "Bán",
  HUY: "Hủy",
  TAI_SU_DUNG: "Tái sử dụng",
};

export function ThanhLyManagementPanel({
  candidates,
  liquidatedRecords,
  summary,
}: {
  candidates: DeviceCandidate[];
  liquidatedRecords: ThanhLyRecord[];
  summary: SummaryCard[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function updateField<K extends keyof typeof emptyForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function refreshPage(message: string) {
    setSuccess(message);
    setError(null);
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await thanhLyThietBi({
        thietBiId: form.thietBiId,
        giaTriThuHoi: form.giaTriThuHoi,
        phuongThuc: form.phuongThuc,
        lyDo: form.lyDo || undefined,
      });

      if (!result.success) throw new Error("Thanh lý thất bại");

      setForm(emptyForm);
      refreshPage("Thanh lý thiết bị thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setIsSubmitting(false);
    }
  }

  const totalRecoveryValue = liquidatedRecords.reduce((sum, r) => sum + r.giaTriThuHoi, 0);

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
        {/* Candidate Devices Table */}
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-lg font-semibold text-slate-950">Thiết bị cần thanh lý</h3>
            <p className="mt-1 text-sm text-slate-500">
              {candidates.length} thiết bị đang hỏng hoặc hết hạn bảo hành.
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
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Giá trị</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">BH đến</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-500" colSpan={8}>
                      Không có thiết bị nào cần thanh lý.
                    </td>
                  </tr>
                ) : (
                  candidates.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.maThietBi}</td>
                      <td className="px-4 py-3 text-slate-700">{item.tenThietBi}</td>
                      <td className="px-4 py-3 text-slate-700">{item.danhMuc}</td>
                      <td className="px-4 py-3 text-slate-700">{item.khoa ?? "--"}</td>
                      <td className="px-4 py-3 text-slate-700">{item.phong ?? "--"}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatCurrency(item.giaTriBanDau)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.trangThai} />
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.baoHanhDen ? formatDate(item.baoHanhDen) : "--"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Liquidation Form */}
          <Card className="p-5">
            <h3 className="text-lg font-semibold text-slate-950">Xử lý thanh lý</h3>
            <p className="mt-2 text-sm text-slate-500">
              Chọn thiết bị, nhập giá trị thu hồi và phương thức xử lý.
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
                  {candidates.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.maThietBi} — {d.tenThietBi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Giá trị thu hồi (VNĐ)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={form.giaTriThuHoi}
                  onChange={(e) => updateField("giaTriThuHoi", e.target.value)}
                  placeholder="VD: 500000"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phương thức xử lý</label>
                <select
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  value={form.phuongThuc}
                  onChange={(e) => updateField("phuongThuc", e.target.value)}
                  required
                >
                  <option value="">Chọn phương thức</option>
                  {Object.entries(phuongThucLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Lý do (tuỳ chọn)</label>
                <Input
                  value={form.lyDo}
                  onChange={(e) => updateField("lyDo", e.target.value)}
                  placeholder="VD: Hỏng không thể sửa chữa"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Đang xử lý..." : "Xác nhận thanh lý"}
              </Button>

              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
            </form>
          </Card>

          {/* Recent Liquidation History */}
          <Card className="p-5">
            <h3 className="text-lg font-semibold text-slate-950">Thanh lý gần đây</h3>
            <div className="mt-4 space-y-3">
              {liquidatedRecords.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  Chưa có thiết bị nào được thanh lý.
                </div>
              ) : (
                liquidatedRecords.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-100 p-3">
                    <p className="font-medium text-slate-950 text-sm">
                      {item.thietBi.maThietBi} — {item.thietBi.tenThietBi}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Thu hồi: {formatCurrency(item.giaTriThuHoi)} |{" "}
                      Phương thức: {phuongThucLabels[item.phuongThuc] ?? item.phuongThuc}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.lyDo ? `Lý do: ${item.lyDo} | ` : ""}
                      {item.nguoiThucHien} — {formatDate(item.ngayThanhLy)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Completed Liquidations Table */}
      {liquidatedRecords.length > 0 && (
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-lg font-semibold text-slate-950">Danh sách đã thanh lý</h3>
            <p className="mt-1 text-sm text-slate-500">
              Tổng giá trị thu hồi: {formatCurrency(totalRecoveryValue)}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Mã TB</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Tên thiết bị</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Giá trị thu hồi</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Phương thức</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Lý do</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Người xử lý</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Ngày thanh lý</th>
                </tr>
              </thead>
              <tbody>
                {liquidatedRecords.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {item.thietBi.maThietBi}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{item.thietBi.tenThietBi}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatCurrency(item.giaTriThuHoi)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {phuongThucLabels[item.phuongThuc] ?? item.phuongThuc}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{item.lyDo ?? "--"}</td>
                    <td className="px-4 py-3 text-slate-700">{item.nguoiThucHien}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(item.ngayThanhLy)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
