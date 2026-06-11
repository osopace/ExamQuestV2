"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { profile, loading } = useAuthStore();

  useEffect(() => {
    if (loading) return;
    if (profile) router.replace("/dashboard");
  }, [profile, loading, router]);

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-white">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl mb-auto">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen size={18} />
          </div>
          ExamQuest
        </Link>
        <div className="mb-auto">
          <h2 className="text-4xl font-bold leading-tight mb-5">
            Nigeria&apos;s smartest exam preparation platform.
          </h2>
          <p className="text-primary-200 text-lg leading-relaxed">
            10,000+ questions. Deep analytics. Real explanations. Join 500,000+ students.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[["500K+", "Students"], ["10K+", "Questions"], ["50+", "Universities"], ["4.9★", "Rating"]].map(
              ([v, l]) => (
                <div key={l} className="bg-white/10 rounded-2xl p-5">
                  <div className="text-2xl font-bold mb-1">{v}</div>
                  <div className="text-primary-200 text-sm">{l}</div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
