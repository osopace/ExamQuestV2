import Link from "next/link";
import { ArrowRight, UserPlus, BookMarked, Play, BarChart3 } from "lucide-react";
import Button from "@/components/ui/Button";

const STEPS = [
  { step: "01", icon: UserPlus, title: "Create Your Free Account", desc: "Sign up with your email in under 60 seconds. No credit card required. Choose your exam type: WAEC, JAMB, Post-UTME or University." },
  { step: "02", icon: BookMarked, title: "Select Your Courses", desc: "Pick the subjects you need to study. We'll set up your personalised dashboard with your question bank and study plan." },
  { step: "03", icon: Play, title: "Start Practicing", desc: "Take timed quizzes or use study mode. Every answer is followed by a detailed explanation. Flag questions to review later." },
  { step: "04", icon: BarChart3, title: "Track Your Progress", desc: "Watch your scores improve in real-time. Our analytics show you exactly which topics to focus on to maximise your exam score." },
];

export default function HowItWorksPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How ExamQuest Works</h1>
          <p className="text-lg text-gray-600">From sign-up to exam-ready in 4 simple steps.</p>
        </div>

        <div className="relative space-y-10">
          <div className="absolute left-9 top-12 bottom-12 w-0.5 bg-gray-100 hidden sm:block" />
          {STEPS.map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="flex gap-6">
              <div className="w-18 flex-shrink-0 flex flex-col items-center">
                <div className="w-14 h-14 bg-white border-2 border-primary-200 rounded-2xl flex items-center justify-center z-10">
                  <Icon size={24} className="text-primary-600" />
                </div>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
                <div className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">Step {step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link href="/signup"><Button size="lg" rightIcon={<ArrowRight size={18} />}>Get Started Free Today</Button></Link>
        </div>
      </div>
    </div>
  );
}
