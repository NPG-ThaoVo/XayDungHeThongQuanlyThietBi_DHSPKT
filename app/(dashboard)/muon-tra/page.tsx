import Link from "next/link";
import { ArrowRight, PackagePlus, ShieldCheck, Trash2, Workflow } from "lucide-react";

import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";

const nextModules = [
  {
    href: "/dashboard/phieu-nhap",
    label: "Phiếu nhập",
    description: "Quản lý đầu vào tài sản và chứng từ nhập kho.",
    icon: PackagePlus,
  },
  {
    href: "/dashboard/phan-bo",
    label: "Phân bổ thiết bị",
    description: "Theo dõi tài sản đã gán khoa, phòng và lịch sử di chuyển.",
    icon: Workflow,
  },
  {
    href: "/dashboard/kiem-ke",
    label: "Kiểm kê",
    description: "Đối chiếu hiện trạng và xác nhận trạng thái tài sản.",
    icon: ShieldCheck,
  },
  {
    href: "/dashboard/thanh-ly",
    label: "Thanh lý",
    description: "Xử lý tài sản không còn phù hợp với hoạt động.",
    icon: Trash2,
  },
];

export default function BorrowPage() {
  return (
    <>
      <Topbar
        title="Mượn - trả"
        description="Chức năng mượn trả đã được thay thế bằng phiếu nhập, phân bổ và thanh lý."
      />
      <main className="space-y-6 p-6">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Mô-đun đã ngừng sử dụng
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-950">
            Quy trình mượn - trả không còn được sử dụng trong schema hiện tại
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Thay vì lập phiếu mượn, hệ thống mới ưu tiên nhập kho, phân bổ theo đơn vị và ghi
            nhận thanh lý. Nếu bạn cần quản lý sử dụng tạm thời, hãy chuyển sang mô-đun phân bổ
            và lịch sử di chuyển.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/phieu-nhap"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-teal-700"
            >
              Đi đến phiếu nhập
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/phan-bo"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-teal-700 ring-1 ring-teal-600/20 transition-all hover:bg-teal-50"
            >
              Mở phân bổ
            </Link>
          </div>
        </Card>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {nextModules.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.href} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Link href={item.href} className="text-sm font-medium text-teal-700">
                    Mở
                  </Link>
                </div>
                <h4 className="mt-4 text-lg font-semibold text-slate-950">{item.label}</h4>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
              </Card>
            );
          })}
        </section>
      </main>
    </>
  );
}
