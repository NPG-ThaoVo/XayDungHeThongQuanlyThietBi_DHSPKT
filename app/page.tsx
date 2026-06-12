import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BarChart3, Boxes, ClipboardList, ShieldCheck, Wrench } from "lucide-react";

import { auth } from "@/lib/auth";
import { ZoomSection } from "@/components/landing/zoom-section";

const navLinks = [
  { href: "#tinh-nang", label: "Tính năng" },
  { href: "#quy-trinh", label: "Quy trình" },
  { href: "#bao-mat", label: "Bảo mật & Hiệu năng" },
] as const;

const modules = [
  {
    title: "Quản lý thiết bị",
    icon: Boxes,
    body: "Kiểm soát toàn diện danh mục, vị trí, trạng thái bảo hành và tra xuất thông tin nhanh chóng bằng mã QR.",
  },
  {
    title: "Quy trình Mượn - Trả",
    icon: ClipboardList,
    body: "Số hóa hoàn toàn quá trình tạo phiếu mượn, xét duyệt tự động, và theo dõi lịch sử luân chuyển thiết bị.",
  },
  {
    title: "Bảo trì & Sửa chữa",
    icon: Wrench,
    body: "Lên lịch bảo trì định kỳ, ghi nhận sự cố kịp thời, giao việc cho kỹ thuật viên và kiểm soát chi phí.",
  },
  {
    title: "Kiểm kê định kỳ",
    icon: ShieldCheck,
    body: "Tổ chức đợt kiểm kê tài sản diện rộng, đối chiếu thực tế linh hoạt và chốt sổ dữ liệu nhanh gọn.",
  },
  {
    title: "Báo cáo thống kê",
    icon: BarChart3,
    body: "Cung cấp dashboard trực quan thống kê tình trạng sử dụng, hiệu suất thiết bị và báo cáo hao mòn.",
  },
] as const;

const steps = [
  { title: "Khởi tạo dữ liệu", body: "Thiết lập sơ đồ phòng ban, kho bãi và nhập danh sách tải sản ban đầu vào nền tảng." },
  { title: "Gán nhãn định danh", body: "Xuất mã QR cho từng thiết bị và dán nhãn để phục vụ việc tra cứu thông minh." },
  { title: "Vận hành số hóa", body: "Thực hiện mọi nghiệp vụ mượn trả, điều chuyển và bảo trì hoàn toàn trên phần mềm." },
  { title: "Phân tích & Tối ưu", body: "Theo dõi báo cáo tự động để đưa ra quyết định mua sắm, thay thế hoặc thanh lý." },
] as const;

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Header - App Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-6 py-4 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-teal-600">QLTHIETBI</p>
              <p className="text-xs font-medium text-slate-500">DHSPKT Asset Hub</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-teal-700">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-teal-700 hover:shadow-md active:scale-95"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 pb-20 pt-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:gap-12">

          {/* Hero Section */}
          <ZoomSection className="grid gap-10 rounded-[32px] bg-white p-8 md:p-12 shadow-md ring-1 ring-slate-100 lg:grid-cols-[1fr_0.8fr] items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-teal-700 ring-1 ring-teal-600/20">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
                </span>
                Phiên bản thử nghiệm (Beta)
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:leading-tight">
                  Nền tảng quản lý thiết bị toàn diện cho môi trường giáo dục.
                </h1>
                <p className="text-lg leading-relaxed text-slate-600">
                  Minh bạch dữ liệu, chuẩn hóa quy trình và tự động hóa báo cáo. Giải pháp tối ưu dành riêng cho các trường đại học, trung tâm thực hành và phòng thí nghiệm.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-base font-medium tracking-wide text-white shadow-md transition-all duration-200 hover:bg-teal-700 hover:shadow-lg active:scale-95"
                >
                  Bắt đầu ngay
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#tinh-nang"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-medium text-teal-700 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:bg-slate-50 hover:shadow active:scale-95"
                >
                  Khám phá tính năng
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                {[
                  { label: "Bảo mật", value: "Kiểm soát truy cập" },
                  { label: "Mã hóa", value: "Định danh bằng QR" },
                  { label: "Nhật ký", value: "Theo dõi chỉnh sửa" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                    <p className="text-sm font-medium text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div id="bao-mat" className="rounded-2xl bg-slate-900 p-8 text-white shadow-lg">
                <ShieldCheck className="h-8 w-8 text-teal-400" />
                <h2 className="mt-5 text-xl font-bold">An toàn & Tin cậy</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Dữ liệu được mã hóa an toàn, kết hợp cơ chế phân quyền bảo mật nhiều lớp (RBAC) đảm bảo mỗi vai trò chỉ tương tác với luồng thông tin phù hợp.
                </p>
              </div>
              <div className="rounded-2xl bg-teal-50 p-8 text-slate-900 shadow-sm ring-1 ring-teal-100">
                <Wrench className="h-8 w-8 text-teal-700" />
                <h2 className="mt-5 text-xl font-bold">Vận hành mượt mà</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Hệ thống thiết kế theo tiêu chuẩn Material Design trực quan, tương thích đa thiết bị, mang lại trải nghiệm tương tác liền mạch, nhanh nhẹn như thao tác trên giấy truyền thống.
                </p>
              </div>
            </div>
          </ZoomSection>

          {/* Features Grid */}
          <div className="mt-8 text-center">
            <h2 id="tinh-nang" className="text-3xl font-bold text-slate-900">Tính năng cốt lõi</h2>
            <p className="mt-3 mx-auto max-w-2xl text-slate-600">Công cụ chuyên sâu được phát triển để giải quyết triệt để các bài toán quản lý tài sản thực tế.</p>
          </div>

          <ZoomSection className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </div>
              );
            })}
          </ZoomSection>

          {/* Workflow Section */}
          <ZoomSection id="quy-trinh" className="mt-8 overflow-hidden rounded-[32px] bg-white shadow-md ring-1 ring-slate-100">
            <div className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/50">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Quy trình triển khai</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">4 bước đơn giản hóa quản lý tài sản</h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                Sẵn sàng đưa hệ thống vào áp dụng thực tiễn chỉ trong thời gian ngắn mà không yêu cầu chuyên môn công nghệ sâu.
              </p>
            </div>

            <div className="grid divide-y divide-slate-100 md:grid-cols-2 lg:grid-cols-4 md:divide-x md:divide-y-0">
              {steps.map((step, index) => (
                <div key={step.title} className="bg-white p-8 transition-colors hover:bg-slate-50">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 p-8 text-center flex flex-col items-center justify-center sm:flex-row gap-4">
              <p className="text-white font-medium">Bắt đầu thiết lập chuẩn hóa hệ thống ngay hôm nay.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-teal-400 active:scale-95"
              >
                Trải nghiệm <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ZoomSection>

          {/* Footer */}
          <footer className="mt-4 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Boxes className="h-5 w-5 text-teal-600" />
              <p className="text-sm font-medium text-slate-700">© {new Date().getFullYear()} QLTHIETBI • DHSPKT Asset Hub.</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
              <Link href="/login" className="transition-colors hover:text-teal-700">
                Đăng nhập
              </Link>
              <Link href="/dashboard" className="transition-colors hover:text-teal-700">
                Vào Dashboard
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
