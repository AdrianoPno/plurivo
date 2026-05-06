"use client";

import { useCallback, useState } from "react";

export function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  return {
    loading,

    setLoading,

    startLoading,

    stopLoading,
  };
}
