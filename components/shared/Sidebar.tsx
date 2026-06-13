"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Dumbbell,
  ClipboardList,
  BarChart3,
  Bookmark,
  Trophy,
  User,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";

import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Avatar } from "@/components/ui/index";
import { signOut } from "@/supabase/auth";
import { useRouter } from "next/navigation";

const BOTTOM_NAV = [
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/help", icon: HelpCircle, label: "Help" },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const { profile, logout } = useAuthStore();
  const { sidebarOpen, closeSidebar, toggleSidebar } = useUIStore();

  const term = "subjects";

  const NAV = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/courses", icon: Library, label: `My ${term}` },
    { href: "/practice", icon: Dumbbell, label: "Practice" },
    { href: "/quiz-history", icon: ClipboardList, label: "Quiz History" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
    { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  // Close drawer on route change (mobile)
  useEffect(() => {
    closeSidebar();
  }, [path, closeSidebar]);

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      console.error("Error during sign out: failing");
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      // Always clear local state and redirect even if the server call fails
      logout();
      router.replace("/login");
    }
  };

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={cn(
          "fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden",
          "transition-opacity duration-300 ease-in-out",
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          "flex flex-col w-64 h-screen bg-white border-r border-gray-100",
          "fixed top-0 left-0 z-30",
          // Mobile: slide in/out
          "transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo row + mobile close button */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">ExamQuest</span>
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav — scrollable so it never pushes user section off-screen */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = path === href || path.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <Icon
                  size={18}
                  className={active ? "text-primary-600" : "text-gray-400"}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="p-3 border-t border-gray-100 space-y-0.5 flex-shrink-0">
          {BOTTOM_NAV.map(({ href, icon: Icon, label }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <Icon
                  size={18}
                  className={active ? "text-primary-600" : "text-gray-400"}
                />
                {label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} className="text-gray-400" />
            Log Out
          </button>
        </div>

        {/* User card — always visible, never cut off */}
        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          <Link
            href="/profile"
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Avatar
              name={profile?.full_name ?? ""}
              src={profile?.avatar_url ?? undefined}
              size="sm"
              className="flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.full_name || "Student"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {profile?.email || ""}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
