"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "./Sidebar-Items";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-white p-4 flex flex-col">
      <div className="text-2xl font-bold mb-6 flex items-center gap-2">
        <div className="bg-[#6F4EF2] p-2 rounded text-white">Logo</div>
        <div className="">RFID</div>
      </div>
      

      <nav className="flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition",
              pathname === item.href
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}