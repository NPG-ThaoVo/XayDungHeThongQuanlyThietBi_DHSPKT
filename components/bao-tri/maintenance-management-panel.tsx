"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";

type Option = {
  id: string;
  label: string;
  subLabel?: string;
};

type BaoTriItem = {
  id: string;
  loaiBaoTri: string;
  moTaVanDe: string;
  ketQua: string | null;
  chiPhi: number | null;
  ngayBatDau: string;
  ngayHoanThanh: string | null;
  thietBi: {
    id: string;
    maThietBi: string;
    tenThietBi: string;
    trangThai: string;
  };
  kyThuatVien: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
};

type SummaryCard = {
  title: string;
  value: string;
  note: string;
};

const emptyCreateForm = {
  thietBiId: "",
  loaiBaoTri: "",
  moTaVanDe: "",
  kyThuatVienId: "",
  ngayBatDau: "",
  chiPhi: "",
};

export function MaintenanceManagementPanel({
  items,
  devices,
  technicians,
  summary,
}: {
  items: BaoTriItem[];
  devices: Option[];
  technicians: Option[];
  summary: SummaryCard[];
}) {
  const router = useRouter();
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const inProgressCount = useMemo(() => items.filter((item) => !item.ngayHoanThanh).length, [items]);

  function updateCreateField<K extends keyof typeof emptyCreateForm>(
    key: K,
    value: (typeof emptyCreateForm)[K],
  ) {
    setCreateForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function refreshPage(message: string) {
    setSuccess(message);
    setError(null);
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/bao-tri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          kyThuatVienId: createForm.kyThuatVienId || undefined,
          chiPhi: createForm.chiPhi ? Number(createForm.chiPhi) : undefined,
          ngayBatDau: new Date(createForm.ngayBatDau).toISOString(),
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể tao phieu bao tri");
      }

      setCreateForm(emptyCreateForm);
      refreshPage("Đã tạo phiếu bao tri moi.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Lỗi không xác định");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAssignTechnician(baoTriId: string, kyThuatVienId: string) {
    setBusyId(baoTriId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/bao-tri/${baoTriId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kyThuatVienId: kyThuatVienId || "" }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể cap nhat ky thuat vien");
      }

      refreshPage("Đã cập nhật ky thuat vien.");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Lỗi không xác định");
    } finally {
      setBusyId(null);
    }
  }

  async function handleComplete(baoTriId: string) {
    setBusyId(baoTriId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/bao-tri/${baoTriId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ngayHoanThanh: new Date().toISOString() }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể hoan thanh phieu bao tri");
      }

      refreshPage("Da danh dau hoan thanh.");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Lỗi không xác định");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{item.title}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm text-slate-500">{item.note}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Danh sách bảo trì</h3>
              <p className="mt-1 text-sm text-slate-500">
                Đang theo dõi {items.length} phieu, {inProgressCount} phiếu đang xử lý.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Thiết bị</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Loại</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Ngày</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Kỹ thuật viên</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Chi phí</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Xử lý</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isBusy = busyId === item.id;
                  const canComplete = !item.ngayHoanThanh;

                  return (
                    <tr key={item.id} className="border-t border-slate-100 align-top">
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{item.thietBi.tenThietBi}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.thietBi.maThietBi}</p>
                        <p className="mt-1 text-xs text-slate-500">Trạng thái TB: {item.thietBi.trangThai}</p>
                        <p className="mt-2 text-xs text-slate-600">{item.moTaVanDe}</p>
                        {item.ketQua ? <p className="mt-1 text-xs text-slate-600">Kết quả: {item.ketQua}</p> : null}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{item.loaiBaoTri}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.ngayHoanThanh ? "Hoàn thành" : "Đang xử lý"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-slate-900">Bắt đầu: {formatDate(new Date(item.ngayBatDau))}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.ngayHoanThanh
                            ? `Xong: ${formatDate(new Date(item.ngayHoanThanh))}`
                            : "Chưa hoàn thành"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-slate-900">{item.kyThuatVien?.name ?? "--"}</p>
                        <div className="mt-2">
                          <select
                            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                            value={item.kyThuatVien?.id ?? ""}
                            onChange={(event) => handleAssignTechnician(item.id, event.target.value)}
                            disabled={isBusy}
                          >
                            <option value="">Chọn</option>
                            {technicians.map((tech) => (
                              <option key={tech.id} value={tech.id}>
                                {tech.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-slate-900">
                          {item.chiPhi ? formatCurrency(item.chiPhi) : "--"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleComplete(item.id)}
                            disabled={isBusy || !canComplete}
                          >
                            Hoàn thành
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Tạo phiếu bao tri</h3>
          <p className="mt-2 text-sm text-slate-500">Ghi nhận nhanh phiếu bảo trì, sửa chữa hoặc nâng cấp.</p>

          <form className="mt-6 grid gap-4" onSubmit={handleCreate}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Thiết bị</label>
              <select
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                value={createForm.thietBiId}
                onChange={(event) => updateCreateField("thietBiId", event.target.value)}
                required
              >
                <option value="">Chọn thiet bi</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Loại bao tri</label>
              <Input
                value={createForm.loaiBaoTri}
                onChange={(event) => updateCreateField("loaiBaoTri", event.target.value)}
                placeholder="Kế hoạch định kỳ / Sửa chữa / Nâng cấp"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Mở ta van de</label>
              <textarea
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                value={createForm.moTaVanDe}
                onChange={(event) => updateCreateField("moTaVanDe", event.target.value)}
                placeholder="Mở ta tinh trang, trieu chung, hang muc can sua..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Kỹ thuật viên (tuy chon)</label>
              <select
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                value={createForm.kyThuatVienId}
                onChange={(event) => updateCreateField("kyThuatVienId", event.target.value)}
              >
                <option value="">Chưa gán</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Ngày bắt đầu</label>
              <Input
                type="datetime-local"
                value={createForm.ngayBatDau}
                onChange={(event) => updateCreateField("ngayBatDau", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Chi phí (VND)</label>
              <Input
                type="number"
                min={0}
                inputMode="numeric"
                value={createForm.chiPhi}
                onChange={(event) => updateCreateField("chiPhi", event.target.value)}
                placeholder="VD: 800000"
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo phiếu"}
            </Button>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
          </form>
        </div>
      </div>
    </div>
  );
}
