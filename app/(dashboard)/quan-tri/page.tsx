import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { UserManagementPanel } from "@/components/quan-tri/user-management-panel";

export const dynamic = "force-dynamic";

export default async function QuanTriPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const [users, khoaList] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        maSoNV: true,
        phone: true,
        khoaId: true,
        khoa: { select: { tenKhoa: true } },
        createdAt: true,
      },
    }),
    prisma.khoa.findMany({ orderBy: { tenKhoa: "asc" } }),
  ]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const sinhVienCount = users.filter((u) => u.role === "SINH_VIEN").length;

  return (
    <>
      <Topbar
        title="Quản lý người dùng"
        description="Tạo, cập nhật và kiểm soát quyền truy cập của tất cả tài khoản trong hệ thống."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Tổng tài khoản</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{totalUsers}</p>
            <p className="mt-2 text-sm text-slate-500">{activeUsers} đang hoạt động</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Quản trị viên</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{adminCount}</p>
            <p className="mt-2 text-sm text-slate-500">Tài khoản ADMIN</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Sinh viên</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{sinhVienCount}</p>
            <p className="mt-2 text-sm text-slate-500">Có thể mượn thiết bị</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-500">Vô hiệu hoá</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{totalUsers - activeUsers}</p>
            <p className="mt-2 text-sm text-slate-500">Tài khoản bị khoá</p>
          </Card>
        </section>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-950 mb-6">Danh sách tài khoản</h3>
          <UserManagementPanel
            initialUsers={JSON.parse(JSON.stringify(users))}
            khoaList={khoaList}
          />
        </Card>
      </main>
    </>
  );
}
