"use client";

import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/layout/topbar";

export default function DevicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <Topbar
        title="Quản lý thiết bị"
        description="Không thể tải dữ liệu thiết bị do lỗi kết nối hoặc truy vấn CSDL."
      />
      <main className="p-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-sm">
          <h3 className="text-lg font-semibold">Không thể tải trang thiết bị</h3>
          <p className="mt-2 text-sm leading-7 text-rose-800">
            Hệ thống không thể kết nối đến cơ sở dữ liệu ở thời điểm này. Hãy thử lại hoặc kiểm
            tra lại biến môi trường `DATABASE_URL`.
          </p>
          {process.env.NODE_ENV !== "production" ? (
            <p className="mt-4 rounded-xl bg-white/70 p-3 text-sm text-rose-700">
              {error.message}
            </p>
          ) : null}
          <div className="mt-6">
            <Button type="button" onClick={reset}>
              Thử lại
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
