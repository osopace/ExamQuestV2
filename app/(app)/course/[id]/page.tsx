"use client";
import Link from "next/link";
import { ArrowLeft, Play, Star, BookOpen, Target, CheckCircle } from "lucide-react";
import { Card, Badge, ProgressBar } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { COURSES, COURSE_PROGRESS, TOPIC_ANALYTICS } from "@/constants/mockData";
import { getScoreBg } from "@/utils/format";

const TOPICS = [
  { id: "arrays", name: "Arrays & Dynamic Arrays", questions: 24 },
  { id: "stacks", name: "Stacks & Queues", questions: 18 },
  { id: "trees", name: "Trees & Binary Search Trees", questions: 20 },
  { id: "graphs", name: "Graphs & Traversal", questions: 16 },
  { id: "complexity", name: "Time & Space Complexity", questions: 22 },
  { id: "sorting", name: "Sorting Algorithms", questions: 20 },
];

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = COURSES.find((c) => c.id === params.id) ?? COURSES[0];
  const progress = COURSE_PROGRESS.find((p) => p.course_id === course.id);

  return (
    <div>
      <Topbar title={course.name} />
      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* Back */}
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
          <ArrowLeft size={16} />Back to Courses
        </Link>

        {/* Hero card */}
        <Card padding="lg">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ backgroundColor: course.color + "15" }}>📚</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">{course.code}</span>
                <Badge variant="primary">{course.exam_type.replace("_"," ").toUpperCase()}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.name}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5">
                <span className="flex items-center gap-1.5"><BookOpen size={14} />{course.total_questions} questions</span>
                <span className="flex items-center gap-1.5"><Play size={14} />{course.total_quizzes} quizzes</span>
                <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-400 fill-amber-400" />{course.rating} rating</span>
              </div>
              {progress && (
                <div className="mb-5">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Your Progress</span>
                    <span className="font-semibold">{progress.progress_percent}%</span>
                  </div>
                  <ProgressBar value={progress.progress_percent} size="lg" />
                </div>
              )}
              <div className="flex gap-3">
                <Link href={`/practice?course=${course.id}`}>
                  <button className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
                    <Play size={16} /> Start Practice
                  </button>
                </Link>
              </div>
            </div>
            {progress && (
              <div className="flex gap-4 flex-shrink-0">
                {[
                  { label: "Avg Score", value: `${progress.average_score}%`, color: getScoreBg(progress.average_score) },
                  { label: "Best Score", value: `${progress.highest_score}%`, color: getScoreBg(progress.highest_score) },
                  { label: "Quizzes", value: String(progress.total_quizzes), color: "bg-primary-50 text-primary-700" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center">
                    <div className={`text-lg font-bold px-3 py-2 rounded-xl mb-1 ${color}`}>{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Topic breakdown */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Topics Covered</h2>
          <div className="space-y-3">
            {TOPICS.map((topic) => {
              const analytics = TOPIC_ANALYTICS.find((a) => a.topic_id === topic.id);
              return (
                <Card key={topic.id} padding="md" className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target size={14} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{topic.name}</p>
                      {analytics ? (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getScoreBg(analytics.accuracy)}`}>{analytics.accuracy}%</span>
                      ) : (
                        <span className="text-xs text-gray-400">Not attempted</span>
                      )}
                    </div>
                    {analytics ? (
                      <ProgressBar value={analytics.accuracy} size="sm" color={analytics.accuracy >= 70 ? "success" : analytics.accuracy >= 50 ? "warning" : "error"} />
                    ) : (
                      <div className="h-1.5 bg-gray-100 rounded-full" />
                    )}
                    <p className="text-xs text-gray-400 mt-1">{topic.questions} questions</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
