import React from "react";
import { BookOpen, BarChart3, Edit2 } from "lucide-react";
const STEPS = [
  {
    num: "1",
    icon: BookOpen,
    title: "Choose Your Course",
    desc: "Select from your enrolled courses and access relevant quizzes.",
  },
  {
    num: "2",
    icon: Edit2,
    title: "Take Quizzes",
    desc: "Answer questions, track time, and test your knowledge.",
  },
  {
    num: "3",
    icon: BarChart3,
    title: "Get Results & Improve",
    desc: "Review performance, analyze mistakes, and improve continuously.",
  },
];

const howItworks = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          How <span className="text-primary-600">ExamQuest</span> Works
        </h2>
        <p className="text-gray-500 mb-14">
          Simple steps to boost your exam performance
        </p>
        <div className="grid sm:grid-cols-3 gap-10 relative">
          {/* Dashed connector line */}
          <div className="hidden sm:block absolute top-3.5 left-[calc(50%/3+2rem)] right-[calc(50%/3+2rem)] h-0 border-t-2 border-dashed border-gray-300" />
          {STEPS.map(({ num, icon: Icon, title, desc }) => (
            <div key={num} className="flex flex-col items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mb-4 relative z-10">
                {num}
              </div>
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <Icon size={26} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default howItworks;
