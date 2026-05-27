"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { IUser } from "@shared/types/user";
import { MODULE_URLS } from "@shared/constants/modules";

import { AuthContext, type AuthContextValue } from "./auth-context.js";

const TOKEN_KEY = "platform-token";

interface AuthProviderProps {
  children: ReactNode;
  profileUrl?: string;
}

export function AuthProvider({ children, profileUrl }: AuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);

    window.location.href = MODULE_URLS.platformShell.web;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);

        if (!storedToken) {
          setToken(null);
          setUser(null);
          return;
        }

        setToken(storedToken);

        if (!profileUrl) {
          return;
        }

        const response = await fetch(profileUrl, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Token inválido ou usuário não autorizado.");
        }

        const result = await response.json();

        const authenticatedUser = result.data ?? result;

        if (authenticatedUser.ativo === false) {
          throw new Error("Usuario inativo.");
        }

        setUser(authenticatedUser);
      } catch (error) {
        console.error("Falha ao carregar usuário autenticado:", error);

        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
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
      if (event.key === TOKEN_KEY && !event.newValue) {
        logout();
      }
    };

    window.addEventListener("auth-error", handleAuthError);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("auth-error", handleAuthError);
      window.removeEventListener("storage", handleStorage);
    };
  }, [profileUrl]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user),
      logout,
    }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
