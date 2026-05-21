"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, ArrowRight, Loader2, Plus } from "lucide-react";
import { Card, Badge } from "@/components/ui/index";
import { ProgressBar } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { getExamSubjects, getSchoolCourses, updateProfile, getUserQuizzes } from "@/supabase/db";
import { getTerm } from "@/utils/terminology";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const COLORS = [
  "#6366F1", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#06B6D4", "#EC4899", "#84CC16",
];

type DisplayCourse = {
  id: string;
  name: string;
  code: string;
  color: string;
};

export default function CoursesPage() {
  const { profile, updateProfile: updateStore } = useAuthStore();
  const [browseCourses, setBrowseCourses] = useState<DisplayCourse[]>([]);
  const [quizCounts, setQuizCounts] = useState<Record<string, number>>({});
  const [fetching, setFetching] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  const term = getTerm(profile?.exam_type);
  const enrolledIds = profile?.enrolled_course_ids ?? [];
  const examLabel = (profile?.exam_type ?? "").toUpperCase().replace("-", " ");

  // Enrolled section: derived directly from profile — no DB call needed
  const enrolledCourses: DisplayCourse[] = enrolledIds.map((id, i) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    code: examLabel,
    color: COLORS[i % COLORS.length],
  }));

  useEffect(() => {
    if (!profile?.exam_type || !profile?.id) return;

    const load = async () => {
      setFetching(true);
      try {
        // Fetch all subjects for this exam type from DB
        let allSubjects: DisplayCourse[] = [];

        if (profile.exam_type === "university" && profile.school_id) {
          const rows = await getSchoolCourses(profile.school_id);
          allSubjects = rows.map((c, i) => ({
            id: c.course_id,
            name: c.name,
            code: c.department ?? "UNIVERSITY",
            color: COLORS[i % COLORS.length],
          }));
        } else if (profile.exam_type !== "university") {
          const rows = await getExamSubjects(
            profile.exam_type as "wassce" | "neco" | "utme" | "post-utme"
          );
          allSubjects = rows.map((s, i) => ({
            id: s.subject_id,
            name: s.name,
            code: s.exam_type.toUpperCase().replace("-", " "),
            color: COLORS[i % COLORS.length],
          }));
        }

        // Browse More = DB subjects not yet enrolled
        setBrowseCourses(allSubjects.filter((c) => !enrolledIds.includes(c.id)));
      } catch (err) {
        console.error("Failed to load subjects:", err);
      } finally {
        setFetching(false);
      }

      // Quiz counts — non-blocking, failure just keeps counts at 0
      getUserQuizzes(profile.id, 500)
        .then((quizzes) => {
          const counts: Record<string, number> = {};
          quizzes.forEach((q) => {
            counts[q.course_id] = (counts[q.course_id] ?? 0) + 1;
          });
          setQuizCounts(counts);
        })
        .catch(() => {});
    };

    load();
  }, [profile?.exam_type, profile?.school_id, profile?.id, profile?.enrolled_course_ids]);

  const handleEnrol = async (courseId: string, courseName: string) => {
    if (!profile) return;
    setEnrolling(courseId);
    const updated = [...enrolledIds, courseId];
    try {
      await updateProfile(profile.id, { enrolled_course_ids: updated });
      updateStore({ enrolled_course_ids: updated });
      // Remove from browse list immediately
      setBrowseCourses((prev) => prev.filter((c) => c.id !== courseId));
      toast.success(`${courseName} added to your ${term.toLowerCase()}`);
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

        {/* Enrolled */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Enrolled {term}</h2>
            <span className="text-sm text-gray-500">{enrolledCourses.length} {term.toLowerCase()}</span>
          </div>

          {enrolledCourses.length === 0 ? (
            <p className="text-sm text-gray-400 py-6">
              No {term.toLowerCase()} enrolled yet. Browse below to get started.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {enrolledCourses.map((course) => (
                <Card key={course.id} padding="none" className="overflow-hidden">
                  <div className="h-2" style={{ backgroundColor: course.color }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: course.color + "20" }}
                      >
                        📚
                      </div>
                      <Badge variant="primary">Active</Badge>
                    </div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{course.code}</p>
                    <h3 className="font-bold text-gray-900 mb-4">{course.name}</h3>
                    <ProgressBar value={Math.min(100, (quizCounts[course.id] ?? 0) * 10)} size="sm" className="mb-3" showLabel />
                    <div className="text-xs text-gray-500 mb-4">{quizCounts[course.id] ?? 0} quizzes taken</div>
                    <div className="flex gap-2">
                      <Link href={`/practice?course=${encodeURIComponent(course.id)}`} className="flex-1">
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
              ))}
            </div>
          )}
        </section>

        {/* Browse More */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Browse More {term}</h2>

          {fetching ? (
            <div className="flex items-center gap-2 text-gray-400 py-6">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading available {term.toLowerCase()}...</span>
            </div>
          ) : browseCourses.length === 0 ? (
            <p className="text-sm text-gray-400 py-6">
              You are enrolled in all available {term.toLowerCase()} for your exam type.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {browseCourses.map((c) => (
                <Card key={c.id} hoverable padding="md" className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: c.color + "20" }}
                  >
                    📚
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{c.code}</p>
                    <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                  </div>
                  <button
                    onClick={() => handleEnrol(c.id, c.name)}
                    disabled={enrolling === c.id}
                    className="flex-shrink-0 w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center hover:bg-primary-100 transition-colors disabled:opacity-50"
                  >
                    {enrolling === c.id
                      ? <Loader2 size={14} className="animate-spin text-primary-600" />
                      : <Plus size={14} className="text-primary-600" />
                    }
                  </button>
                </Card>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
