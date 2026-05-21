"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, BookOpen, BarChart3, Trophy, Play, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/index";
import { ProgressBar } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { getUserQuizzes } from "@/supabase/db";
import { formatRelativeDate, getScoreBg, getInitials } from "@/utils/format";
import { useAuthStore } from "@/store/authStore";
import type { Quiz } from "@/types";

export default function DashboardPage() {
  const { profile } = useAuthStore();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;
    getUserQuizzes(profile.id, 50)
      .then(setQuizzes)
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  }, [profile?.id]);

  const totalQuizzes = quizzes.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(quizzes.reduce((s, q) => s + (q.score_percent ?? 0), 0) / totalQuizzes)
    : 0;
  const bestScore = totalQuizzes > 0
    ? Math.max(...quizzes.map((q) => q.score_percent ?? 0))
    : 0;

  const enrolledIds = profile?.enrolled_course_ids ?? [];
  const subjectQuizCounts: Record<string, number> = {};
  quizzes.forEach((q) => {
    subjectQuizCounts[q.course_id] = (subjectQuizCounts[q.course_id] ?? 0) + 1;
  });

  const continueItems = enrolledIds.map((id) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    quizCount: subjectQuizCounts[id] ?? 0,
  })).slice(0, 3);

  const recentQuizzes = quizzes.slice(0, 4);

  const STAT_CARDS = [
    { icon: Flame, label: "Day Streak", value: `${profile?.current_streak ?? 0} days`, color: "text-orange-500", bg: "bg-orange-50" },
    { icon: BarChart3, label: "Avg Score", value: totalQuizzes > 0 ? `${avgScore}%` : "—", color: "text-primary-600", bg: "bg-primary-50" },
    { icon: BookOpen, label: "Quizzes Taken", value: String(totalQuizzes), color: "text-green-600", bg: "bg-green-50" },
    { icon: Trophy, label: "Best Score", value: totalQuizzes > 0 ? `${bestScore}%` : "—", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <div>
      <Topbar title="Dashboard" />
      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* Welcome */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Good day, {firstName} 👋</h2>
            <p className="text-gray-600 mt-1">
              {profile?.current_streak && profile.current_streak > 0
                ? `You're on a ${profile.current_streak}-day streak. Keep it up!`
                : "Start a quiz to begin your streak!"}
            </p>
          </div>
          <Link href="/practice">
            <button className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
              <Play size={16} /> Start Quiz
            </button>
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ icon: Icon, label, value, color, bg }) => (
            <Card key={label} padding="md">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">Continue Learning</h3>
              <Link href="/courses" className="text-sm text-primary-600 flex items-center gap-1 hover:gap-2 transition-all">
                View all <ArrowRight size={15} />
              </Link>
            </div>

            {continueItems.length === 0 ? (
              <Card padding="md" className="text-center py-8">
                <p className="text-gray-500 text-sm mb-3">No subjects enrolled yet.</p>
                <Link href="/courses">
                  <button className="text-sm text-primary-600 font-semibold hover:underline">Browse courses →</button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {continueItems.map((item) => (
                  <Card key={item.id} padding="md" hoverable>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.quizCount} quizzes taken</p>
                      </div>
                      <Link href={`/practice?course=${encodeURIComponent(item.id)}`}>
                        <button className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center hover:bg-primary-100 transition-colors">
                          <Play size={15} className="text-primary-600" />
                        </button>
                      </Link>
                    </div>
                    <ProgressBar
                      value={item.quizCount > 0 ? Math.min(100, item.quizCount * 10) : 0}
                      showLabel
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={18} className="text-orange-500" />
                <h4 className="font-bold text-gray-900">Daily Streak</h4>
              </div>
              <div className="text-center py-2">
                <p className="text-4xl font-bold text-orange-500">{profile?.current_streak ?? 0}</p>
                <p className="text-sm text-gray-500 mt-1">day{profile?.current_streak !== 1 ? "s" : ""} in a row</p>
                {(profile?.longest_streak ?? 0) > 0 && (
                  <p className="text-xs text-gray-400 mt-2">Best: {profile?.longest_streak} days</p>
                )}
              </div>
            </Card>

            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-primary-600" />
                <h4 className="font-bold text-gray-900">Quick Start</h4>
              </div>
              <div className="space-y-2">
                {enrolledIds.slice(0, 3).map((id) => (
                  <Link key={id} href={`/practice?course=${encodeURIComponent(id)}`}>
                    <div className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen size={14} className="text-primary-600" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 self-center capitalize">{id}</p>
                    </div>
                  </Link>
                ))}
                {enrolledIds.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-3">Enrol in subjects to see quick links.</p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Recent quizzes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Recent Quizzes</h3>
            <Link href="/quiz-history" className="text-sm text-primary-600 flex items-center gap-1">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          <Card padding="none">
            <div className="divide-y divide-gray-50">
              {recentQuizzes.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-400">
                  <BookOpen size={28} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium">No quizzes yet</p>
                  <p className="text-xs mt-1">Complete a quiz to see your history here.</p>
                </div>
              )}
              {recentQuizzes.map((q) => (
                <div key={q.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm capitalize">{q.course_name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{q.mode} mode</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{formatRelativeDate(q.started_at)}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${getScoreBg(q.score_percent ?? 0)}`}>
                    {q.score_percent}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
