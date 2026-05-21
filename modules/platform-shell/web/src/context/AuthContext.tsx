"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { UserRole, ModulePermission } from "@shared/types/user.js";

interface AuthUser {
  uid: string;
  email?: string;
  nome?: string;
  role: UserRole;
  unidadeId?: string;
  unidadeNome?: string;
  permissions: ModulePermission[];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUserFromStorage = useCallback(() => {
    const storedUser = localStorage.getItem("platform-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        localStorage.removeItem("platform-user"); // Clear corrupted data
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const logout = () => {
    localStorage.removeItem("platform-token");
    localStorage.removeItem("platform-user");
    setUser(null);
    router.push("/login");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
