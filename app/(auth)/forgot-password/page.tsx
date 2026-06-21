"use client";

import Link from "next/link";
import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Lỗi gửi yêu cầu");
      setMessage(data.message ?? "Đã gửi yêu cầu thành công. Vui lòng kiểm tra email.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_0.85fr]">
        <Card className="p-8">
          <div className="flex flex-col items-start gap-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 shadow-sm ring-1 ring-teal-100/50">
              <KeyRound className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-600">
                Khôi phục mật khẩu
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Đặt lại mật khẩu an toàn
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Nhập email liên kết với tài khoản của bạn. Hệ thống sẽ gửi liên kết đặt lại mật
                khẩu có hiệu lực trong 1 giờ.
              </p>
            </div>

            <form className="w-full space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email xác thực</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@hcmute.edu.vn"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Gửi liên kết khôi phục"}
              </Button>
            </form>

            {message ? (
              <div className="flex w-full items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <MailCheck className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{message}</p>
              </div>
            ) : null}

            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              <p className="font-medium text-slate-900">Lựa chọn khi chưa nhận được email</p>
              <ul className="mt-3 space-y-2">
                <li>1. Kiểm tra spam hoặc promotions.</li>
                <li>2. Xác nhận lại email đang dùng trên tài khoản.</li>
                <li>3. Liên hệ quản trị viên nếu cần cấp lại hoàn toàn.</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Quy trình
          </p>
          <div className="mt-6 space-y-4">
            {[
              "Xác minh email hợp lệ",
              "Tạo mã đặt lại tạm thời",
              "Gửi liên kết có hạn",
              "Xác nhận đổi mật khẩu mới",
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-slate-950">{step}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Hệ thống xử lý tự động và gửi email tức thì.
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">
              Lưu ý bảo mật
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Không chia sẻ liên kết khôi phục cho người khác. Nếu nghi ngờ tài khoản bị lộ, đổi
              mật khẩu và đăng xuất tất cả phiên ngay lập tức.
            </p>
          </div>

          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại trang đăng nhập
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
