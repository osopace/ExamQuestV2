import React from "react";
import { Star, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
const AVATAR_COLORS = [
  "bg-blue-400",
  "bg-green-400",
  "bg-violet-400",
  "bg-orange-400",
];
const AVATAR_LETTERS = ["A", "B", "C", "D"];

const DASH_STATS = [
  { label: "Courses", val: "12", color: "text-blue-600" },
  { label: "Quizzes", val: "156", color: "text-violet-600" },
  { label: "Accuracy", val: "78%", color: "text-green-600" },
  { label: "Streak", val: "7 Days", color: "text-orange-600" },
];
const DASH_QUIZZES = [
  {
    name: "Data Structures",
    sub: "20 Questions · Computer Science",
    score: "85%",
    scoreColor: "text-green-600",
  },
  {
    name: "Database Systems",
    sub: "25 Questions · Computer Science",
    score: "72%",
    scoreColor: "text-blue-600",
  },
  {
    name: "Operating Systems",
    sub: "15 Questions · Computer Science",
    score: "90%",
    scoreColor: "text-green-600",
  },
];

const SIDEBAR_ITEMS = [
  "Dashboard",
  "My Courses",
  "Quizzes",
  "Mock Tests",
  "Results",
  "Analytics",
  "Bookmarks",
  "Settings",
];

const heroSection = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 via-white to-primary-100 py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Star size={12} className="fill-primary-600 text-primary-600" />
              Your Success, Our Mission
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              Prepare Smarter.
              <br />
              Score Higher.
              <br />
              <span className="text-primary-600">Achieve More.</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-md">
              ExamQuest is your all-in-one platform to practice, learn and
              master your university exams with thousands of questions and
              real-time performance analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/signup">
                <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                  Start Practicing Now
                </Button>
              </Link>
              <Link href="/allcourses">
                <Button size="lg" variant="outline">
                  Explore Courses
                </Button>
              </Link>
            </div>
            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {AVATAR_COLORS.map((c, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {AVATAR_LETTERS[i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Join{" "}
                <span className="font-semibold text-gray-900">50,000+</span>{" "}
                students already improving their scores
              </p>
            </div>
          </div>

          {/* Right – dashboard mockup */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-modal border border-gray-200 overflow-hidden">
              {/* Window chrome */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex">
                {/* Mini sidebar */}
                <div className="w-32 bg-gray-900 flex flex-col p-3 gap-0.5">
                  <div className="flex items-center gap-2 px-2 py-2 mb-2">
                    <GraduationCap size={14} className="text-primary-400" />
                    <span className="text-white text-xs font-bold">
                      ExamQuest
                    </span>
                  </div>
                  {SIDEBAR_ITEMS.map((item, i) => (
                    <div
                      key={item}
                      className={`text-[10px] px-2 py-1.5 rounded-lg ${i === 0 ? "bg-primary-600 text-white font-medium" : "text-gray-400"}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                {/* Dashboard content */}
                <div className="flex-1 p-4">
                  <p className="text-xs font-semibold text-gray-800 mb-0.5">
                    Hello, Alex 👋
                  </p>
                  <p className="text-[10px] text-gray-400 mb-2">
                    Ready to conquer your exams today?
                  </p>
                  {/* Search */}
                  <div className="bg-gray-100 rounded-lg px-3 py-1.5 text-[10px] text-gray-400 mb-3">
                    Search for courses or quizzes...
                  </div>
                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-1 mb-3">
                    {DASH_STATS.map(({ label, val, color }) => (
                      <div
                        key={label}
                        className="bg-gray-50 border border-gray-100 rounded-lg p-1.5 text-center"
                      >
                        <p className={`text-xs font-bold ${color}`}>{val}</p>
                        <p className="text-[8px] text-gray-500">{label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Recent quizzes */}
                  <p className="text-[9px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                    Recent Quizzes
                  </p>
                  <div className="space-y-1">
                    {DASH_QUIZZES.map(({ name, sub, score, scoreColor }) => (
                      <div
                        key={name}
                        className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5"
                      >
                        <div>
                          <p className="text-[10px] font-semibold text-gray-800">
                            {name}
                          </p>
                          <p className="text-[8px] text-gray-400">{sub}</p>
                        </div>
                        <span className={`text-[10px] font-bold ${scoreColor}`}>
                          {score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default heroSection;
