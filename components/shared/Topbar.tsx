"use client";
import { Menu } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Avatar } from "@/components/ui/index";
import NotificationBell from "@/components/shared/NotificationBell";
import SearchBar from "@/components/shared/SearchBar";

export default function Topbar({ title }: { title?: string }) {
  const { profile } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={toggleSidebar}
          className="md:hidden w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={18} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <SearchBar />
        <NotificationBell />
        <Avatar
          name={profile?.full_name ?? ""}
          src={profile?.avatar_url ?? undefined}
          size="sm"
          className="rounded-xl w-10 h-10"
        />
      </div>
    </header>
  );
}
