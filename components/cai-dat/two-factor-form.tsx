"use client";

import { useState } from "react";
import { ShieldCheck, ShieldOff, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  initialEnabled: boolean;
};

type SetupData = {
  secret: string;
  qrCode: string;
};

export function TwoFactorForm({ initialEnabled }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleStart() {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/2fa/setup");
      const data = (await res.json()) as { enabled?: boolean; qrCode?: string; secret?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Lỗi khi khởi tạo 2FA");
      if (data.enabled) {
        setEnabled(true);
      } else {
        setSetupData({ qrCode: data.qrCode!, secret: data.secret! });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify() {
    if (!totpCode || totpCode.length < 6) {
      setError("Vui lòng nhập đủ 6 chữ số");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/2fa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totpCode }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Xác minh thất bại");
      setEnabled(true);
      setSetupData(null);
      setTotpCode("");
      setSuccess(data.message ?? "2FA đã được kích hoạt!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDisable() {
    if (!window.confirm("Bạn chắc chắn muốn tắt bảo mật 2FA?")) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/2fa/setup", { method: "DELETE" });
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Lỗi khi tắt 2FA");
      setEnabled(false);
      setSetupData(null);
      setSuccess(data.message ?? "Đã tắt 2FA.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setIsLoading(false);
    }
  }

  if (enabled && !setupData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">2FA đang hoạt động</p>
            <p className="text-xs text-emerald-600">Tài khoản được bảo vệ bằng mã TOTP</p>
          </div>
        </div>
        {success ? <p className="text-sm text-emerald-600 font-medium">{success}</p> : null}
        {error ? <p className="text-sm text-rose-600 font-medium">{error}</p> : null}
        <Button variant="secondary" onClick={handleDisable} disabled={isLoading}>
          <ShieldOff className="mr-2 h-4 w-4" />
          {isLoading ? "Đang xử lý..." : "Tắt bảo mật 2FA"}
        </Button>
      </div>
    );
  }

  if (setupData) {
    return (
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">
            Bước 1: Quét mã QR bằng Google Authenticator hoặc Authy
          </p>
          <div className="flex justify-center rounded-xl border border-slate-200 bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={setupData.qrCode} alt="QR Code 2FA" className="h-44 w-44" />
          </div>
          <p className="text-xs text-slate-500">
            Nếu không quét được, nhập thủ công secret:{" "}
            <span className="font-mono text-slate-700">{setupData.secret}</span>
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">
            Bước 2: Nhập mã 6 chữ số từ ứng dụng để xác nhận
          </p>
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
            className="text-center text-2xl tracking-[0.5em]"
          />
        </div>
        {error ? <p className="text-sm text-rose-600 font-medium">{error}</p> : null}
        <div className="flex gap-3">
          <Button onClick={handleVerify} disabled={isLoading}>
            {isLoading ? "Đang xác minh..." : "Xác nhận kích hoạt"}
          </Button>
          <Button variant="secondary" onClick={() => setSetupData(null)} disabled={isLoading}>
            Hủy
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
        <Smartphone className="h-6 w-6 text-slate-500" />
        <div>
          <p className="text-sm font-semibold text-slate-800">2FA chưa được kích hoạt</p>
          <p className="text-xs text-slate-500">
            Thêm lớp bảo mật bằng ứng dụng xác thực trên điện thoại
          </p>
        </div>
      </div>
      {success ? <p className="text-sm text-emerald-600 font-medium">{success}</p> : null}
      {error ? <p className="text-sm text-rose-600 font-medium">{error}</p> : null}
      <Button onClick={handleStart} disabled={isLoading}>
        <ShieldCheck className="mr-2 h-4 w-4" />
        {isLoading ? "Đang khởi tạo..." : "Kích hoạt bảo mật 2FA"}
      </Button>
    </div>
  );
}
