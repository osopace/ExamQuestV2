"use client";
import Link from "next/link";
import { Play, Clock, Star, BookOpen, ArrowRight } from "lucide-react";
import { Card, Badge } from "@/components/ui/index";
import { ProgressBar } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { COURSES, COURSE_PROGRESS } from "@/constants/mockData";
import { formatRelativeDate } from "@/utils/format";
import { getTerm } from "@/utils/terminology";
import { useAuthStore } from "@/store/authStore";

export default function CoursesPage() {
  const { profile } = useAuthStore();
  const term = getTerm(profile?.exam_type);             // "Courses" or "Subjects"
  const termSingular = getTerm(profile?.exam_type, false); // "Course" or "Subject"

  const progressMap = Object.fromEntries(
    COURSE_PROGRESS.map((p) => [p.course_id, p]),
  );
  const enrolled = COURSES.filter((c) =>
    COURSE_PROGRESS.some((p) => p.course_id === c.id),
  );
  const browse = COURSES.filter(
    (c) => !COURSE_PROGRESS.some((p) => p.course_id === c.id),
  );

  return (
    <div>
      <Topbar title={`My ${term}`} />
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Enrolled */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Enrolled {term}
            </h2>
            <span className="text-sm text-gray-500">
              {enrolled.length} {term.toLowerCase()}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {enrolled.map((course) => {
              const progress = progressMap[course.id];
              return (
                <Card
                  key={course.id}
                  padding="none"
                  className="overflow-hidden"
                >
                  <div
                    className="h-2"
                    style={{ backgroundColor: course.color }}
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: course.color + "15" }}
                      >
                        📚
                      </div>
                      <Badge
                        variant={
                          progress?.progress_percent >= 70
                            ? "success"
                            : "primary"
                        }
                      >
                        {progress?.progress_percent >= 100
                          ? "Completed"
                          : "Active"}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {course.code}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {course.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <ProgressBar
                      value={progress?.progress_percent ?? 0}
                      size="sm"
                      className="mb-3"
                      showLabel
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{progress?.total_quizzes ?? 0} quizzes taken</span>
                      {progress?.last_practiced_at && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {formatRelativeDate(progress.last_practiced_at)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/practice?course=${course.id}`}
                        className="flex-1"
                      >
                        <button className="w-full flex items-center justify-center gap-2 h-9 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors">
                          <Play size={13} /> Practice
                        </button>
                      </Link>
                      <Link href={`/course/${course.id}`}>
                        <button className="h-9 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                          <ArrowRight size={15} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Browse more */}
        {browse.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Browse More {term}
            </h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {browse.map((c) => (
                <Card
                  key={c.id}
                  hoverable
                  padding="md"
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: c.color + "20" }}
                  >
                    📚
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                      {c.code}
                    </p>
                    <p className="font-semibold text-gray-900 truncate">
                      {c.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star
                          size={10}
                          className="text-amber-400 fill-amber-400"
                        />
                        {c.rating}
                      </span>
                      <span>{c.total_questions} questions</span>
                    </div>
                  </div>
                  <button className="flex-shrink-0 w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center hover:bg-primary-100 transition-colors">
                    <BookOpen size={14} className="text-primary-600" />
                  </button>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
