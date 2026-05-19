import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, GraduationCap } from "lucide-react";
import Button from "@/components/ui/Button";
const QUIZ_OPTIONS: { label: string; text: string; selected?: boolean }[] = [
  { label: "A", text: "O(1)" },
  { label: "B", text: "O(log n)", selected: true },
  { label: "C", text: "O(n)" },
  { label: "D", text: "O(n log n)" },
];
const quizpreview = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              A Better Way
              <br />
              to <span className="text-primary-600">Prepare</span>
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed max-w-sm">
              ExamQuest provides an intuitive and engaging platform to help you
              stay consistent and confident.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "User-friendly dashboard",
                "Thousands of quality questions",
                "Instant results and explanations",
                "Accessible anytime, anywhere",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <CheckCircle
                    size={18}
                    className="text-primary-600 flex-shrink-0"
                  />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                Start Your Journey Today
              </Button>
            </Link>
          </div>

          {/* Right – quiz mockup */}
          <div className="bg-white rounded-2xl shadow-modal border border-gray-200 overflow-hidden">
            {/* Quiz header bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <GraduationCap size={15} className="text-primary-600" />
                <span className="text-sm font-semibold text-gray-800">
                  Data Structures Quiz
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={11} />
                  <span>04:35</span>
                </div>
                <span className="text-xs text-gray-400">Dots</span>
                <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg">
                  End Quiz
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">Question 7 of 20</span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={11} />
                  <span>14:35</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-4">
                What is the time complexity of binary search?
              </p>

              {/* Options */}
              <div className="space-y-2 mb-4">
                {QUIZ_OPTIONS.map(({ label, text, selected }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-all ${
                      selected
                        ? "bg-green-50 border-green-400 text-green-800"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        selected
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                    {text}
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  Explanation
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Binary search divides the search interval in half at each
                  step, so its time complexity is O(log n).
                </p>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Progress</p>
                  <p className="text-xs font-medium text-gray-700">
                    7 / 20 answered
                  </p>
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1">
                    <div
                      className="h-1.5 bg-primary-500 rounded-full"
                      style={{ width: "35%" }}
                    />
                  </div>
                </div>
                <Button size="sm" rightIcon={<ArrowRight size={14} />}>
                  Next Question
                </Button>
              </div>

              {/* Question navigator */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Question Navigator
                </p>
                <div className="grid grid-cols-10 gap-1">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                    <div
                      key={n}
                      className={`aspect-square rounded flex items-center justify-center text-[9px] font-semibold ${
                        n === 7
                          ? "bg-primary-600 text-white"
                          : n < 7
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default quizpreview;
