import { create } from "zustand";
import type { Profile } from "@/types";

interface AuthState {
  profile: Profile | null;
  loading: boolean;
  setProfile: (p: Profile | null) => void;
  setLoading: (v: boolean) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  loading: true,
  setProfile: (profile) => set({ profile, loading: false }),
  setLoading: (loading) => set({ loading }),
  updateProfile: (patch) =>
    set((s) => ({ profile: s.profile ? { ...s.profile, ...patch } : null })),
  logout: () => set({ profile: null, loading: false }),
}));
