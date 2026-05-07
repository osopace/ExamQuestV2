"use client";
import { useEffect } from "react";
import { onAuthStateChange, getProfile } from "@/supabase/auth";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { profile, loading, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (!session?.user) {
        setProfile(null);
        return;
      }
      try {
        const p = await getProfile(session.user.id);
        setProfile(p);
      } catch {
        setProfile(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [setProfile, setLoading]);

  return { profile, loading };
}
