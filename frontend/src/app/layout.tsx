import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import '@mantine/charts/styles.css';
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Header";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "J-TAG",
  description: "J-TAG Absensi Siswa berbasis RFID",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <MantineProvider>
          <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Topbar */}
              <Topbar user={{ name: "Musfiq", role: "Guru" }} />
              {/* Page Content */}
              <main className="flex-1 overflow-y-auto p-4">
                {children}
              </main>
            </div>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}