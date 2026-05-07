"use client";
import { useState } from "react";
import { TrendingUp, Target, Clock, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Card } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { SCORE_OVER_TIME, TOPIC_ANALYTICS, COURSE_PROGRESS } from "@/constants/mockData";
import { getScoreColor, getScoreBg } from "@/utils/format";

export default function AnalyticsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const avgScore = Math.round(COURSE_PROGRESS.reduce((s, c) => s + c.average_score, 0) / COURSE_PROGRESS.length);
  const totalQuizzes = COURSE_PROGRESS.reduce((s, c) => s + c.total_quizzes, 0);

  return (
    <div>
      <Topbar title="Analytics" />
      <div className="p-6 max-w-6xl mx-auto space-y-7">

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BarChart3, label: "Avg Score", value: `${avgScore}%`, color: "text-primary-600", bg: "bg-primary-50" },
            { icon: TrendingUp, label: "Total Quizzes", value: String(totalQuizzes), color: "text-green-600", bg: "bg-green-50" },
            { icon: Target, label: "Best Score", value: "93%", color: "text-amber-600", bg: "bg-amber-50" },
            { icon: Clock, label: "Study Time", value: "14h 30m", color: "text-blue-600", bg: "bg-blue-50" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <Card key={label} padding="md">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </Card>
          ))}
        </div>

        {/* Score over time */}
        <Card padding="md">
          <h2 className="font-bold text-gray-900 mb-5">Score Over Time</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={SCORE_OVER_TIME} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} formatter={(v) => [`${v}%`, "Score"]} />
              <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 4, fill: "#4F46E5" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Topic accuracy bar chart */}
        <Card padding="md">
          <h2 className="font-bold text-gray-900 mb-5">Accuracy by Topic — Data Structures</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TOPIC_ANALYTICS} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="topic_name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${v}%`, "Accuracy"]} contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }} />
              <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                {TOPIC_ANALYTICS.map((entry) => (
                  <Cell key={entry.topic_id} fill={entry.accuracy >= 80 ? "#22C55E" : entry.accuracy >= 60 ? "#F59E0B" : "#EF4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Course breakdown table */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Course Performance</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {COURSE_PROGRESS.map((cp) => {
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
                      {[["Best Score", `${cp.highest_score}%`], ["Avg Score", `${cp.average_score}%`], ["Progress", `${cp.progress_percent}%`]].map(([label, value]) => (
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

      </div>
    </div>
  );
}
