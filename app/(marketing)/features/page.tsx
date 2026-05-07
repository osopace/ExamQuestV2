import Link from "next/link";
import { ArrowRight, BookOpen, BarChart3, Zap, Trophy, Clock, TrendingUp, Shield, Smartphone } from "lucide-react";
import Button from "@/components/ui/Button";

const FEATURES = [
  { icon: BookOpen, title: "Massive Question Bank", desc: "10,000+ past questions from WAEC, NECO, JAMB and Post-UTME spanning 20 years of exam history. Every question is verified by educators.", tag: "Questions" },
  { icon: Zap, title: "Instant Explanations", desc: "Every single question has a detailed explanation written by subject matter experts. Understand the concept, not just the answer.", tag: "Learning" },
  { icon: BarChart3, title: "Deep Analytics", desc: "See your performance by topic, difficulty level and time. Identify weak spots and focus where it matters. Weekly and monthly reports included.", tag: "Analytics" },
  { icon: Trophy, title: "Gamification", desc: "Earn XP points, maintain daily streaks and compete on the national leaderboard. Learning is more fun when there's a game involved.", tag: "Motivation" },
  { icon: Clock, title: "Real Exam Simulation", desc: "Timed quizzes that mirror the exact format of your target exam. Build the speed, confidence and mental stamina you need on exam day.", tag: "Practice" },
  { icon: TrendingUp, title: "Progress Tracking", desc: "Visual progress charts, score history and improvement metrics. See how far you've come and how far you have to go.", tag: "Progress" },
  { icon: Shield, title: "Trusted by Educators", desc: "Our question bank is reviewed and approved by experienced teachers and lecturers from top Nigerian universities.", tag: "Quality" },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Study on any device — phone, tablet or desktop. Your progress syncs automatically so you can pick up exactly where you left off.", tag: "Accessibility" },
];

export default function FeaturesPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5">Features Built for Nigerian Students</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to prepare for your exams — in one beautifully designed platform.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {FEATURES.map(({ icon: Icon, title, desc, tag }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-hover transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <Icon size={20} className="text-primary-600" />
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{tag}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary-600 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Start Using All Features for Free</h2>
          <p className="text-primary-200 mb-8">No credit card required. Free plan available forever.</p>
          <Link href="/signup"><Button size="lg" variant="secondary" rightIcon={<ArrowRight size={18} />}>Get Started Free</Button></Link>
        </div>
      </div>
    </div>
  );
}
