"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import type { IUser } from "@shared/types/user";
import { MODULE_URLS } from "@shared/constants/modules";
import api from "../lib/api";

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("platform-token");
    setUser(null);
    window.location.href = MODULE_URLS.platformShell.web;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("platform-token");

        if (!token) {
          setUser(null);
          return;
        }

        const response = await api.get<IUser>("/users/me");
        setUser(response.data);
      } catch (error) {
        console.error("Falha ao buscar perfil do usuário no Vox:", error);

        localStorage.removeItem("platform-token");
        setUser(null);

        window.location.href = MODULE_URLS.platformShell.web;
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    const handleAuthError = () => {
      logout();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "platform-token" && !event.newValue) {
        logout();
      }
    };

    window.addEventListener("auth-error", handleAuthError);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("auth-error", handleAuthError);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
