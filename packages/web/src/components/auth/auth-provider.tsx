"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/use-auth-store";
import { getMe } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // On page load, if Firebase has a user and we have our API token,
      // but the app state is not yet hydrated, fetch the user data.
      if (
        firebaseUser &&
        !isAuthenticated &&
        localStorage.getItem("vox-api-token")
      ) {
        try {
          const apiUser = await getMe();
          setUser(apiUser);
        } catch (error) {
          console.error("Session restore failed:", error);
          setUser(null); // Clear state if fetching fails
        }
      } else {
        // If Firebase user is null, ensure our app state is also cleared.
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, isAuthenticated]);

  return <>{children}</>;
}
