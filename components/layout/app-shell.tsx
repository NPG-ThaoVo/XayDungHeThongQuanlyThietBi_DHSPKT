"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  Menu,
  NotebookText,
  PackagePlus,
  ShieldCheck,
  Settings,
  Trash2,
  Wrench,
  Workflow,
  X,
} from "lucide-react";

import { logout } from "@/app/actions/auth.actions";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/dashboard/thiet-bi", label: "Thiết bị", icon: Boxes },
  { href: "/dashboard/phieu-nhap", label: "Phiếu nhập", icon: PackagePlus },
  { href: "/dashboard/phan-bo", label: "Phân bổ", icon: Workflow },
  { href: "/dashboard/bao-tri", label: "Bảo trì", icon: Wrench },
  { href: "/dashboard/kiem-ke", label: "Kiểm kê", icon: ShieldCheck },
  { href: "/dashboard/thanh-ly", label: "Thanh lý", icon: Trash2 },
  { href: "/dashboard/nhat-ky-hoat-dong", label: "Nhật ký", icon: NotebookText },
  { href: "/dashboard/bao-cao", label: "Báo cáo", icon: BarChart3 },
  { href: "/dashboard/cai-dat", label: "Cài đặt", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Đóng menu khi đổi trang (mobile) để tránh kẹt sidebar
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Toggle button (mobile) */}
      <div className="fixed left-4 top-4 z-20 lg:hidden">
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-slate-100"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen ? (
        <div
          className="fixed inset-0 z-10 bg-slate-900/40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      ) : null}

      <div className="mx-auto grid h-full w-full max-w-full grid-cols-1 gap-6 px-4 py-4 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside
          className={cn(
            "flex flex-col rounded-2xl bg-white p-5 text-slate-800 shadow-md transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-[110%] lg:translate-x-0",
            "fixed left-4 top-4 z-30 mt-[56px] h-[calc(100dvh-32px-56px)] w-[calc(100%-32px)] lg:relative lg:h-auto lg:w-auto",
          )}
        >
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600">
              QLTHIETBI
            </p>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
              DHSPKT Asset Hub
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Quản lý thiết bị, nhập kho, phân bổ, bảo trì và thanh lý.
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out",
                    active
                      ? "bg-teal-50 text-teal-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      active
                        ? "text-teal-600"
                        : "text-slate-400 group-hover:text-slate-600",
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-4">
            <form action={logout}>
              <button
                type="submit"
                className={cn(
                  "group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  "text-slate-600 hover:bg-rose-50 hover:text-rose-600",
                )}
              >
                <LogOut className="h-5 w-5 text-slate-400 transition-colors group-hover:text-rose-500" />
                <span>Đăng xuất</span>
              </button>
            </form>
          </div>
        </aside>

        {/* Content */}
        <main className="flex h-full flex-col overflow-y-auto rounded-2xl bg-white shadow-md">
          {children}
        </main>
      </div>
    </div>
  );
}

