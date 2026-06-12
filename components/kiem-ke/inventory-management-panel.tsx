"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

type RoundSummary = {
  id: string;
  tenDot: string;
  trangThai: string;
  tong: number;
  daXacNhan: number;
  percent: number;
};

type RoundItem = {
  id: string;
  thietBi: {
    id: string;
    maThietBi: string;
    tenThietBi: string;
    trangThai: string;
    phong: { tenPhong: string } | null;
  };
  trangThaiThucTe: string | null;
  ghiChu: string | null;
  daXacNhan: boolean;
  ngayXacNhan: string | null;
};

type CurrentRound = {
  id: string;
  tenDot: string;
  trangThai: string;
  ngayBatDau: string;
  ngayKetThuc: string | null;
  items: RoundItem[];
} | null;

const emptyCreateForm = {
  tenDot: "",
  ngayBatDau: "",
};

export function InventoryManagementPanel({
  rounds,
  currentRound,
}: {
  rounds: RoundSummary[];
  currentRound: CurrentRound;
}) {
  const router = useRouter();
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [busyRoundId, setBusyRoundId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<Record<string, string>>({});
  const [draftNote, setDraftNote] = useState<Record<string, string>>({});

  const unconfirmedCount = useMemo(
    () => (currentRound ? currentRound.items.filter((item) => !item.daXacNhan).length : 0),
    [currentRound],
  );

  function refreshPage(message: string) {
    setSuccess(message);
    setError(null);
    startTransition(() => {
      router.refresh();
    });
  }

  function updateCreateField<K extends keyof typeof emptyCreateForm>(
    key: K,
    value: (typeof emptyCreateForm)[K],
  ) {
    setCreateForm((current) => ({ ...current, [key]: value }));
  }

  async function handleCreateRound(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/kiem-ke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenDot: createForm.tenDot,
          ngayBatDau: new Date(createForm.ngayBatDau).toISOString(),
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể tạo đợt kiểm kê");
      }

      setCreateForm(emptyCreateForm);
      refreshPage("Đã tạo đợt kiểm kê mới.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Lỗi không xác định");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmItem(itemId: string) {
    setBusyItemId(itemId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/kiem-ke/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          daXacNhan: true,
          trangThaiThucTe: draftStatus[itemId] || undefined,
          ghiChu: draftNote[itemId] || undefined,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể xác nhận kiểm kê");
      }

      refreshPage("Đã xác nhận kiểm kê.");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Lỗi không xác định");
    } finally {
      setBusyItemId(null);
    }
  }

  async function handleCompleteRound() {
    if (!currentRound) return;

    setBusyRoundId(currentRound.id);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/kiem-ke/${currentRound.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trangThai: "HOAN_THANH",
          ngayKetThuc: new Date().toISOString(),
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể hoàn thành đợt kiểm kê");
      }

      refreshPage("Đã hoàn thành đợt kiểm kê.");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Lỗi không xác định");
    } finally {
      setBusyRoundId(null);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Đợt kiểm kê</h3>
          <div className="mt-6 space-y-4">
            {rounds.length > 0 ? (
              rounds.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-base font-semibold text-slate-950">{item.tenDot}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.trangThai}</p>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.percent === 100 ? "bg-emerald-500" : "bg-sky-500"}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {item.daXacNhan}/{item.tong} thiết bị đã xác nhận
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Chưa có đợt kiểm kê nào.</p>
            )}
          </div>
        </div>

        {currentRound ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{currentRound.tenDot}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Bắt đầu: {formatDate(new Date(currentRound.ngayBatDau))} • Còn {unconfirmedCount} chưa xác nhận
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCompleteRound}
                disabled={busyRoundId === currentRound.id || unconfirmedCount > 0}
              >
                Hoàn thành đợt
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-500">Thiết bị</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-500">Thực tế</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-500">Ghi chú</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-500">Xác nhận</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRound.items.map((item) => {
                    const isBusy = busyItemId === item.id;
                    const statusValue = draftStatus[item.id] ?? (item.trangThaiThucTe ?? "");
                    const noteValue = draftNote[item.id] ?? (item.ghiChu ?? "");

                    return (
                      <tr key={item.id} className="border-t border-slate-100 align-top">
                        <td className="px-4 py-4">
                          <p className="font-medium text-slate-900">{item.thietBi.tenThietBi}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.thietBi.maThietBi}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            Vị trí: {item.thietBi.phong?.tenPhong ?? "--"} • Trạng thái hệ thống: {item.thietBi.trangThai}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                            value={statusValue}
                            onChange={(event) =>
                              setDraftStatus((current) => ({ ...current, [item.id]: event.target.value }))
                            }
                            disabled={item.daXacNhan || isBusy}
                          >
                            <option value="">Chọn</option>
                            <option value="TOT">TOT</option>
                            <option value="HONG">HONG</option>
                            <option value="BAO_TRI">BAO_TRI</option>
                            <option value="THANH_LY">THANH_LY</option>
                          </select>
                          {item.daXacNhan ? (
                            <p className="mt-2 text-xs text-slate-500">
                              Đã xác nhận {item.ngayXacNhan ? formatDate(new Date(item.ngayXacNhan)) : ""}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-4">
                          <textarea
                            className="min-h-20 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                            value={noteValue}
                            onChange={(event) =>
                              setDraftNote((current) => ({ ...current, [item.id]: event.target.value }))
                            }
                            disabled={item.daXacNhan || isBusy}
                            placeholder="Ghi chú..."
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleConfirmItem(item.id)}
                            disabled={item.daXacNhan || isBusy}
                          >
                            Xác nhận
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-950">Khởi tạo đợt kiểm kê</h3>
        <p className="mt-2 text-sm text-slate-500">Tự động tạo item cho toàn bộ thiết bị chưa thanh lý.</p>

        <form className="mt-6 grid gap-4" onSubmit={handleCreateRound}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tên đợt</label>
            <Input
              value={createForm.tenDot}
              onChange={(event) => updateCreateField("tenDot", event.target.value)}
              placeholder="Kiểm kê Quý II/2026"
              required
            />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo đợt"}
          </Button>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
        </form>
      </div>
    </div>
  );
}
