"use client";
import { useEffect, useState } from "react";
import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, Badge } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { getUserQuizzes } from "@/supabase/db";
import { formatDate, formatDuration, getScoreBg } from "@/utils/format";
import { useAuthStore } from "@/store/authStore";
import type { Quiz } from "@/types";

type FilterMode = "all" | "quiz" | "study";

export default function QuizHistoryPage() {
  const { profile } = useAuthStore();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");

  useEffect(() => {
    if (!profile?.id) return;
    getUserQuizzes(profile.id, 100)
      .then(setQuizzes)
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  }, [profile?.id]);

  const filtered = quizzes.filter((q) => filter === "all" || q.mode === filter);
  const totalQuizzes = quizzes.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(quizzes.reduce((s, q) => s + (q.score_percent ?? 0), 0) / totalQuizzes)
    : 0;
  const bestScore = totalQuizzes > 0
    ? Math.max(...quizzes.map((q) => q.score_percent ?? 0))
    : 0;

  return (
    <div>
      <Topbar title="Quiz History" />
      <div className="p-6 max-w-4xl mx-auto space-y-6">

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Quizzes", value: totalQuizzes, icon: BookOpen, color: "text-primary-600", bg: "bg-primary-50" },
            { label: "Average Score", value: totalQuizzes > 0 ? `${avgScore}%` : "—", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Best Score", value: totalQuizzes > 0 ? `${bestScore}%` : "—", icon: CheckCircle, color: "text-amber-600", bg: "bg-amber-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} padding="md" className="text-center">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon size={18} className={color} />
              </div>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          {(["all", "quiz", "study"] as FilterMode[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 h-9 rounded-xl text-sm font-medium capitalize transition-colors ${filter === f ? "bg-primary-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {f === "all" ? "All" : f === "quiz" ? "Quiz Mode" : "Study Mode"}
            </button>
          ))}
        </div>

        <Card padding="none">
          <div className="divide-y divide-gray-50">
            {!loading && filtered.length === 0 && (
              <div className="text-center py-14 text-gray-400">
                <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
                <p className="font-medium">No quizzes yet</p>
                <p className="text-sm mt-1">Start practicing to see your history here.</p>
              </div>
            )}
            {filtered.map((q) => (
              <div key={q.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen size={16} className="text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900 text-sm capitalize">{q.course_name}</p>
                    <Badge variant={q.mode === "quiz" ? "primary" : "info"} size="sm">
                      {q.mode === "quiz" ? "Quiz" : "Study"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{formatDate(q.started_at)}</span>
                    <span>·</span>
                    <span>{q.total_questions} questions</span>
                    {q.time_taken_seconds && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{formatDuration(q.time_taken_seconds)}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <span className="flex items-center gap-1 text-green-600"><CheckCircle size={11} />{q.correct_count} correct</span>
                    <span className="flex items-center gap-1 text-red-500"><XCircle size={11} />{q.incorrect_count} wrong</span>
                  </div>
                </div>
                <span className={`text-base font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${getScoreBg(q.score_percent ?? 0)}`}>
                  {q.score_percent}%
                </span>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
