"use client";

import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { SCHOOLS } from "@/constants/mockData";
import { getSchoolCourses, getExamSubjects } from "@/supabase/db";
import { getTerm } from "@/utils/terminology";
import type { StepTwoProps } from "@/types";

type DisplayCourse = {
  id: string;
  name: string;
  subtitle: string;
};

export default function StepTwo({
  examType,
  schoolId,
  setSchoolId,
  selectedCourses,
  filteredCourses,
  toggleCourse,
  loading,
  onBack,
  onFinish,
}: StepTwoProps) {
  const isUniversity = examType === "university";
  const term = getTerm(examType); // "Courses" or "Subjects"
  const termSingular = getTerm(examType, false); // "Course" or "Subject"

  const [fetched, setFetched] = useState<DisplayCourse[]>([]);
  const [fetchingCourses, setFetchingCourses] = useState(false);

  useEffect(() => {
    setFetched([]); // reset whenever exam type or school changes

    if (!examType) return;

    // Non-university: fetch from waec_subjects / utme_subjects / post_utme_subjects
    if (!isUniversity) {
      setFetchingCourses(true);
      getExamSubjects(examType as "wassce" | "neco" | "utme" | "post-utme")
        .then((rows) =>
          setFetched(
            rows.map((s) => ({
              id: s.subject_id,
              name: s.name,
              subtitle: s.exam_type,
            })),
          ),
        )
        .catch(() => setFetched([]))
        .finally(() => setFetchingCourses(false));
      return;
    }

    // University + school selected: fetch from e.g. unilag_courses
    if (isUniversity && schoolId) {
      setFetchingCourses(true);
      getSchoolCourses(schoolId)
        .then((rows) =>
          setFetched(
            rows.map((c) => ({
              id: c.course_id,
              name: c.name,
              subtitle: c.department,
            })),
          ),
        )
        .catch(() => setFetched([]))
        .finally(() => setFetchingCourses(false));
    }
  }, [examType, schoolId, isUniversity]);

  // Use Supabase data when available, fall back to mockData
  const displayCourses: DisplayCourse[] =
    fetched.length > 0
      ? fetched
      : filteredCourses.map((c) => ({
          id: c.id,
          name: c.name,
          subtitle: `${c.code} · ${c.total_questions} Qs`,
        }));

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Set up your {term.toLowerCase()}
      </h2>
      <p className="text-gray-600 mb-7">
        {isUniversity
          ? `Select your school and choose the ${term.toLowerCase()} you want to practice.`
          : `Choose the ${term.toLowerCase()} you want to practice.`}
      </p>

      {/* School selector — university only */}
      {isUniversity && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your School (optional)
          </label>
          <select
            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
          >
            <option value="">Select a school...</option>
            {SCHOOLS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.short_name})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Course / Subject selector */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">
            Select {term}
          </label>
          <span className="text-xs text-gray-500">
            {selectedCourses.length} selected
          </span>
        </div>

        {fetchingCourses ? (
          <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading {term.toLowerCase()}...</span>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {displayCourses.map((c) => {
              const selected = selectedCourses.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCourse(c.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    selected
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 bg-white hover:border-primary-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      selected
                        ? "bg-primary-600 border-primary-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selected && (
                      <CheckCircle size={12} className="text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-500">{c.subtitle}</p>
                  </div>
                </button>
              );
            })}

            {!fetchingCourses && displayCourses.length === 0 && (
              <p className="col-span-2 text-center text-sm text-gray-400 py-8">
                No {term.toLowerCase()} available. Please try another selection.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          variant="outline"
          leftIcon={<ArrowLeft size={18} />}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          fullWidth
          loading={loading}
          onClick={onFinish}
          disabled={selectedCourses.length === 0}
          rightIcon={<ArrowRight size={18} />}
        >
          Finish Setup
        </Button>
      </div>
    </div>
  );
}
