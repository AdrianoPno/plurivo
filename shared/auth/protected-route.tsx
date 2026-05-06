"use client";

import { ReactNode, useContext, useEffect } from "react";

import { AuthContext } from "./auth-context";
import { ROUTES } from "../constants/routes";
import { Loading } from "../ui/loading";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) {
  const { loading, authenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && !authenticated) {
      window.location.href = redirectTo;
    }
  }, [loading, authenticated, redirectTo]);

  if (loading) {
    return <Loading />;
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
