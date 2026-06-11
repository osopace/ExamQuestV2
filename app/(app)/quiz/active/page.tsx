"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Flag, ChevronLeft, ChevronRight, X, Clock, BookmarkPlus, Bookmark } from "lucide-react";
import { Modal } from "@/components/ui/index";
import { cn } from "@/utils/cn";
import { formatTime } from "@/utils/format";
import { useQuizStore } from "@/store/quizStore";
import { useAuthStore } from "@/store/authStore";
import { addBookmark, removeBookmark } from "@/supabase/db";
import toast from "react-hot-toast";

export default function QuizActivePage() {
  const router = useRouter();
  const { quiz, questions, answers, currentIndex, setAnswer, toggleFlag, goToIndex, nextQuestion, prevQuestion, reset } = useQuizStore();
  const { profile } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quitModal, setQuitModal] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    if (!quiz) { router.push("/practice"); return; }
    if (quiz.time_limit_seconds && quiz.mode === "quiz") {
      setTimeLeft(quiz.time_limit_seconds);
    }
  }, [quiz, router]);

  const handleFinish = useCallback(() => {
    router.push("/quiz/result");
  }, [router]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) { handleFinish(); return; }
    const t = setTimeout(() => setTimeLeft((p) => (p !== null ? p - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, handleFinish]);

  if (!quiz || questions.length === 0) return null;

  const current = questions[currentIndex];
  const answer = answers[current.id];
  const answered = Object.keys(answers).filter((k) => answers[k].selected_option_id !== null).length;
  const isStudyMode = quiz.mode === "study";

  const handleSelect = (optionId: string) => {
    if (isStudyMode && answer?.selected_option_id) return; // lock in study mode
    setAnswer(current.id, optionId);
    if (isStudyMode) toast.success(current.options.find((o) => o.id === optionId)?.is_correct ? "Correct! ✓" : "Wrong!", { duration: 1500 });
  };

  const handleBookmark = async () => {
    if (!profile || bookmarking) return;
    setBookmarking(true);
    const qId = current.id;
    const isBookmarked = bookmarked.has(qId);
    try {
      if (isBookmarked) {
        await removeBookmark(profile.id, qId);
        setBookmarked((prev) => { const s = new Set(prev); s.delete(qId); return s; });
        toast.success("Bookmark removed");
      } else {
        await addBookmark(profile.id, qId, current.course_id, profile.exam_type ?? "");
        setBookmarked((prev) => new Set(prev).add(qId));
        toast.success("Question bookmarked");
      }
    } catch {
      toast.error("Failed to save bookmark");
    } finally {
      setBookmarking(false);
    }
  };

  const timerColor = timeLeft !== null && timeLeft < 60 ? "text-red-500" : "text-gray-700";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => setQuitModal(true)} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500">
            <X size={18} />
          </button>
          <div className="flex-1">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
            <span>{currentIndex + 1} / {questions.length}</span>
            {timeLeft !== null && (
              <span className={cn("flex items-center gap-1 font-mono font-bold", timerColor)}>
                <Clock size={14} />{formatTime(timeLeft)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Question */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide capitalize">{current.difficulty} · {current.topic_name}</span>
            {current.exam_source && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{current.exam_source}</span>}
          </div>
          <h2 className="text-lg font-bold text-gray-900 leading-relaxed">{current.question_text}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {current.options.map((opt) => {
            const selected = answer?.selected_option_id === opt.id;
            const locked = isStudyMode && !!answer?.selected_option_id;
            const showCorrect = isStudyMode && locked;

            let style = "border-gray-200 bg-white hover:border-primary-200";
            if (selected && !showCorrect) style = "border-primary-500 bg-primary-50";
            if (showCorrect && opt.is_correct) style = "border-green-500 bg-green-50";
            if (showCorrect && selected && !opt.is_correct) style = "border-red-400 bg-red-50";

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={locked && !isStudyMode}
                className={cn("w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all", style)}
              >
                <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0",
                  selected ? "border-primary-500 bg-primary-600 text-white" : "border-gray-300 text-gray-500",
                  showCorrect && opt.is_correct ? "border-green-500 bg-green-500 text-white" : "",
                  showCorrect && selected && !opt.is_correct ? "border-red-500 bg-red-500 text-white" : "",
                )}>
                  {opt.label}
                </div>
                <span className="text-sm text-gray-900 font-medium">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Study mode explanation */}
        {isStudyMode && answer?.selected_option_id && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-bold text-blue-800 mb-1">Explanation</p>
            <p className="text-sm text-blue-700 leading-relaxed">{current.explanation}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <button
              onClick={() => toggleFlag(current.id)}
              className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors",
                answer?.is_flagged ? "border-amber-400 bg-amber-50 text-amber-700" : "border-gray-200 text-gray-600 hover:bg-gray-50")}
            >
              <Flag size={15} /> {answer?.is_flagged ? "Flagged" : "Flag"}
            </button>
            <button
              onClick={handleBookmark}
              disabled={bookmarking}
              className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors",
                bookmarked.has(current.id)
                  ? "border-primary-400 bg-primary-50 text-primary-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {bookmarked.has(current.id)
                ? <Bookmark size={15} fill="currentColor" />
                : <BookmarkPlus size={15} />
              }
              {bookmarked.has(current.id) ? "Saved" : "Bookmark"}
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={prevQuestion} disabled={currentIndex === 0} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 transition-colors">
              <ChevronLeft size={18} />
            </button>
            {currentIndex < questions.length - 1 ? (
              <button onClick={nextQuestion} className="flex items-center gap-2 px-5 h-10 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleFinish} className="flex items-center gap-2 px-5 h-10 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
                Finish
              </button>
            )}
          </div>
        </div>

        {/* Question navigator */}
        <div className="border-t border-gray-100 pt-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{answered} of {questions.length} answered</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => {
              const a = answers[q.id];
              const isCurrent = i === currentIndex;
              const isDone = !!a?.selected_option_id;
              const isFlagged = !!a?.is_flagged;
              return (
                <button
                  key={i}
                  onClick={() => goToIndex(i)}
                  className={cn("w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    isCurrent ? "bg-primary-600 text-white" :
                    isDone ? "bg-primary-100 text-primary-700" :
                    isFlagged ? "bg-amber-100 text-amber-700" :
                    "bg-gray-100 text-gray-500 hover:bg-gray-200")}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quit modal */}
      <Modal open={quitModal} onClose={() => setQuitModal(false)} title="Quit Quiz?">
        <p className="text-gray-600 mb-6">Your progress will be lost. Are you sure you want to quit?</p>
        <div className="flex gap-3">
          <button onClick={() => setQuitModal(false)} className="flex-1 h-11 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors">Keep Going</button>
          <button onClick={() => { reset(); router.push("/practice"); }} className="flex-1 h-11 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors">Quit</button>
        </div>
      </Modal>

    </div>
  );
}
