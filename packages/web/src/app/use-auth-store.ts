import { create } from "zustand";

// TODO: Mover este tipo para um pacote compartilhado (`packages/shared-types`)
// para evitar duplicação com o backend.
export interface UserType {
  uid: string;
  nome: string;
  email: string;
  role: "ADMIN" | "VIEWER" | "SUPER";
  status: "ativo" | "inativo";
}

interface AuthState {
  user: UserType | null;
  token: string | null;
  setUser: (user: UserType | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token:
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
    set({ token });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    set({ user: null, token: null });
  },
}));
