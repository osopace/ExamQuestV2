import type { ExamType } from "@/types";

// Returns "Course"/"Subject" (singular) or "Courses"/"Subjects" (plural)
// based on the user's exam type.
// University → Course/Courses
// Everything else (WAEC, UTME, Post-UTME) → Subject/Subjects
export function getTerm(
  examType: ExamType | null | undefined,
  plural = true
): string {
  const isUniversity = examType === "university";
  if (plural) return isUniversity ? "Courses" : "Subjects";
  return isUniversity ? "Course" : "Subject";
}
