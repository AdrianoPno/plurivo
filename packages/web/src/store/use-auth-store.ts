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
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
