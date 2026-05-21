"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, BookOpen, Loader2 } from "lucide-react";
import { Card, Badge } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { getSubjectQuestionCount } from "@/supabase/db";
import { useAuthStore } from "@/store/authStore";
import { getTerm } from "@/utils/terminology";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { profile, loading: profileLoading } = useAuthStore();
  const subjectId = decodeURIComponent(params.id).toLowerCase();
  const subjectName = subjectId.charAt(0).toUpperCase() + subjectId.slice(1);
  const term = getTerm(profile?.exam_type);

  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.exam_type) return;
    setLoading(true);
    getSubjectQuestionCount(subjectId, profile.exam_type)
      .then((count) => setQuestionCount(count))
      .finally(() => setLoading(false));
  }, [subjectId, profile?.exam_type]);

  if (profileLoading) {
    return (
      <div>
        <Topbar title={subjectName} />
        <div className="p-6 max-w-4xl mx-auto flex items-center justify-center py-20 text-gray-400 gap-2">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Topbar title={subjectName} />
      <div className="p-6 max-w-4xl mx-auto space-y-6">

        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to {term}
        </Link>

        <Card padding="lg">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-primary-50">
              📚
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary">
                  {profile?.exam_type ? profile.exam_type.toUpperCase().replace("-", " ") : "—"}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{subjectName}</h1>

              {loading ? (
                <div className="flex items-center gap-2 text-gray-400 mb-5">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-sm">Loading details...</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} />
                    {questionCount ?? 0} questions available
                  </span>
                </div>
              )}

              <Link href={`/practice?course=${encodeURIComponent(subjectId)}`}>
                <button className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
                  <Play size={16} /> Start Practice
                </button>
              </Link>
            </div>
          </div>
        </Card>

        {questionCount === 0 && !loading && (
          <Card padding="md">
            <p className="text-sm text-gray-500 text-center py-4">
              No questions are available for this subject yet. Check back soon.
            </p>
          </Card>
        )}

      </div>
    </div>
  );
}
