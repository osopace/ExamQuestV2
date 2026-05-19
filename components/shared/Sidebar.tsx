"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Library, Dumbbell, ClipboardList, BarChart3, Bookmark, Trophy, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { cn } from "@/utils/cn";
import { getTerm } from "@/utils/terminology";
import { useAuthStore } from "@/store/authStore";
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

  const term = getTerm(profile?.exam_type); // "Courses" or "Subjects"

  const NAV = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/courses", icon: Library, label: `My ${term}` },
    { href: "/practice", icon: Dumbbell, label: "Practice" },
    { href: "/quiz-history", icon: ClipboardList, label: "Quiz History" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
    { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  const handleLogout = async () => {
    await signOut();
    logout();
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-white border-r border-gray-100 fixed top-0 left-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-100">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen size={16} className="text-white" />
        </div>
        <span className="font-bold text-gray-900 text-lg">ExamQuest</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link key={href} href={href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors", active ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}>
              <Icon size={18} className={active ? "text-primary-600" : "text-gray-400"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100 space-y-0.5">
        {BOTTOM_NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors", active ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}>
              <Icon size={18} className={active ? "text-primary-600" : "text-gray-400"} />
              {label}
            </Link>
          );
        })}
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut size={18} className="text-gray-400" />
          Log Out
        </button>
      </div>

      {/* User */}
      <div className="p-3 border-t border-gray-100">
        <Link href="/profile" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {profile?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || "Student"}</p>
            <p className="text-xs text-gray-500 truncate">{profile?.email || ""}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
