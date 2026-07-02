import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CrmUser } from "@/lib/types/crm";

interface AuthState {
  user: CrmUser | null;
  isAuthenticated: boolean;
  setUser: (user: CrmUser | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "leadseveryday-auth" }
  )
);
