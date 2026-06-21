import { Topbar } from "@/components/layout/topbar";
import { PasswordChangeForm } from "@/components/cai-dat/password-change-form";
import { TwoFactorForm } from "@/components/cai-dat/two-factor-form";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Smartphone, User } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth();

  let dbUser: {
    twoFactorEnabled: boolean;
    role: string;
    khoaId: string | null;
    maSoNV: string | null;
    phone: string | null;
  } | null = null;

  let dbError: string | null = null;

  if (session?.user?.id) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { twoFactorEnabled: true, role: true, khoaId: true, maSoNV: true, phone: true },
      });
    } catch {
      dbError =
        "Không thể tải dữ liệu cài đặt từ cơ sở dữ liệu. Một số tính năng bảo mật tạm thời không khả dụng.";
    }
  }

  return (
    <>
      <Topbar
        title="Cài đặt cá nhân"
        description="Quản lý tùy chọn hệ thống và bảo mật tài khoản."
      />
      
      <main className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-6">
          {dbError ? (
            <Card className="border-amber-200 bg-amber-50 p-4 text-amber-900 lg:col-span-2">
              <p className="text-sm leading-6">{dbError}</p>
            </Card>
          ) : null}
          <Card className="p-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Thông tin tài khoản</h3>
                <p className="text-sm text-slate-500">Tài khoản được đồng bộ từ hệ thống.</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tên hiển thị</p>
                <p className="font-medium text-slate-900 mt-1">{session?.user?.name || "--"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</p>
                <p className="font-medium text-slate-900 mt-1">{session?.user?.email || "--"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Vai trò</p>
                <p className="font-medium text-slate-900 mt-1">{session?.user?.role || "--"}</p>
              </div>
              {dbUser?.maSoNV ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Mã số NV/SV</p>
                  <p className="font-medium text-slate-900 mt-1">{dbUser.maSoNV}</p>
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Đổi mật khẩu</h3>
                <p className="text-sm text-slate-500">Cập nhật mật khẩu để bảo vệ tài khoản tốt hơn.</p>
              </div>
            </div>
            
            <div className="mt-6">
              <PasswordChangeForm />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Bảo mật hai lớp (2FA)</h3>
                <p className="text-sm text-slate-500">
                  Xác thực bằng mã TOTP qua ứng dụng điện thoại.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <TwoFactorForm initialEnabled={dbUser?.twoFactorEnabled ?? false} />
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
