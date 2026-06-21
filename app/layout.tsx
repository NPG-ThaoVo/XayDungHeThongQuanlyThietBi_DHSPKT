import type { Metadata } from "next";

import { PwaRegister } from "@/components/pwa/sw-register";

import "./globals.css";

export const metadata: Metadata = {
  title: "QLTHIETBI",
  description: "Hệ thống quản lý thiết bị DHSPKT",
  applicationName: "QLTHIETBI",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "QLTHIETBI",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
};

export const viewport = {
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-950">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
