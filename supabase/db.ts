import { supabase } from "./client";
import type { Profile, Quiz, Bookmark, UserSettings } from "@/types";

/* ── Profiles ── */
export async function updateProfile(userId: string, data: Partial<Profile>) {
  const { error } = await supabase
    .from("profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;
}

/* ── Courses ── */
export async function getCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

// Fetches subjects for WAEC, UTME or Post-UTME from their Supabase tables
// e.g. "wassce" → "wassce_subjects", "utme" → "utme_subjects"
export async function getExamSubjects(
  examType: "wassce" | "neco" | "utme" | "post-utme"
) {
  const { data, error } = await supabase
    .from("questions")
    .select("subject")
    .eq("exam_type", examType)
    .order("subject")
    .limit(5000);

  if (error) return [];

  const uniqueSubjects = [...new Set(data.map((q) => q.subject))];

  return uniqueSubjects.map((subject) => ({
    subject_id: subject,
    name: subject.charAt(0).toUpperCase() + subject.slice(1),
    description: "",
    exam_type: examType,
  }));
}

// Works for any school — table name is built from schoolId e.g. "unilag" → "unilag_courses"
export async function getSchoolCourses(schoolId: string) {
  const table = `${schoolId.toLowerCase()}_courses`;
  const { data, error } = await supabase.from(table).select("*").order("name");
  // Return empty array if the table doesn't exist yet for that school
  if (error) return [];
  return data as {
    course_id: string;
    name: string;
    description: string;
    exam_type: string;
    department: string;
  }[];
}

export async function getCourse(courseId: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();
  if (error) throw error;
  return data;
}

/* ── Questions ── */
export async function getQuestions(
  courseId: string,
  count = 20,
  difficulty?: string,
) {
  let q = supabase
    .from("questions")
    .select("*, options(*)")
    .eq("course_id", courseId)
    .limit(count);
  if (difficulty && difficulty !== "mixed") q = q.eq("difficulty", difficulty);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function getSubjectQuestions(
  subject: string,
  examType: string,
  count = 20,
  // difficulty param kept for API compatibility — no difficulty column in DB
  _difficulty?: string,
) {
  const { data, error } = await supabase
    .from("questions")
    .select("id, subject, exam_type, year, question_text, option_a, option_b, option_c, option_d, correct, explanation")
    .eq("subject", subject)
    .eq("exam_type", examType)
    .limit(300);

  if (error) throw error;

  const mapped = (data ?? []).map((row) => {
    const correctLetter = (row.correct ?? "").trim().toUpperCase();
    return {
      id: String(row.id),
      course_id: row.subject,
      course_name: row.subject,
      question_text: row.question_text,
      difficulty: "mixed" as const,
      explanation: row.explanation ?? "",
      exam_source: row.year ? `${row.exam_type.toUpperCase()} ${row.year}` : undefined,
      options: [
        { id: `${row.id}-A`, label: "A" as const, text: row.option_a ?? "", is_correct: correctLetter === "A" },
        { id: `${row.id}-B`, label: "B" as const, text: row.option_b ?? "", is_correct: correctLetter === "B" },
        { id: `${row.id}-C`, label: "C" as const, text: row.option_c ?? "", is_correct: correctLetter === "C" },
        { id: `${row.id}-D`, label: "D" as const, text: row.option_d ?? "", is_correct: correctLetter === "D" },
      ].filter((o) => o.text !== ""),
    } as import("@/types").Question;
  });

  return shuffleArray(mapped).slice(0, count);
}

export async function getSubjectQuestionCount(subject: string, examType: string) {
  const { count, error } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("subject", subject)
    .eq("exam_type", examType);
  if (error) return 0;
  return count ?? 0;
}

/* ── Quizzes ── */
export async function saveCompletedQuiz(payload: {
  user_id: string;
  course_id: string;
  course_name: string;
  mode: string;
  total_questions: number;
  time_limit_seconds?: number;
  time_taken_seconds?: number;
  difficulty: string;
  score_percent: number;
  correct_count: number;
  incorrect_count: number;
  skipped_count: number;
  started_at: string;
}) {
  const { error } = await supabase.from("quizzes").insert({
    ...payload,
    status: "completed",
    completed_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function createQuiz(quiz: Omit<Quiz, "id" | "started_at">) {
  const { data, error } = await supabase
    .from("quizzes")
    .insert({ ...quiz, started_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateQuiz(quizId: string, data: Partial<Quiz>) {
  const { error } = await supabase
    .from("quizzes")
    .update(data)
    .eq("id", quizId);
  if (error) throw error;
}

export async function getUserQuizzes(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Quiz[];
}

/* ── Bookmarks ── */
export async function addBookmark(userId: string, questionId: string, subject: string, examType: string, note?: string) {
  const { error } = await supabase
    .from("bookmarks")
    .upsert({ user_id: userId, question_id: questionId, subject, exam_type: examType, note }, { onConflict: "user_id,question_id" });
  if (error) throw error;
}

export async function removeBookmark(userId: string, questionId: string) {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("question_id", questionId);
  if (error) throw error;
}

export async function getUserBookmarks(userId: string) {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as { id: string; user_id: string; question_id: string; subject: string; exam_type: string; note?: string; created_at: string }[];
}

export async function getQuestionsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const { data } = await supabase
    .from("questions")
    .select("id, question_text, subject, exam_type")
    .in("id", ids);
  return (data ?? []) as { id: number; question_text: string; subject: string; exam_type: string }[];
}

export async function isBookmarked(userId: string, questionId: string): Promise<boolean> {
  const { count } = await supabase
    .from("bookmarks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("question_id", questionId);
  return (count ?? 0) > 0;
}

/* ── Streak ── */
export async function updateStreak(userId: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_active_date")
    .eq("id", userId)
    .single();

  if (!profile) return;

  const today = new Date().toISOString().split("T")[0];
  const lastActive = profile.last_active_date
    ? new Date(profile.last_active_date).toISOString().split("T")[0]
    : null;

  if (lastActive === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newStreak = lastActive === yesterday ? (profile.current_streak ?? 0) + 1 : 1;
  const newLongest = Math.max(profile.longest_streak ?? 0, newStreak);

  await supabase.from("profiles").update({
    current_streak: newStreak,
    longest_streak: newLongest,
    last_active_date: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", userId);
}

/* ── Leaderboard ── */
export async function getLeaderboard(limit = 50) {
  const { data, error } = await supabase.rpc("get_leaderboard", { limit_count: limit });
  if (error) throw error;
  return (data ?? []) as {
    user_id: string;
    full_name: string;
    streak: number;
    quizzes_completed: number;
    score: number;
  }[];
}

/* ── Settings ── */
export async function getUserSettings(
  userId: string,
): Promise<UserSettings | null> {
  const { data } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data as UserSettings | null;
}

export async function upsertUserSettings(
  userId: string,
  settings: Partial<UserSettings>,
) {
  const { error } = await supabase
    .from("user_settings")
    .upsert({ user_id: userId, ...settings });
  if (error) throw error;
}
