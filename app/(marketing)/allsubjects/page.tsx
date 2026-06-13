import Link from "next/link";
import { Star, Search } from "lucide-react";
import { ALL_SUBJECTS } from "@/constants/mockData";

const EXAM_TYPES = ["All", "university", "utme", "waec", "post_utme"];

export default function CoursesPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse All Subjects
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            10,000+ questions across WAEC, UTME, NECO and POST-UTME.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 h-11 border border-gray-200 flex-1 max-w-sm">
            <Search size={16} className="text-gray-400" />
            <input
              placeholder="Search courses..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {EXAM_TYPES.map((t) => (
              <button
                key={t}
                className="px-4 h-11 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-primary-300 hover:text-primary-700 capitalize transition-colors"
              >
                {t === "All" ? t : t.replace("_", "-").toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {ALL_SUBJECTS.map((c) => (
            <Link
              key={c.id}
              href={`/signup`}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-hover hover:-translate-y-0.5 transition-all group block"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
                style={{ backgroundColor: c.color + "15" }}
              >
                {c.icon && <c.icon size={24} />}
              </div>

              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">
                {c.title}
              </h3>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{c.totalQuestions.toLocaleString()} Qs</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
