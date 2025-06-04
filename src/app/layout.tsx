// Root HTML layout providing Inter typeface and application shell providers
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppProviders from "./AppProviders";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "J-TAG - Sistem Presensi RFID SMK Negeri 1 Jenangan",
  description: "Aplikasi Operasional Presensi RFID SMK Negeri 1 Jenangan",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className={`${inter.variable} antialiased font-sans text-slate-900 bg-slate-50 h-full overflow-hidden`}>
        <AppProviders>{children}</AppProviders>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
