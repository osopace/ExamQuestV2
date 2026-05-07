"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, BookOpen, Clock, Target } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { useQuizStore } from "@/store/quizStore";
import { COURSES, SAMPLE_QUESTIONS } from "@/constants/mockData";
import type { Difficulty, QuizMode } from "@/types";
import toast from "react-hot-toast";

const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: "easy", label: "Easy", desc: "Build confidence" },
  { id: "medium", label: "Medium", desc: "Exam standard" },
  { id: "hard", label: "Hard", desc: "Push yourself" },
  { id: "mixed", label: "Mixed", desc: "All levels" },
];

const QUESTION_COUNTS = [10, 20, 30, 40, 50];

export default function PracticePage() {
  const router = useRouter();
  const { startQuiz } = useQuizStore();
  const [courseId, setCourseId] = useState("csc101");
  const [mode, setMode] = useState<QuizMode>("quiz");
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [count, setCount] = useState(20);
  const [timed, setTimed] = useState(true);

  const handleStart = () => {
    const course = COURSES.find((c) => c.id === courseId);
    if (!course) return;

    const questions = SAMPLE_QUESTIONS.slice(0, Math.min(count, SAMPLE_QUESTIONS.length));
    if (questions.length === 0) { toast.error("No questions available"); return; }

    const quiz = {
      id: `quiz-${Date.now()}`,
      user_id: "u1",
      course_id: courseId,
      course_name: course.name,
      status: "in_progress" as const,
      mode,
      total_questions: questions.length,
      time_limit_seconds: timed && mode === "quiz" ? count * 60 : undefined,
      difficulty,
      correct_count: 0,
      incorrect_count: 0,
      skipped_count: 0,
      started_at: new Date().toISOString(),
    };

    startQuiz(quiz, questions);
    router.push(`/quiz/active`);
  };

  return (
    <div>
      <Topbar title="Practice" />
      <div className="p-6 max-w-3xl mx-auto space-y-6">

        {/* Mode */}
        <Card padding="md">
          <h2 className="font-bold text-gray-900 mb-4">Practice Mode</h2>
          <div className="grid grid-cols-2 gap-3">
            {([["quiz", "Quiz Mode", "Timed, scored — simulates real exam conditions.", "⏱️"],
               ["study", "Study Mode", "No timer, see correct answers as you go.", "📖"]] as const).map(([id, label, desc, emoji]) => (
              <button
                key={id}
                onClick={() => setMode(id as QuizMode)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${mode === id ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-primary-200"}`}
              >
                <div className="text-2xl mb-2">{emoji}</div>
                <div className="font-bold text-gray-900 text-sm mb-1">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Course */}
        <Card padding="md">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><BookOpen size={18} className="text-primary-600" />Select Course</h2>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
          >
            {COURSES.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
          </select>
        </Card>

        {/* Difficulty */}
        <Card padding="md">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Target size={18} className="text-primary-600" />Difficulty</h2>
          <div className="grid grid-cols-4 gap-2">
            {DIFFICULTIES.map(({ id, label, desc }) => (
              <button
                key={id}
                onClick={() => setDifficulty(id)}
                className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${difficulty === id ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="font-bold text-sm text-gray-900">{label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Questions count */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><BookOpen size={18} className="text-primary-600" />Questions</h2>
            <span className="text-2xl font-bold text-primary-600">{count}</span>
          </div>
          <div className="flex gap-2">
            {QUESTION_COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${count === n ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
              >
                {n}
              </button>
            ))}
          </div>
        </Card>

        {/* Timer toggle */}
        {mode === "quiz" && (
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-primary-600" />
                <div>
                  <p className="font-bold text-gray-900">Timed Quiz</p>
                  <p className="text-sm text-gray-500">1 minute per question ({count} min total)</p>
                </div>
              </div>
              <button
                onClick={() => setTimed(!timed)}
                className={`relative w-12 h-6 rounded-full transition-colors ${timed ? "bg-primary-600" : "bg-gray-200"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${timed ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </Card>
        )}

        {/* Start button */}
        <Button fullWidth size="lg" onClick={handleStart} leftIcon={<Play size={18} />}>
          Start {mode === "quiz" ? "Quiz" : "Study Session"}
        </Button>

      </div>
    </div>
  );
}
