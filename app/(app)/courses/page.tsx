"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Play, ArrowRight, Loader2, Plus, GraduationCap } from "lucide-react";
import { Card, Badge } from "@/components/ui/index";
import { ProgressBar } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { updateProfile, getUserQuizzes } from "@/supabase/db";
import { SUBJECTS } from "@/constants/mockData";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";
import toast from "react-hot-toast";
import type { ExamType } from "@/types";

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
];

const EXAM_LABELS: Record<string, string> = {
  wassce: "WAEC WASSCE",
  neco: "NECO",
  utme: "JAMB UTME",
  "post-utme": "Post-UTME",
};

type DisplayCourse = { id: string; name: string; code: string; color: string };

const toDisplayCourse = (
  id: string,
  i: number,
  code: string,
): DisplayCourse => ({
  id,
  name: id.charAt(0).toUpperCase() + id.slice(1),
  code,
  color: COLORS[i % COLORS.length],
});

export default function CoursesPage() {
  const { profile, updateProfile: updateStore } = useAuthStore();

  const [browseCourses, setBrowseCourses] = useState<DisplayCourse[]>([]);
  const [quizCounts, setQuizCounts] = useState<Record<string, number>>({});
  const [fetching, setFetching] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  const term = "subjects";
  const enrolledIds = profile?.enrolled_course_ids ?? [];

  const examTypes: ExamType[] = useMemo(
    () =>
      profile?.exam_types?.length
        ? (profile.exam_types as ExamType[])
        : profile?.exam_type
          ? [profile.exam_type]
          : [],
    [profile?.exam_types, profile?.exam_type],
  );
  const primaryType = examTypes[0];

  const enrolledLabel = examTypes
    .map((et) => EXAM_LABELS[et] ?? et.toUpperCase())
    .join(" · ");

  const enrolledCourses: DisplayCourse[] = enrolledIds.map((id, i) =>
    toDisplayCourse(id, i, enrolledLabel),
  );

  const unenrolled: DisplayCourse[] = useMemo(() => {
    if (!primaryType) return [];
    const code = EXAM_LABELS[primaryType] ?? primaryType.toUpperCase();
    return SUBJECTS.filter((subject) => !enrolledIds.includes(subject)).map(
      (id, i) => toDisplayCourse(id, i, code),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryType, enrolledIds]);

  useEffect(() => {
    if (!profile?.id || !primaryType) return;

    setFetching(true);
    setBrowseCourses(unenrolled);
    setFetching(false);

    getUserQuizzes(profile.id, 500)
      .then((quizzes) => {
        const counts: Record<string, number> = {};
        quizzes.forEach((q) => {
          counts[q.course_id] = (counts[q.course_id] ?? 0) + 1;
        });
        setQuizCounts(counts);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, primaryType, enrolledIds]);

  const handleEnrol = async (courseId: string, courseName: string) => {
    if (!profile) return;
    setEnrolling(courseId);
    try {
      const updated = [...enrolledIds, courseId];
      await updateProfile(profile.id, { enrolled_course_ids: updated });
      updateStore({ enrolled_course_ids: updated });
      setBrowseCourses((prev) => prev.filter((c) => c.id !== courseId));
      toast.success(`${courseName} added to your ${term}`);
    } catch {
      toast.error("Failed to enrol. Please try again.");
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div>
      <Topbar title={`My ${term}`} />
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Enrolled {term}</h2>
            <span className="text-sm text-gray-500">
              {enrolledCourses.length} {term}
            </span>
          </div>

          {enrolledCourses.length === 0 ? (
            <p className="text-sm text-gray-400 py-6">
              No {term} enrolled yet. Browse below to get started.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {enrolledCourses.map((course) => (
                <EnrolledCard
                  key={course.id}
                  course={course}
                  progress={Math.min(100, (quizCounts[course.id] ?? 0) * 10)}
                  quizCount={quizCounts[course.id] ?? 0}
                />
              ))}
            </div>
          )}
        </section>

        <BrowseSection
          title={`Browse More ${term}`}
          subtitle={EXAM_LABELS[primaryType ?? ""] ?? ""}
          courses={browseCourses}
          fetching={fetching}
          enrolling={enrolling}
          term={term}
          onEnrol={handleEnrol}
        />
      </div>
    </div>
  );
}

function EnrolledCard({
  course,
  progress,
  quizCount,
}: {
  course: DisplayCourse;
  progress: number;
  quizCount: number;
}) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="h-2" style={{ backgroundColor: course.color }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: course.color + "20" }}
          >
            <GraduationCap size={20} style={{ color: course.color }} />
          </div>
          <Badge variant="primary">Active</Badge>
        </div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {course.code}
        </p>
        <h3 className="font-bold text-gray-900 mb-4">{course.name}</h3>
        <ProgressBar value={progress} size="sm" className="mb-3" showLabel />
        <div className="text-xs text-gray-500 mb-4">
          {quizCount} quizzes taken
        </div>
        <div className="flex gap-2">
          <Link
            href={`/practice?course=${encodeURIComponent(course.id)}`}
            className="flex-1"
          >
            <button className="w-full flex items-center justify-center gap-2 h-9 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors">
              <Play size={13} /> Practice
            </button>
          </Link>
          <Link href={`/course/${encodeURIComponent(course.id)}`}>
            <button className="h-9 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
              <ArrowRight size={15} />
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

function BrowseSection({
  title,
  subtitle,
  courses,
  fetching,
  enrolling,
  term,
  onEnrol,
}: {
  title: string;
  subtitle: string;
  courses: DisplayCourse[];
  fetching: boolean;
  enrolling: string | null;
  term: string;
  onEnrol: (id: string, name: string) => void;
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      {fetching ? (
        <div className="flex items-center gap-2 text-gray-400 py-6">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading available {term}...</span>
        </div>
      ) : courses.length === 0 ? (
        <p className="text-sm text-gray-400 py-6">
          You are enrolled in all available {term} for this exam type.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((c) => (
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
                <GraduationCap size={20} style={{ color: c.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  {c.code}
                </p>
                <p className="font-semibold text-gray-900 truncate">{c.name}</p>
              </div>
              <button
                onClick={() => onEnrol(c.id, c.name)}
                disabled={enrolling === c.id}
                className={cn(
                  "flex-shrink-0 w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center hover:bg-primary-100 transition-colors disabled:opacity-50",
                )}
              >
                {enrolling === c.id ? (
                  <Loader2
                    size={14}
                    className="animate-spin text-primary-600"
                  />
                ) : (
                  <Plus size={14} className="text-primary-600" />
                )}
              </button>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
