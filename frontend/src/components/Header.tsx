"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TopbarProps } from "@/types/index";

export default function Topbar({ user, language = "Eng (US)" }: TopbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          🇺🇸 <span>{language}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600"
            onClick={() => setOpen(!open)}
          >
            {user.name}
            <ChevronDown className="w-4 h-4" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden border z-10">
              <div className="px-4 py-2 text-sm text-gray-600">{user.role}</div>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
