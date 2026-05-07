"use client";
import Link from "next/link";
import { ArrowRight, Flame, BookOpen, BarChart3, Trophy, Play, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/index";
import { ProgressBar } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { MOCK_QUIZ_HISTORY, COURSE_PROGRESS, COURSES } from "@/constants/mockData";
import { formatRelativeDate, getScoreBg } from "@/utils/format";

const STAT_CARDS = [
  { icon: Flame, label: "Day Streak", value: "7 days", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: BarChart3, label: "Avg Score", value: "74%", color: "text-primary-600", bg: "bg-primary-50" },
  { icon: BookOpen, label: "Quizzes Taken", value: "30", color: "text-green-600", bg: "bg-green-50" },
  { icon: Trophy, label: "Leaderboard Rank", value: "#6", color: "text-amber-600", bg: "bg-amber-50" },
];

const RECOMMENDATIONS = [
  { courseId: "csc101", reason: "Your score dropped 12% in Trees & Graphs — focus here first." },
  { courseId: "alg101", reason: "You haven't practiced Algorithms in 4 days — keep your streak going." },
];

export default function DashboardPage() {
  const recent = MOCK_QUIZ_HISTORY.slice(0, 4);

  return (
    <div>
      <Topbar title="Dashboard" />
      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* Welcome */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Good morning, Student 👋</h2>
            <p className="text-gray-600 mt-1">You're on a 7-day streak. Keep it up!</p>
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
              <Link href="/courses" className="text-sm text-primary-600 flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight size={15} /></Link>
            </div>
            <div className="space-y-3">
              {COURSE_PROGRESS.map((cp) => (
                <Card key={cp.course_id} padding="md" hoverable>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{cp.course_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{cp.total_quizzes} quizzes · Avg {cp.average_score}%</p>
                    </div>
                    <Link href={`/practice?course=${cp.course_id}`}>
                      <button className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center hover:bg-primary-100 transition-colors">
                        <Play size={15} className="text-primary-600" />
                      </button>
                    </Link>
                  </div>
                  <ProgressBar value={cp.progress_percent} showLabel />
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar panels */}
          <div className="space-y-5">
            {/* Streak */}
            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={18} className="text-orange-500" />
                <h4 className="font-bold text-gray-900">Daily Streak</h4>
              </div>
              <div className="flex gap-1.5 mb-3">
                {["M","T","W","T","F","S","S"].map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${i < 5 ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>{i < 5 ? "✓" : d}</div>
                    <span className="text-xs text-gray-400">{d}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">Keep going — 2 more days to your longest streak!</p>
            </Card>

            {/* Recommendations */}
            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-primary-600" />
                <h4 className="font-bold text-gray-900">Recommended</h4>
              </div>
              <div className="space-y-3">
                {RECOMMENDATIONS.map((r) => {
                  const course = COURSES.find((c) => c.id === r.courseId);
                  return (
                    <Link key={r.courseId} href={`/practice?course=${r.courseId}`}>
                      <div className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen size={14} className="text-primary-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{course?.name}</p>
                          <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{r.reason}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Recent quizzes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Recent Quizzes</h3>
            <Link href="/quiz-history" className="text-sm text-primary-600 flex items-center gap-1">View all <ArrowRight size={15} /></Link>
          </div>
          <Card padding="none">
            <div className="divide-y divide-gray-50">
              {recent.map((q) => (
                <div key={q.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{q.course_name}</p>
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
