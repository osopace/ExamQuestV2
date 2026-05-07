import { supabase } from "./client";
import type { Profile } from "@/types";

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw error;

  // Create profile row
  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: fullName,
      email,
      enrolled_course_ids: [],
      current_streak: 0,
      longest_streak: 0,
      is_premium: false,
      onboarding_complete: false,
    });
  }
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data as Profile;
}

export function onAuthStateChange(cb: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
  return supabase.auth.onAuthStateChange(cb);
}
