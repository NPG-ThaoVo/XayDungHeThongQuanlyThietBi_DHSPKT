"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";

type BorrowRequestItem = {
  id: string;
  maPhieu: string;
  mucDich: string;
  ngayMuon: string;
  ngayTraDuKien: string;
  ngayTraThucTe: string | null;
  trangThai: string;
  ghiChu: string | null;
  phiQhanHan: number | null;
  tinhTrangTra: string | null;
  nguoiMuon: {
    name: string;
    email: string;
  };
  thietBi: {
    tenThietBi: string;
    maThietBi: string;
    phong: {
      tenPhong: string;
    } | null;
    khoa: {
      tenKhoa: string;
    } | null;
  };
};

type AvailableDevice = {
  id: string;
  tenThietBi: string;
  maThietBi: string;
  phong: {
    tenPhong: string;
  } | null;
  khoa: {
    tenKhoa: string;
  } | null;
};

type SummaryCard = {
  title: string;
  value: string;
  note: string;
};

const emptyCreateForm = {
  thietBiId: "",
  mucDich: "",
  ngayMuon: "",
  ngayTraDuKien: "",
};

export function BorrowManagementPanel({
  borrowRequests,
  availableDevices,
  canManage,
  summary,
}: {
  borrowRequests: BorrowRequestItem[];
  availableDevices: AvailableDevice[];
  canManage: boolean;
  summary: SummaryCard[];
}) {
  const router = useRouter();
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const pendingCount = useMemo(
    () => borrowRequests.filter((item) => item.trangThai === "CHO_DUYET").length,
    [borrowRequests],
  );

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

  async function handleCreateBorrow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/muon-tra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...createForm,
          ngayMuon: new Date(createForm.ngayMuon).toISOString(),
          ngayTraDuKien: new Date(createForm.ngayTraDuKien).toISOString(),
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể tạo phiếu mượn");
      }

      setCreateForm(emptyCreateForm);
      refreshPage("Đã tạo phiếu mượn mới.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Lỗi không xác định");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleApprove(phieuId: string, approved: boolean) {
    setBusyId(phieuId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/muon-tra/${phieuId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "approve",
          approved,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể cập nhật phiếu mượn");
      }

      refreshPage(approved ? "Đã duyệt phiếu mượn." : "Đã từ chối phiếu mượn.");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Lỗi không xác định");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReturn(phieuId: string, tinhTrangTra: "TOT" | "HONG") {
    setBusyId(phieuId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/muon-tra/${phieuId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "return",
          tinhTrangTra,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể xác nhận trả thiết bị");
      }

      refreshPage(
        tinhTrangTra === "HONG"
          ? "Đã xác nhận trả và đánh dấu thiết bị hỏng."
          : "Đã xác nhận trả thiết bị.",
      );
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
              <h3 className="text-lg font-semibold text-slate-950">Danh sách phiếu mượn</h3>
              <p className="mt-1 text-sm text-slate-500">
                {canManage
                  ? `Đang theo dõi ${borrowRequests.length} phiếu, ${pendingCount} phiếu chờ duyệt.`
                  : `Bạn đang có ${borrowRequests.length} phiếu mượn trong hệ thống.`}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Phiếu</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Người mượn</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Thiết bị</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Ngày</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Xử lý</th>
                </tr>
              </thead>
              <tbody>
                {borrowRequests.map((item) => {
                  const isBusy = busyId === item.id;
                  const canApprove = canManage && item.trangThai === "CHO_DUYET";
                  const canReturn = canManage && ["DANG_MUON", "QUA_HAN"].includes(item.trangThai);

                  return (
                    <tr key={item.id} className="border-t border-slate-100 align-top">
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{item.maPhieu}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.mucDich}</p>
                        {item.ghiChu ? <p className="mt-1 text-xs text-slate-500">{item.ghiChu}</p> : null}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{item.nguoiMuon.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.nguoiMuon.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{item.thietBi.tenThietBi}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.thietBi.maThietBi}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.thietBi.phong?.tenPhong ?? "Chưa gán phòng"}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        <p>Mượn: {formatDate(item.ngayMuon)}</p>
                        <p className="mt-1">Hạn trả: {formatDate(item.ngayTraDuKien)}</p>
                        <p className="mt-1">
                          Trả thực tế: {item.ngayTraThucTe ? formatDate(item.ngayTraThucTe) : "--"}
                        </p>
                        {item.phiQhanHan ? (
                          <p className="mt-1 text-rose-600">Phạt: {formatCurrency(item.phiQhanHan)}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={item.trangThai} />
                        {item.tinhTrangTra ? (
                          <p className="mt-2 text-xs text-slate-500">Tình trạng trả: {item.tinhTrangTra}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {canApprove ? (
                            <>
                              <Button
                                size="sm"
                                disabled={isBusy}
                                onClick={() => void handleApprove(item.id, true)}
                              >
                                Duyệt
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={isBusy}
                                onClick={() => void handleApprove(item.id, false)}
                              >
                                Từ chối
                              </Button>
                            </>
                          ) : null}
                          {canReturn ? (
                            <>
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={isBusy}
                                onClick={() => void handleReturn(item.id, "TOT")}
                              >
                                Xác nhận trả
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                disabled={isBusy}
                                onClick={() => void handleReturn(item.id, "HONG")}
                              >
                                Trả hỏng
                              </Button>
                            </>
                          ) : null}
                          {!canApprove && !canReturn ? (
                            <span className="text-xs text-slate-400">Không có thao tác</span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {borrowRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                      Chưa có phiếu mượn nào.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Tạo phiếu mượn</h3>
              <p className="mt-2 text-sm text-slate-500">
                Gửi yêu cầu mượn thiết bị và theo dõi phê duyệt ngay trong mô-đun này.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {availableDevices.length} thiết bị sẵn sàng
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleCreateBorrow}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Thiết bị</label>
              <select
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
                value={createForm.thietBiId}
                onChange={(event) => updateCreateField("thietBiId", event.target.value)}
              >
                <option value="">Chọn thiết bị</option>
                {availableDevices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.maThietBi} - {device.tenThietBi}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Mục đích sử dụng</label>
              <textarea
                className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none"
                value={createForm.mucDich}
                onChange={(event) => updateCreateField("mucDich", event.target.value)}
                placeholder="Nhập lý do mượn, lớp học hoặc công việc cần sử dụng thiết bị"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Ngày mượn</label>
                <Input
                  type="date"
                  value={createForm.ngayMuon}
                  onChange={(event) => updateCreateField("ngayMuon", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Hạn trả</label>
                <Input
                  type="date"
                  value={createForm.ngayTraDuKien}
                  onChange={(event) => updateCreateField("ngayTraDuKien", event.target.value)}
                />
              </div>
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

            <Button type="submit" disabled={isSubmitting || availableDevices.length === 0}>
              {isSubmitting ? "Đang gửi..." : "Tạo phiếu mượn"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
