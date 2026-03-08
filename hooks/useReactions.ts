"use client";

import { useState, useEffect } from "react";
import { addReaction, getUserReaction } from "@/lib/firestore";
import { ReactionType } from "@/types";
import { useAuthStore } from "@/store/authStore";

export function useReactions(storyId: string) {
  const { user } = useAuthStore();
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserReaction(storyId, user.uid).then(setUserReaction);
  }, [storyId, user]);

  const react = async (type: ReactionType) => {
    if (!user) return;
    setLoading(true);
    try {
      await addReaction(storyId, user.uid, type);
      // Optimistic update for userReaction
      setUserReaction((prev) => (prev === type ? null : type));
    } catch (e) {
      console.error("Failed to react:", e);
    } finally {
      setLoading(false);
    }
  };

  return { userReaction, react, loading };
}
