"use client";
import { useEffect, useState } from "react";
import { TrendingUp, Target, Clock, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Card } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { getUserQuizzes } from "@/supabase/db";
import { getScoreColor, getScoreBg, formatDuration } from "@/utils/format";
import { useAuthStore } from "@/store/authStore";
import type { Quiz } from "@/types";

export default function AnalyticsPage() {
  const { profile } = useAuthStore();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;
    getUserQuizzes(profile.id, 100)
      .then(setQuizzes)
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  }, [profile?.id]);

  const totalQuizzes = quizzes.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(quizzes.reduce((s, q) => s + (q.score_percent ?? 0), 0) / totalQuizzes)
    : 0;
  const bestScore = totalQuizzes > 0 ? Math.max(...quizzes.map((q) => q.score_percent ?? 0)) : 0;
  const totalTime = quizzes.reduce((s, q) => s + (q.time_taken_seconds ?? 0), 0);

  // Score over time — group by date, average score per day
  const byDate: Record<string, number[]> = {};
  quizzes.forEach((q) => {
    const date = new Date(q.started_at).toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(q.score_percent ?? 0);
  });
  const scoreOverTime = Object.entries(byDate)
    .slice(-10)
    .map(([date, scores]) => ({
      date,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));

  // Per-subject performance
  const bySubject: Record<string, { scores: number[]; quizzes: number; best: number }> = {};
  quizzes.forEach((q) => {
    const key = q.course_id;
    if (!bySubject[key]) bySubject[key] = { scores: [], quizzes: 0, best: 0 };
    bySubject[key].scores.push(q.score_percent ?? 0);
    bySubject[key].quizzes++;
    if ((q.score_percent ?? 0) > bySubject[key].best) bySubject[key].best = q.score_percent ?? 0;
  });
  const subjectPerformance = Object.entries(bySubject).map(([id, data]) => ({
    course_id: id,
    course_name: id.charAt(0).toUpperCase() + id.slice(1),
    average_score: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
    highest_score: data.best,
    total_quizzes: data.quizzes,
  }));

  const STATS = [
    { icon: BarChart3, label: "Avg Score", value: totalQuizzes > 0 ? `${avgScore}%` : "—", color: "text-primary-600", bg: "bg-primary-50" },
    { icon: TrendingUp, label: "Total Quizzes", value: String(totalQuizzes), color: "text-green-600", bg: "bg-green-50" },
    { icon: Target, label: "Best Score", value: totalQuizzes > 0 ? `${bestScore}%` : "—", color: "text-amber-600", bg: "bg-amber-50" },
    { icon: Clock, label: "Study Time", value: totalTime > 0 ? formatDuration(totalTime) : "—", color: "text-blue-600", bg: "bg-blue-50" },
  ];

  if (loading) {
    return (
      <div>
        <Topbar title="Analytics" />
        <div className="p-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Topbar title="Analytics" />
      <div className="p-6 max-w-6xl mx-auto space-y-7">

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ icon: Icon, label, value, color, bg }) => (
            <Card key={label} padding="md">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </Card>
          ))}
        </div>

        {totalQuizzes === 0 ? (
          <Card padding="lg" className="text-center py-16">
            <BarChart3 size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="font-semibold text-gray-500">No quiz data yet</p>
            <p className="text-sm text-gray-400 mt-1">Complete some quizzes to see your analytics here.</p>
          </Card>
        ) : (
          <>
            {/* Score over time */}
            {scoreOverTime.length > 1 && (
              <Card padding="md">
                <h2 className="font-bold text-gray-900 mb-5">Score Over Time</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={scoreOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} formatter={(v) => [`${v}%`, "Score"]} />
                    <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 4, fill: "#4F46E5" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Subject breakdown table */}
            {subjectPerformance.length > 0 && (
              <Card padding="none">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Subject Performance</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {subjectPerformance.map((cp) => {
                    const isExpanded = expanded === cp.course_id;
                    return (
                      <div key={cp.course_id}>
                        <button
                          onClick={() => setExpanded(isExpanded ? null : cp.course_id)}
                          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                              <BarChart3 size={14} className="text-primary-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{cp.course_name}</p>
                              <p className="text-xs text-gray-500">{cp.total_quizzes} quizzes taken</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${getScoreBg(cp.average_score)}`}>{cp.average_score}%</span>
                            {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="px-5 pb-4 grid grid-cols-3 gap-3 bg-gray-50">
                            {[["Best Score", `${cp.highest_score}%`], ["Avg Score", `${cp.average_score}%`], ["Quizzes", String(cp.total_quizzes)]].map(([label, value]) => (
                              <div key={label} className="bg-white rounded-xl p-3 text-center">
                                <p className="text-sm font-bold text-gray-900">{value}</p>
                                <p className="text-xs text-gray-500">{label}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </>
        )}

      </div>
    </div>
  );
}
