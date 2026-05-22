"use client";

import {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@shared/firebase/client.js";
import { AppError } from "@shared/utils/app-error.js";
import { AuthContext } from "./auth-context.js";
import { IUser } from "@shared/types/user";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const fetchUserProfile = async (
    firebaseUser: FirebaseUser,
  ): Promise<IUser> => {
    const idToken = await firebaseUser.getIdToken();
    const apiUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL;
    if (!apiUrl) {
      throw new AppError("URL da API não configurada.", 500);
    }

    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AppError(
        errorData.message || "Falha ao carregar perfil de permissões.",
        response.status,
      );
    }

    const profile = await response.json();
    localStorage.setItem("platform-token", idToken);
    localStorage.setItem("platform-user", JSON.stringify(profile.data));
    return profile.data;
  };

  const logout = useCallback(() => {
    startTransition(() => {
      signOut(auth);
      localStorage.removeItem("platform-token");
      localStorage.removeItem("platform-user");
      setUser(null);
      router.push("/login");
    });
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await fetchUserProfile(firebaseUser);
          setUser(userProfile);
        } catch (error) {
          console.error("Falha ao restaurar sessão:", error);
          logout();
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    window.addEventListener("auth-error", logout);

    return () => {
      unsubscribe();
      window.removeEventListener("auth-error", logout);
    };
  }, [logout]);

  const login = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const userProfile = await fetchUserProfile(userCredential.user);
    setUser(userProfile);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || isPending,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
