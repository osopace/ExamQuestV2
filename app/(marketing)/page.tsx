import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BarChart3,
  TrendingUp,
  Monitor,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Testimonial from "@/components/shared/landingUi/testimonial";
import HowItWorks from "@/components/shared/landingUi/howItworks";
import QuizPreview from "@/components/shared/landingUi/quizpreview";
import HeroSection from "@/components/shared/landingUi/heroSection";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Course-Based Practice",
    desc: "Practice questions tailored to your specific courses and curriculum.",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: Monitor,
    title: "Real Exam Experience",
    desc: "Timed quizzes and mock tests that simulate actual exam conditions.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    desc: "Get in-depth performance insights to identify strengths and weaknesses.",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    desc: "Monitor your improvement over time with beautiful progress charts.",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── University trust bar ── */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400 mb-6">
            Trusted by students from top universities worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14">
            <div className="flex flex-col items-center leading-tight">
              <span className="text-lg font-black text-red-700 tracking-tight">MIT</span>
              <span className="text-[8px] text-gray-400 tracking-widest uppercase">
                Massachusetts Institute
                <br />
                of Technology
              </span>
            </div>
            <div className="flex flex-col items-center leading-tight">
              <span className="text-lg font-black text-red-600 tracking-tight">Stanford</span>
              <span className="text-[8px] text-gray-400 tracking-widest uppercase">University</span>
            </div>
            <div>
              <span className="text-lg font-black text-blue-900 tracking-widest uppercase">Oxford</span>
            </div>
            <div className="flex flex-col items-center leading-tight">
              <span className="text-lg font-black text-red-800 tracking-tight">HARVARD</span>
              <span className="text-[8px] text-gray-400 tracking-widest uppercase">University</span>
            </div>
            <div>
              <span className="text-lg font-black text-blue-700 tracking-tight">Berkeley</span>
            </div>
            <span className="text-sm text-gray-400 font-medium">And 500+ more universities</span>
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Everything You Need to <span className="text-primary-600">Excel</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Powerful tools and features designed to supercharge your exam preparation
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, iconBg, iconColor }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all"
              >
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={22} className={iconColor} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <HowItWorks />

      {/* ── Quiz preview ── */}
      <QuizPreview />

      {/* ── Testimonials ── */}
      <Testimonial />

      {/* ── CTA banner ── */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Ready to Achieve Your Best?
              </h2>
              <p className="text-primary-200">
                Join thousands of students who are already succeeding with ExamQuest.
              </p>
            </div>
            <Link href="/signup" className="flex-shrink-0">
              <Button variant="secondary" size="lg" rightIcon={<ArrowRight size={18} />}>
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
