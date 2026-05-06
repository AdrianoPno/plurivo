"use client";

import { useEffect, useState } from "react";

import { onAuthStateChanged, User } from "firebase/auth";

import { firebaseAuth } from "../firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,

    loading,

    authenticated: !!user,
  };
}
