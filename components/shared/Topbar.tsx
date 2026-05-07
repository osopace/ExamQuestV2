"use client";
import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Topbar({ title }: { title?: string }) {
  const { profile } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900 hidden sm:block">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-xl px-3 h-10 w-56 border border-gray-200">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input placeholder="Search courses, topics..." className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none w-full" />
        </div>
        <button className="relative w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-600 rounded-full" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white text-sm font-bold">
          {profile?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
