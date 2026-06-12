import { Topbar } from "@/components/layout/topbar";
import { ReportSummaryCards } from "@/components/bao-cao/report-summary-cards";

export default async function ReportsPage() {
  return (
    <>
      <Topbar
        title="Báo cáo"
        description="Tổng hợp tình hình sử dụng, trạng thái và chi phí vận hành thiết bị."
      />
      <ReportSummaryCards />
    </>
  );
}
