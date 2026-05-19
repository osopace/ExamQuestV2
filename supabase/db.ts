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
  const { data, error } = await supabase.from("courses").select("*").order("name");
  if (error) throw error;
  return data;
}

// Fetches subjects for WAEC, UTME or Post-UTME from their Supabase tables
// e.g. "waec" → "waec_subjects", "utme" → "utme_subjects"
export async function getExamSubjects(examType: "waec" | "utme" | "post_utme") {
  const table = `${examType}_subjects`;
  const { data, error } = await supabase.from(table).select("*").order("name");
  if (error) return [];
  return data as {
    subject_id: string;
    name: string;
    description: string;
    exam_type: string;
    category?: string;
  }[];
}

// Works for any school — table name is built from schoolId e.g. "unilag" → "unilag_courses"
export async function getSchoolCourses(schoolId: string) {
  const table = `${schoolId.toLowerCase()}_courses`;
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("name");
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
  const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).single();
  if (error) throw error;
  return data;
}

/* ── Questions ── */
export async function getQuestions(courseId: string, count = 20, difficulty?: string) {
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

/* ── Quizzes ── */
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
  const { error } = await supabase.from("quizzes").update(data).eq("id", quizId);
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
export async function addBookmark(bookmark: Omit<Bookmark, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("bookmarks")
    .insert({ ...bookmark, created_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data as Bookmark;
}

export async function removeBookmark(id: string) {
  const { error } = await supabase.from("bookmarks").delete().eq("id", id);
  if (error) throw error;
}

export async function getUserBookmarks(userId: string) {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*, question:questions(*, options:options(*))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Bookmark[];
}

/* ── Settings ── */
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data } = await supabase.from("user_settings").select("*").eq("user_id", userId).single();
  return data as UserSettings | null;
}

export async function upsertUserSettings(userId: string, settings: Partial<UserSettings>) {
  const { error } = await supabase
    .from("user_settings")
    .upsert({ user_id: userId, ...settings });
  if (error) throw error;
}
