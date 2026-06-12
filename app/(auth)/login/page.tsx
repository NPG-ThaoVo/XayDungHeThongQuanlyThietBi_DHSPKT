import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-2xl lg:grid-cols-[1fr_420px]">
        <section className="bg-[linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#0369a1_100%)] p-10 text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">QLTHIETBI</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">
            Đăng nhập để quản lý tài sản, kho và quy trình nghiệp vụ.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            Tài khoản mẫu sau khi seed:
            <br />
            admin@hcmute.edu.vn / Admin@123
          </p>
        </section>
        <section className="p-8">
          <div className="max-w-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Đăng nhập hệ thống</h2>
            <form
              className="mt-8 space-y-4"
              action={async (formData) => {
                "use server";
                await signIn("credentials", {
                  email: formData.get("email"),
                  password: formData.get("password"),
                  totpCode: formData.get("totpCode"),
                  redirectTo: "/dashboard",
                });
              }}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 px-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 px-3"
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
              <button className="h-11 w-full rounded-xl bg-slate-950 font-medium text-white">
                Đăng nhập
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
