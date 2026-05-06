import { ApiUser } from "@/lib/api";
import { create } from "zustand";

interface AuthState {
  user: ApiUser | null;
  isAuthenticated: boolean;
  setUser: (user: ApiUser | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
