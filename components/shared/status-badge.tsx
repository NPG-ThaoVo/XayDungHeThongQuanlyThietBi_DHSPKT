import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  TOT: "bg-emerald-100 text-emerald-700",
  HONG: "bg-rose-100 text-rose-700",
  BAO_TRI: "bg-amber-100 text-amber-700",
  THANH_LY: "bg-slate-200 text-slate-700",
  CHO_DUYET: "bg-sky-100 text-sky-700",
  DA_DUYET: "bg-cyan-100 text-cyan-700",
  TU_CHOI: "bg-slate-200 text-slate-700",
  DANG_MUON: "bg-indigo-100 text-indigo-700",
  DA_TRA: "bg-emerald-100 text-emerald-700",
  QUA_HAN: "bg-rose-100 text-rose-700",
};

const statusLabels: Record<string, string> = {
  TOT: "Tốt",
  HONG: "Hỏng",
  BAO_TRI: "Bảo trì",
  THANH_LY: "Thanh lý",
  CHO_DUYET: "Chờ duyệt",
  DA_DUYET: "Đã duyệt",
  TU_CHOI: "Từ chối",
  DANG_MUON: "Đang mượn",
  DA_TRA: "Đã trả",
  QUA_HAN: "Quá hạn",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        statusStyles[status] ?? "bg-slate-100 text-slate-700",
      )}
    >
      {statusLabels[status] ?? status.replaceAll("_", " ")}
    </span>
  );
}
