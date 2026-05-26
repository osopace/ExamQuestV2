"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/shared/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { profile, loading } = useAuthStore();

  useEffect(() => {
    if (loading) return;
    if (!profile) { router.replace("/login"); return; }
    if (!profile.onboarding_complete) { router.replace("/onboarding"); return; }
  }, [profile, loading, router]);

  if (loading || !profile || !profile.onboarding_complete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 size={28} className="animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 md:ml-64">{children}</div>
    </div>
  );
}
