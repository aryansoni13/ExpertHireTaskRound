"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PageSpinner } from "@/components/ui/Spinner";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
    }
  }, [user, loading, router]);

  if (loading) return <PageSpinner />;
  if (!user) return null;

  return <>{children}</>;
}
