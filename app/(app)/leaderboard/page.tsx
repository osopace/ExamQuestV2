"use client";
import { useState, useEffect } from "react";

import { Trophy, Flame, BookOpen, Medal, Loader2, EyeOff } from "lucide-react";
import { Card, Avatar, Badge } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { cn } from "@/utils/cn";
import { getLeaderboard, getUserSettings } from "@/supabase/db";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";


type Entry = {
  rank: number;
  user_id: string;
  full_name: string;

  score: number | null;

  quizzes_completed: number;
  streak: number;
  is_current_user?: boolean;
};

const MEDAL_COLORS = ["text-amber-400", "text-gray-400", "text-amber-600"];
const PODIUM_BG = ["bg-amber-50 border-amber-200", "bg-gray-50 border-gray-200", "bg-orange-50 border-orange-200"];

function ScoreDisplay({ score, className }: { score: number | null; className?: string }) {
  if (score === null) {
    return <span className={cn("text-gray-400 font-semibold", className)}>—</span>;
  }
  return <span className={className}>{score.toLocaleString()} pts</span>;
}

export default function LeaderboardPage() {
  const { profile } = useAuthStore();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!profile) return;

    Promise.all([
      getLeaderboard(50),
      getUserSettings(profile.id),
    ])
      .then(([data, settings]) => {

        setEntries(
          data.map((e, i) => ({
            ...e,
            rank: i + 1,

            is_current_user: e.user_id === profile.id,
          }))
        );
        // profile_visibility defaults to true if no settings row yet
        if (settings && settings.profile_visibility === false) {
          setIsHidden(true);
        }
      })

      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profile?.id]);

  const top3 = entries.slice(0, 3);

  return (
    <div>
      <Topbar title="Leaderboard" />
      <div className="p-6 max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Trophy size={26} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Nigeria Top Students</h2>
          <p className="text-sm text-gray-500 mt-1">Updated live · 10 pts per correct answer + streak bonus</p>
        </div>

        {/* Privacy banner — shown when current user has hidden their profile */}
        {isHidden && (
          <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5">
            <EyeOff size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">Your profile is hidden from this leaderboard</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Turn on <span className="font-medium">Public Profile</span> in{" "}
                <Link href="/settings" className="text-primary-600 hover:underline">Settings → Privacy</Link> to appear here.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading leaderboard...</span>
          </div>

        ) : entries.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Trophy size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-600">No scores yet</p>
            <p className="text-sm mt-1">Complete a quiz to appear on the leaderboard.</p>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            {top3.length >= 3 && (
              <div className="flex items-end justify-center gap-3">
                {/* 2nd */}
                <div className={`flex-1 max-w-[140px] border-2 rounded-2xl p-4 text-center ${PODIUM_BG[1]}`}>
                  <Medal size={18} className={`mx-auto mb-2 ${MEDAL_COLORS[1]}`} />
                  <Avatar name={top3[1].full_name} size="sm" className="mx-auto mb-2" />
                  <p className="font-bold text-gray-900 text-xs truncate">{top3[1].full_name}</p>

                  <ScoreDisplay score={top3[1].score} className="text-sm font-bold text-gray-700 mt-1 block" />

                  <p className="text-xs text-gray-400">pts</p>
                </div>
                {/* 1st */}
                <div className={`flex-1 max-w-[160px] border-2 rounded-2xl p-5 text-center ${PODIUM_BG[0]}`}>
                  <Medal size={22} className={`mx-auto mb-2 ${MEDAL_COLORS[0]}`} />
                  <Avatar name={top3[0].full_name} size="md" className="mx-auto mb-2" />
                  <p className="font-bold text-gray-900 text-sm truncate">{top3[0].full_name}</p>

                  <ScoreDisplay score={top3[0].score} className="text-base font-bold text-amber-600 mt-1 block" />

                  <p className="text-xs text-gray-400">pts · #1</p>
                </div>
                {/* 3rd */}
                <div className={`flex-1 max-w-[140px] border-2 rounded-2xl p-4 text-center ${PODIUM_BG[2]}`}>
                  <Medal size={18} className={`mx-auto mb-2 ${MEDAL_COLORS[2]}`} />
                  <Avatar name={top3[2].full_name} size="sm" className="mx-auto mb-2" />
                  <p className="font-bold text-gray-900 text-xs truncate">{top3[2].full_name}</p>

                  <ScoreDisplay score={top3[2].score} className="text-sm font-bold text-gray-700 mt-1 block" />

                  <p className="text-xs text-gray-400">pts</p>
                </div>
              </div>
            )}

            {/* Full rankings table */}
            <Card padding="none">
              <div className="divide-y divide-gray-50">
                {entries.map((entry) => (
                  <div
                    key={entry.user_id}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3.5 transition-colors",
                      entry.is_current_user ? "bg-primary-50" : "hover:bg-gray-50"
                    )}
                  >
                    <span className={cn(
                      "w-7 text-center text-sm font-bold flex-shrink-0",
                      entry.rank === 1 ? "text-amber-500" :
                      entry.rank === 2 ? "text-gray-400" :
                      entry.rank === 3 ? "text-amber-600" : "text-gray-400"
                    )}>
                      {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                    </span>
                    <Avatar name={entry.full_name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          "font-semibold text-sm truncate",
                          entry.is_current_user ? "text-primary-700" : "text-gray-900"
                        )}>
                          {entry.full_name}
                        </p>
                        {entry.is_current_user && <Badge variant="primary" size="sm">You</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <BookOpen size={10} />{entry.quizzes_completed} quizzes
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame size={10} className="text-orange-400" />{entry.streak} day streak
                        </span>
                      </div>
                    </div>

                    <ScoreDisplay
                      score={entry.score}
                      className="text-sm font-bold text-gray-900 flex-shrink-0"
                    />

                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

      </div>
    </div>
  );
}
