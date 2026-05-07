"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/index";
import { cn } from "@/utils/cn";
import { useQuizStore } from "@/store/quizStore";

export default function QuizReviewPage() {
  const router = useRouter();
  const { quiz, questions, answers, reset } = useQuizStore();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!quiz) router.push("/practice");
  }, [quiz, router]);

  if (!quiz || questions.length === 0) return null;

  const q = questions[idx];
  const a = answers[q.id];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/quiz/result" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
            <ArrowLeft size={16} /> Results
          </Link>
          <span className="font-semibold text-gray-700 text-sm">{idx + 1} / {questions.length}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {/* Navigator */}
        <div className="flex flex-wrap gap-2">
          {questions.map((q2, i) => {
            const a2 = answers[q2.id];
            const done = !!a2?.selected_option_id;
            const correct = a2?.is_correct;
            return (
              <button key={i} onClick={() => setIdx(i)} className={cn("w-8 h-8 rounded-lg text-xs font-bold transition-all",
                i === idx ? "ring-2 ring-primary-500 ring-offset-1" : "",
                correct ? "bg-green-100 text-green-700" :
                correct === false ? "bg-red-100 text-red-600" :
                "bg-gray-100 text-gray-500")}>
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Question */}
        <Card padding="md">
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{q.topic_name} · {q.difficulty}</span>
            {a?.is_correct ? (
              <span className="flex items-center gap-1 text-green-600 text-sm font-bold"><CheckCircle size={16} />Correct</span>
            ) : a?.is_correct === false ? (
              <span className="flex items-center gap-1 text-red-500 text-sm font-bold"><XCircle size={16} />Incorrect</span>
            ) : (
              <span className="flex items-center gap-1 text-gray-400 text-sm font-bold"><Minus size={16} />Skipped</span>
            )}
          </div>
          <h2 className="text-base font-bold text-gray-900 leading-relaxed mb-5">{q.question_text}</h2>

          {/* Options */}
          <div className="space-y-2.5">
            {q.options.map((opt) => {
              const selected = a?.selected_option_id === opt.id;
              return (
                <div
                  key={opt.id}
                  className={cn("flex items-center gap-3 p-3.5 rounded-xl border-2 transition-colors",
                    opt.is_correct ? "border-green-400 bg-green-50" :
                    selected && !opt.is_correct ? "border-red-400 bg-red-50" :
                    "border-gray-100 bg-gray-50")}
                >
                  <div className={cn("w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0",
                    opt.is_correct ? "border-green-500 bg-green-500 text-white" :
                    selected ? "border-red-500 bg-red-500 text-white" :
                    "border-gray-300 text-gray-500")}>
                    {opt.label}
                  </div>
                  <span className="text-sm text-gray-900">{opt.text}</span>
                  {opt.is_correct && <CheckCircle size={15} className="text-green-600 ml-auto flex-shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-1.5">Explanation</p>
            <p className="text-sm text-blue-700 leading-relaxed">{q.explanation}</p>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} className="flex-1 h-11 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 disabled:opacity-40 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
            <ChevronLeft size={16} /> Previous
          </button>
          {idx < questions.length - 1 ? (
            <button onClick={() => setIdx(idx + 1)} className="flex-1 h-11 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 flex items-center justify-center gap-2 transition-colors">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={() => { reset(); router.push("/dashboard"); }} className="flex-1 h-11 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 flex items-center justify-center gap-2 transition-colors">
              Done ✓
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
