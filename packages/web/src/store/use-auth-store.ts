import { ApiUser } from "@/lib/api";
import { create } from "zustand";

// Este tipo agora está alinhado com os dados do usuário retornados pela sua API (endpoint /me)
interface User {
  uid: string;
  nome: string;
  email: string;
  role: "ADMIN" | "VIEWER" | "SUPER";
  status: "ativo" | "inativo";
}

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
