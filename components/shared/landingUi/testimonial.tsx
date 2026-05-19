import React from "react";
import { Star } from "lucide-react";
const TESTIMONIALS = [
  {
    quote:
      "ExamQuest helped me improve my scores significantly. The questions are high-quality and very relevant!",
    name: "Sarah Johnson",
    role: "Computer Science Student",
    initials: "SJ",
    avatarBg: "bg-blue-100 text-blue-700",
  },
  {
    quote:
      "The analytics feature is amazing! It shows exactly what I need to focus on.",
    name: "Michael Chen",
    role: "Engineering Student",
    initials: "MC",
    avatarBg: "bg-green-100 text-green-700",
  },
  {
    quote:
      "Best platform for exam preparation. User-friendly and super effective!",
    name: "Priya Sharma",
    role: "Business Student",
    initials: "PS",
    avatarBg: "bg-purple-100 text-purple-700",
  },
];

const testimonial = () => {
  return (
    <div>
      {" "}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Loved by <span className="text-primary-600">Students</span>{" "}
              Worldwide
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, name, role, initials, avatarBg }) => (
              <div
                key={name}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center text-xs font-bold`}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {name}
                    </p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default testimonial;
