import Link from "next/link";
import { ArrowRight, CheckCircle, Star, BookOpen, BarChart3, Zap, Trophy, Clock, Users, TrendingUp } from "lucide-react";
import Button from "@/components/ui/Button";
import { TESTIMONIALS, FAQ, COURSES } from "@/constants/mockData";

const FEATURES = [
  { icon: BookOpen, title: "10,000+ Past Questions", desc: "Complete question banks from WAEC, NECO, JAMB and Post-UTME going back 20 years." },
  { icon: BarChart3, title: "Smart Analytics", desc: "Track your performance by topic, see your weak spots and focus your study time where it matters most." },
  { icon: Zap, title: "Instant Explanations", desc: "Every question comes with a detailed explanation so you understand the concept, not just the answer." },
  { icon: Trophy, title: "Leaderboard & Streaks", desc: "Stay motivated with daily streaks, XP points and compete with students across Nigeria." },
  { icon: Clock, title: "Timed Practice", desc: "Simulate real exam conditions with timed quizzes and build the speed and confidence you need." },
  { icon: TrendingUp, title: "Progress Tracking", desc: "Watch your scores improve week-over-week with beautiful charts and actionable insights." },
];

const STATS = [
  { value: "500K+", label: "Students" },
  { value: "10,000+", label: "Questions" },
  { value: "50+", label: "Universities" },
  { value: "4.9★", label: "App Rating" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Star size={14} className="fill-primary-600" />
            Nigeria's #1 Exam Prep Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Ace Your Exams with
            <span className="text-primary-600"> Smart Practice</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice with 10,000+ past questions from WAEC, JAMB UTME, Post-UTME and university courses. Get instant explanations, track your progress and outperform your peers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>Start Practicing Free</Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline">See How it Works</Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500">
            {["No credit card required", "Free forever plan", "500K+ students"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-green-500" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {STATS.map(({ value, label }) => (
            <div key={label}><div className="text-3xl font-bold mb-1">{value}</div><div className="text-primary-200 text-sm">{label}</div></div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Excel</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">Powerful tools designed specifically for Nigerian students preparing for high-stakes exams.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-hover transition-all group">
                <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <Icon size={22} className="text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Courses</h2>
              <p className="text-gray-600">Start practicing with our most popular question banks.</p>
            </div>
            <Link href="/courses" className="text-primary-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight size={16} /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COURSES.slice(0, 6).map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-hover transition-all group">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: c.color + "20" }}>
                    <span className="text-lg">📚</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{c.code}</p>
                    <h3 className="font-semibold text-gray-900 truncate">{c.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{c.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" />{c.rating}</span>
                  <span>{c.total_questions.toLocaleString()} questions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Get Started in 3 Steps</h2>
          <p className="text-gray-600 mb-14">Be up and running in less than 2 minutes.</p>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              { step: "1", title: "Create Your Account", desc: "Sign up for free and tell us which exam you're preparing for." },
              { step: "2", title: "Choose Your Courses", desc: "Select the subjects you need to practice from our full catalogue." },
              { step: "3", title: "Start Practicing", desc: "Take quizzes, review explanations and watch your scores improve." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center">
                <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-4">{step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Students Love ExamQuest</h2>
            <p className="text-gray-600">Join 500,000+ students already acing their exams.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">{t.avatar}</div>
                  <div><p className="text-sm font-semibold text-gray-900">{t.name}</p><p className="text-xs text-gray-500">{t.school}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <div key={item.q} className="border border-gray-100 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Acing Your Exams?</h2>
          <p className="text-primary-200 text-lg mb-8">Join 500,000+ Nigerian students who trust ExamQuest.</p>
          <Link href="/signup"><Button size="lg" variant="secondary" rightIcon={<ArrowRight size={18} />}>Get Started — It's Free</Button></Link>
          <p className="mt-4 text-primary-300 text-sm">No credit card required · Free plan available</p>
        </div>
      </section>
    </div>
  );
}
