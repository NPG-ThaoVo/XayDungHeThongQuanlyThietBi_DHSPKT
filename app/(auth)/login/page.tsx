"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2, ShieldCheck } from "lucide-react";

type Step = "credentials" | "totp";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCredentials(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      totpCode: "",
    });

    setIsLoading(false);

    if (!result) {
      setError("Lỗi kết nối. Vui lòng thử lại.");
      return;
    }

    // result.ok is always true (HTTP 200) even on auth failure.
    // Use result.error === undefined as the real success indicator.
    if (!result.error) {
      window.location.href = "/dashboard";
      return;
    }

    if (result.code === "TOTP_REQUIRED") {
      setStep("totp");
      return;
    }

    setError("Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.");
  }

  async function handleTotp(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      totpCode,
    });

    setIsLoading(false);

    if (!result) {
      setError("Lỗi kết nối. Vui lòng thử lại.");
      return;
    }

    if (!result.error) {
      window.location.href = "/dashboard";
      return;
    }

    setError("Mã xác thực không đúng hoặc đã hết hạn. Vui lòng thử lại.");
    setTotpCode("");
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <div className="grid w-full max-w-5xl overflow-auto rounded-[32px] border border-white/70 bg-white shadow-2xl lg:grid-cols-[1fr_420px]">
        {/* Left panel */}
        <section className="bg-[linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#0369a1_100%)] p-10 text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">QLTHIETBI</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">
            Đăng nhập để quản lý tài sản, kho và quy trình nghiệp vụ.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            Tài khoản demo sau khi seed:
          </p>
          <div className="mt-3 space-y-1 rounded-xl bg-white/10 p-4 font-mono text-xs text-slate-200">
            <p>admin@dhspkt.edu.vn</p>
            <p>thukho@dhspkt.edu.vn</p>
            <p>sinhvien@dhspkt.edu.vn</p>
            <p>gv.dien@dhspkt.edu.vn</p>
            <p>kythuatvien@dhspkt.edu.vn</p>
          </div>
        </section>

        {/* Right panel */}
        <section className="p-8">
          <div className="max-w-sm">
            {step === "credentials" ? (
              <>
                <h2 className="text-2xl font-semibold text-slate-950">Đăng nhập hệ thống</h2>

                {error && (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleCredentials}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
                    <input
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                    <div className="flex justify-end pt-1">
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang đăng nhập...
                      </>
                    ) : (
                      "Đăng nhập"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <ShieldCheck className="h-5 w-5 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-950">Xác thực 2FA</h2>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  Tài khoản <span className="font-medium text-slate-700">{email}</span> đã bật xác
                  thực 2 lớp. Nhập mã từ ứng dụng Authenticator để tiếp tục.
                </p>

                {error && (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleTotp}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mã xác thực (6 chữ số)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      autoFocus
                      autoComplete="one-time-code"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                      className="h-14 w-full rounded-xl border border-teal-300 bg-teal-50/40 px-3 text-center text-2xl tracking-[0.6em] focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                    <p className="text-xs text-slate-500">
                      Nhập mã 6 chữ số từ Google Authenticator / Authy
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || totpCode.length < 6}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang xác thực...
                      </>
                    ) : (
                      "Xác nhận"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setError(null);
                      setTotpCode("");
                    }}
                    className="w-full text-center text-sm text-slate-500 hover:text-slate-700"
                  >
                    ← Quay lại đăng nhập
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
