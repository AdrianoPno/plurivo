"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { MODULE_URLS } from "@shared/constants/modules";
import type { IUser } from "@shared/types/user";

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
  const [authError, setAuthError] = useState<string | null>(null);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setAuthError(null);

    window.location.href = `${MODULE_URLS.platformShell.web}/login`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);

        if (!storedToken) {
          setToken(null);
          setUser(null);
          setAuthError(null);
          return;
        }

        setToken(storedToken);
        setAuthError(null);

        if (!profileUrl) {
          return;
        }

        const response = await fetch(profileUrl, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const message =
            typeof errorData.message === "string"
              ? errorData.message
              : "Token invalido ou usuario nao autorizado.";

          if (response.status === 403 || response.status === 404) {
            setUser(null);
            setAuthError(message);
            return;
          }

          throw new Error(message);
        }

        const result = await response.json();
        const authenticatedUser = result.data ?? result;

        if (authenticatedUser.ativo === false) {
          setUser(null);
          setAuthError("Usuario inativo.");
          return;
        }

        setUser(authenticatedUser);
      } catch (error) {
        console.error("Falha ao carregar usuario autenticado:", error);

        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setAuthError("Sessao invalida ou expirada.");

        window.location.href = `${MODULE_URLS.platformShell.web}/login`;
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
      authError,
      logout,
    }),
    [user, token, isLoading, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
