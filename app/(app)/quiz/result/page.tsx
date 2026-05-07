"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, RotateCcw, ArrowRight, CheckCircle, XCircle, Minus } from "lucide-react";
import { Card } from "@/components/ui/index";
import { useQuizStore } from "@/store/quizStore";
import { getResultMessage, getScoreColor } from "@/utils/format";

export default function QuizResultPage() {
  const router = useRouter();
  const { quiz, questions, answers, reset } = useQuizStore();

  useEffect(() => {
    if (!quiz) router.push("/practice");
  }, [quiz, router]);

  if (!quiz) return null;

  const correctCount = Object.values(answers).filter((a) => a.is_correct).length;
  const incorrectCount = Object.values(answers).filter((a) => a.is_correct === false).length;
  const skippedCount = questions.length - Object.keys(answers).length;
  const scorePercent = Math.round((correctCount / questions.length) * 100);
  const { emoji, title, sub } = getResultMessage(scorePercent);

  // Weak topics
  const topicCounts: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q) => {
    if (!topicCounts[q.topic_name ?? q.topic_id]) topicCounts[q.topic_name ?? q.topic_id] = { correct: 0, total: 0 };
    topicCounts[q.topic_name ?? q.topic_id].total++;
    if (answers[q.id]?.is_correct) topicCounts[q.topic_name ?? q.topic_id].correct++;
  });
  const weakTopics = Object.entries(topicCounts)
    .map(([name, { correct, total }]) => ({ name, pct: Math.round((correct / total) * 100) }))
    .filter((t) => t.pct < 70)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-2xl space-y-6">

        {/* Score hero */}
        <Card padding="lg" className="text-center">
          <div className="text-5xl mb-4">{emoji}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">{sub}</p>
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(scorePercent)}`}>{scorePercent}%</div>
          <p className="text-gray-500 text-sm mb-8">{quiz.course_name}</p>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <CheckCircle size={20} className="text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{correctCount}</p>
              <p className="text-xs text-green-600">Correct</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <XCircle size={20} className="text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{incorrectCount}</p>
              <p className="text-xs text-red-500">Incorrect</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <Minus size={20} className="text-gray-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-600">{skippedCount}</p>
              <p className="text-xs text-gray-500">Skipped</p>
            </div>
          </div>
        </Card>

        {/* Weak topics */}
        {weakTopics.length > 0 && (
          <Card padding="md">
            <h3 className="font-bold text-gray-900 mb-4">Topics to Review</h3>
            <div className="space-y-3">
              {weakTopics.map((t) => (
                <div key={t.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{t.name}</span>
                  <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${t.pct >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>{t.pct}%</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/quiz/review">
            <button className="w-full h-12 rounded-xl border-2 border-primary-200 text-primary-700 font-semibold text-sm hover:bg-primary-50 transition-colors flex items-center justify-center gap-2">
              <ArrowRight size={16} /> Review Answers
            </button>
          </Link>
          <button
            onClick={() => { reset(); router.push("/practice"); }}
            className="w-full h-12 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Try Again
          </button>
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
