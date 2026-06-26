import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

import { auth } from "@/lib/auth";

const roleRoutes: Record<string, string[]> = {
  "/dashboard/quan-tri": ["ADMIN"],
  "/dashboard/bao-cao": ["ADMIN", "TRUONG_KHOA"],
  "/dashboard/kiem-ke": ["ADMIN", "THU_KHO"],
  "/dashboard/thanh-ly": ["ADMIN", "THU_KHO", "TRUONG_KHOA"],
  "/dashboard/thiet-bi": ["ADMIN", "TRUONG_KHOA", "THU_KHO", "GIANG_VIEN"],
  "/dashboard/muon-tra": ["ADMIN", "TRUONG_KHOA", "THU_KHO", "GIANG_VIEN", "SINH_VIEN"],
};

export default auth((request: NextAuthRequest) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;

  if (!session?.user && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  for (const [route, roles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route) && !roles.includes(String(session?.user?.role ?? ""))) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
