import { Heart, Target, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-5">About ExamQuest</h1>
          <p className="text-xl text-gray-600 leading-relaxed">We're on a mission to make quality exam preparation accessible to every Nigerian student.</p>
        </div>

        <div className="prose prose-lg max-w-none mb-14 text-gray-600 space-y-5">
          <p>ExamQuest was founded in Lagos, Nigeria in 2023 by a team of educators and engineers who were frustrated by the lack of quality, affordable exam preparation resources for Nigerian students.</p>
          <p>We saw students paying huge amounts for offline lesson notes and past question compilations that were often incomplete, outdated or just wrong. We believed students deserved better — a platform that combined every past question, provided clear explanations, tracked progress and was accessible on any device.</p>
          <p>Today, ExamQuest serves over 500,000 students across Nigeria preparing for WAEC, NECO, JAMB, Post-UTME and university exams. Our question bank is the largest and most up-to-date in Nigeria, with every answer explained by subject-matter experts.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {[
            { icon: Target, title: "Our Mission", desc: "To give every Nigerian student an equal opportunity to succeed in exams, regardless of their background or location." },
            { icon: Heart, title: "Our Values", desc: "Accuracy, accessibility and student success. We never cut corners on question quality or explanation depth." },
            { icon: Users, title: "Our Team", desc: "A passionate team of educators, engineers and designers who are all former Nigerian students ourselves." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card text-center">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
