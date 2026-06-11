"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getNotifications, markAllNotificationsRead, deleteNotification } from "@/supabase/db";
import { cn } from "@/utils/cn";
import type { AppNotification } from "@/types";

const TYPE_ICON: Record<string, string> = {
  quiz_reminder: "📚",
  study_reminder: "📖",
  performance_digest: "📊",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const { profile } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  const load = async () => {
    if (!profile) return;
    const data = await getNotifications(profile.id);
    setNotifications(data);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [profile?.id]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = async () => {
    const opening = !open;
    setOpen(opening);
    if (opening && unread > 0 && profile) {
      await markAllNotificationsRead(profile.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} className="text-gray-600" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-[72px] sm:top-12 sm:w-80 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-900 text-sm">Notifications</span>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-2xl mb-2">🔔</p>
                <p className="text-sm text-gray-500">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">They'll show up here when your reminders fire</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "px-4 py-3 flex gap-3 transition-colors group",
                    !n.read && "bg-primary-50"
                  )}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">
                    {TYPE_ICON[n.type] ?? "🔔"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-snug">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.read ? (
                    <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2" />
                  ) : (
                    <button
                      onClick={() => {
                        deleteNotification(n.id);
                        setNotifications((prev) => prev.filter((x) => x.id !== n.id));
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5 p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400"
                      aria-label="Delete notification"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
