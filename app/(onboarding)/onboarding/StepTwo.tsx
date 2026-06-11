"use client";

import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

import { getExamSubjects } from "@/supabase/db";
import{SUBJECTS} from "@/constants/mockData"
import { getTerm } from "@/utils/terminology";
import type { StepTwoProps, ExamType } from "@/types";

type DisplaySubjects = {
  subject_id: string;
  name: string;
  exam_type: ExamType;
};

export default function StepTwo({
  examType,
  selectedCourses,
  toggleCourse,
  loading,
  onBack,
  onFinish,
}: StepTwoProps) {
  const term = getTerm(examType); // "Courses" or "Subjects"

  const [subjects, setSubjects] = useState<DisplaySubjects[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    if (!examType) {
      setSubjects([]);
      return;
    }

    setFetching(true);

    getExamSubjects(examType)
      .then((data) => {
        setSubjects(data as DisplaySubjects[]);
        if (data.length === 0) {
          console.warn(`No active records found for exam type: ${examType}`);
        }
      })
      .catch((err) => {
        console.error(`Failed loading subjects for ${examType}:`, err);
        setSubjects([]);
      })
      .finally(() => {
        // ✅ The Correct Spot: Turns off the spinner ONLY after the network response drops
        setFetching(false);
      });
  }, [examType]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Set up your {term.toLowerCase()}
      </h2>
      <p className="text-gray-600 mb-7">
        Choose the {term.toLowerCase()} you want to practice.
      </p>

      {/* Course / Subject Selector Block */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">
            Select {term}
          </label>
          <span className="text-xs text-gray-500">
            {selectedCourses.length} selected
          </span>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading {term.toLowerCase()}...</span>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {SUBJECTS.map((s) => {
              const isSelected = selectedCourses.includes(s);
              return (
                <button
                  key={s}
                  type="button" // Always specify button types to prevent accidental form triggers
                  onClick={() => toggleCourse(s)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 bg-white hover:border-primary-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-primary-600 border-primary-600"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle size={12} className="text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {s}
                    </p>
                  </div>
                </button>
              );
            })}

            {subjects.length === 0 && (
              <p className="col-span-2 text-center text-sm text-gray-400 py-8">
                No {term.toLowerCase()} available. Please try another selection.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation Footer Layout */}
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
