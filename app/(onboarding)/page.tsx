"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Stepper } from "@/components/ui/index";
import { SCHOOLS, COURSES } from "@/constants/mockData";
import { updateProfile } from "@/supabase/db";
import { useAuthStore } from "@/store/authStore";
import type { ExamType } from "@/types";

const EXAM_TYPES: { id: ExamType; label: string; desc: string; emoji: string }[] = [
  { id: "waec", label: "WAEC/NECO", desc: "West African Examinations Council", emoji: "📝" },
  { id: "utme", label: "JAMB UTME", desc: "Joint Admissions and Matriculation Board", emoji: "🎯" },
  { id: "post_utme", label: "Post-UTME", desc: "University screening examinations", emoji: "🏫" },
  { id: "university", label: "University", desc: "Semester & end-of-year exams", emoji: "🎓" },
];

const STEPS = ["Exam Type", "School & Courses", "Done"];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile: updateStore } = useAuthStore();
  const [step, setStep] = useState(0);
  const [examType, setExamType] = useState<ExamType | null>(null);
  const [schoolId, setSchoolId] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredCourses = examType ? COURSES.filter((c) => c.exam_type === examType) : COURSES;

  const toggleCourse = (id: string) =>
    setSelectedCourses((p) => (p.includes(id) ? p.filter((c) => c !== id) : [...p, id]));

  const handleFinish = async () => {
    if (selectedCourses.length === 0) { toast.error("Please select at least one course"); return; }
    if (!profile) { router.push("/dashboard"); return; }
    setLoading(true);
    try {
      const school = SCHOOLS.find((s) => s.id === schoolId);
      await updateProfile(profile.id, {
        exam_type: examType ?? undefined,
        school_id: schoolId || undefined,
        school_name: school?.name,
        enrolled_course_ids: selectedCourses,
        onboarding_complete: true,
      });
      updateStore({ exam_type: examType ?? undefined, school_id: schoolId, school_name: school?.name, enrolled_course_ids: selectedCourses, onboarding_complete: true });
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

        <Stepper steps={STEPS} current={step} className="mb-10" />

        {/* Step 1: Exam Type */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What are you preparing for?</h2>
            <p className="text-gray-600 mb-7">Choose your primary exam type. You can change this later.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {EXAM_TYPES.map(({ id, label, desc, emoji }) => (
                <button
                  key={id}
                  onClick={() => setExamType(id)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${examType === id ? "border-primary-500 bg-primary-50" : "border-gray-200 bg-white hover:border-primary-200"}`}
                >
                  <div className="text-3xl mb-3">{emoji}</div>
                  <div className="font-bold text-gray-900 mb-1">{label}</div>
                  <div className="text-sm text-gray-500">{desc}</div>
                  {examType === id && <CheckCircle size={18} className="text-primary-600 mt-3" />}
                </button>
              ))}
            </div>
            <Button className="mt-8" fullWidth disabled={!examType} rightIcon={<ArrowRight size={18} />} onClick={() => setStep(1)}>Continue</Button>
          </div>
        )}

        {/* Step 2: School + Courses */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Set up your courses</h2>
            <p className="text-gray-600 mb-7">Select your school and choose the courses you want to practice.</p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your School (optional)</label>
              <select
                className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
              >
                <option value="">Select a school...</option>
                {SCHOOLS.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.short_name})</option>)}
              </select>
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">Select Courses</label>
                <span className="text-xs text-gray-500">{selectedCourses.length} selected</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {filteredCourses.map((c) => {
                  const selected = selectedCourses.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleCourse(c.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${selected ? "border-primary-500 bg-primary-50" : "border-gray-200 bg-white hover:border-primary-200"}`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${selected ? "bg-primary-600 border-primary-600" : "border-gray-300"}`}>
                        {selected && <CheckCircle size={12} className="text-white" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.code} · {c.total_questions} Qs</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="outline" leftIcon={<ArrowLeft size={18} />} onClick={() => setStep(0)}>Back</Button>
              <Button fullWidth loading={loading} onClick={handleFinish} disabled={selectedCourses.length === 0} rightIcon={<ArrowRight size={18} />}>
                Finish Setup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
