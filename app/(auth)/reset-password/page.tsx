"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KeyRound, CheckCircle2, XCircle } from "lucide-react";
import { useState, type FormEvent, Suspense } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirm) {
      setMessage("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!token) {
      setMessage("Token không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới.");
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Lỗi đặt lại mật khẩu");
      setStatus("success");
      setMessage(data.message ?? "Mật khẩu đã được đặt lại thành công!");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <XCircle className="h-12 w-12 text-rose-500" />
        <p className="text-lg font-semibold text-slate-900">Liên kết không hợp lệ</p>
        <p className="text-sm text-slate-500">Token bị thiếu. Vui lòng thử lại từ trang quên mật khẩu.</p>
        <Link href="/forgot-password" className="text-sm font-medium text-teal-700 hover:underline">
          Yêu cầu đặt lại mật khẩu mới
        </Link>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <p className="text-lg font-semibold text-slate-900">Đặt lại mật khẩu thành công!</p>
        <p className="text-sm text-slate-500">{message}</p>
        <Link
          href="/login"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Mật khẩu mới *</label>
        <Input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tối thiểu 8 ký tự"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Xác nhận mật khẩu *</label>
        <Input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Nhập lại mật khẩu mới"
        />
      </div>
      {message ? (
        <p className={`text-sm font-medium ${status === "error" ? "text-rose-600" : "text-slate-700"}`}>
          {message}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Đang xử lý..." : "Xác nhận mật khẩu mới"}
      </Button>
      <p className="text-center text-sm text-slate-500">
        <Link href="/login" className="text-teal-700 hover:underline">
          Quay lại đăng nhập
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="mb-6 flex flex-col items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 shadow-sm ring-1 ring-teal-100/50">
              <KeyRound className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-600">
                Bảo mật tài khoản
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                Tạo mật khẩu mới
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Nhập và xác nhận mật khẩu mới cho tài khoản của bạn.
              </p>
            </div>
          </div>
          <Suspense fallback={<p className="text-sm text-slate-500">Đang tải...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </Card>
      </div>
    </main>
  );
}
