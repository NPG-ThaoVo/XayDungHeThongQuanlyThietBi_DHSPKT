"use client";

import { useState } from "react";
import { changePassword } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";

export function PasswordChangeForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    
    try {
      const response = await changePassword(formData);
      
      if (response?.error) {
        setError(response.error);
      } else if (response?.success) {
        setSuccess(response.success);
        (event.target as HTMLFormElement).reset();
      }
    } catch {
      setError("Có lỗi không xác định xảy ra, vui lòng thử lại.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Mật khẩu hiện tại</label>
        <input
          name="currentPassword"
          type="password"
          required
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Mật khẩu mới</label>
        <input
          name="newPassword"
          type="password"
          required
          minLength={6}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Xác nhận mật khẩu mới</label>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
        />
      </div>

      {error ? <p className="text-sm text-rose-600 font-medium">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600 font-medium">{success}</p> : null}

      <div className="pt-2">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Đang xử lý..." : "Cập nhật mật khẩu"}
        </Button>
      </div>
    </form>
  );
}
