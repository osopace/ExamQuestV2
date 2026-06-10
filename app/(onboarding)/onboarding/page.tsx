"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Award,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Stepper } from "@/components/ui/index";

import StepTwo from "./StepTwo";
import { updateProfile } from "@/supabase/db";
import { useAuthStore } from "@/store/authStore";
import { getTerm } from "@/utils/terminology";
import type { ExamType } from "@/types";

const EXAM_TYPES: {
  id: ExamType;
  label: string;
  desc: string;
  icon: any;
  color?: string;
}[] = [
  {
    id: "wassce",
    label: "WAEC",
    desc: "West African Examinations Council",
    icon: Award,
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    id: "neco",
    label: "NECO",
    desc: "National Examinations Council",
    icon: BookOpen,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    id: "utme",
    label: "JAMB UTME",
    desc: "Joint Admissions and Matriculation Board",
    icon: GraduationCap,
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    id: "post-utme",
    label: "Post-UTME",
    desc: "University screening examinations",
    icon: Building2,
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile: updateStore } = useAuthStore();
  const [step, setStep] = useState(0);
  const [examType, setExamType] = useState<ExamType | null>(null);
  const [schoolId, setSchoolId] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const steps = ["Exam Type", `School & ${getTerm(examType)}`, "Done"];

  const toggleCourse = (id: string) =>
    setSelectedCourses((p) =>
      p.includes(id) ? p.filter((c) => c !== id) : [...p, id],
    );

  const handleFinish = async () => {
    if (selectedCourses.length === 0) {
      toast.error("Please select at least one course");
      return;
    }
    if (!profile) {
      router.push("/dashboard");
      return;
    }
    setLoading(true);
    try {
      await updateProfile(profile.id, {
        exam_type: examType ?? undefined,
        school_id: schoolId || undefined,

        enrolled_course_ids: selectedCourses,
        onboarding_complete: true,
      });
      updateStore({
        exam_type: examType ?? undefined,
        school_id: schoolId,

        enrolled_course_ids: selectedCourses,
        onboarding_complete: true,
      });
      toast.success("You're all set! Let's go 🚀");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-2.5 font-bold text-xl text-gray-900 mb-10">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          ExamQuest
        </div>

        <Stepper steps={steps} current={step} className="mb-10" />

        {/* Step 1: Exam Type */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What are you preparing for?
            </h2>
            <p className="text-gray-600 mb-7">
              Choose your primary exam type. You can change this later.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {EXAM_TYPES.map(({ id, label, desc, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setExamType(id)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${examType === id ? "border-primary-500 bg-primary-50" : "border-gray-200 bg-white hover:border-primary-200"}`}
                >
                  <div className="text-3xl mb-3">
                    <Icon size={24} />
                  </div>
                  <div className="font-bold text-gray-900 mb-1">{label}</div>
                  <div className="text-sm text-gray-500">{desc}</div>
                  {examType === id && (
                    <CheckCircle size={18} className="text-primary-600 mt-3" />
                  )}
                </button>
              ))}
            </div>
            <Button
              className="mt-8"
              fullWidth
              disabled={!examType}
              rightIcon={<ArrowRight size={18} />}
              onClick={() => setStep(1)}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: School + subjects */}
        {step === 1 && (
          <StepTwo
            examType={examType}
            selectedCourses={selectedCourses}
            toggleCourse={toggleCourse}
            loading={loading}
            onBack={() => setStep(0)}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}
