"use client";

import { useEffect } from "react";
import { onAuthChange } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);

  return { user, loading };
}
