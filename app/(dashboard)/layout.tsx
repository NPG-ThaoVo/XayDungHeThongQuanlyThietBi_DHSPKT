import { auth } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userRole = session?.user?.role;
  return <AppShell userRole={userRole}>{children}</AppShell>;
}
