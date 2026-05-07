import { create } from "zustand";
import type { Question, QuizAnswer, Quiz } from "@/types";

interface QuizState {
  quiz: Quiz | null;
  questions: Question[];
  answers: Record<string, QuizAnswer>;
  currentIndex: number;
  startedAt: number | null;
  startQuiz: (quiz: Quiz, questions: Question[]) => void;
  setAnswer: (questionId: string, optionId: string | null) => void;
  toggleFlag: (questionId: string) => void;
  goToIndex: (i: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  quiz: null,
  questions: [],
  answers: {},
  currentIndex: 0,
  startedAt: null,

  startQuiz: (quiz, questions) =>
    set({ quiz, questions, answers: {}, currentIndex: 0, startedAt: Date.now() }),

  setAnswer: (questionId, optionId) =>
    set((state) => {
      const question = state.questions.find((q) => q.id === questionId);
      if (!question) return state;
      const isCorrect = optionId !== null
        ? question.options.find((o) => o.id === optionId)?.is_correct ?? false
        : null;
      return {
        answers: {
          ...state.answers,
          [questionId]: {
            question_id: questionId,
            selected_option_id: optionId,
            is_correct: isCorrect,
            is_flagged: state.answers[questionId]?.is_flagged ?? false,
            question_order: state.questions.findIndex((q) => q.id === questionId) + 1,
          },
        },
      };
    }),

  toggleFlag: (questionId) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: {
          question_id: questionId,
          selected_option_id: state.answers[questionId]?.selected_option_id ?? null,
          is_correct: state.answers[questionId]?.is_correct ?? null,
          is_flagged: !(state.answers[questionId]?.is_flagged ?? false),
          question_order: state.questions.findIndex((q) => q.id === questionId) + 1,
        },
      },
    })),

  goToIndex: (i) => set({ currentIndex: i }),
  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) set({ currentIndex: currentIndex + 1 });
  },
  prevQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) set({ currentIndex: currentIndex - 1 });
  },
  reset: () => set({ quiz: null, questions: [], answers: {}, currentIndex: 0, startedAt: null }),
}));
