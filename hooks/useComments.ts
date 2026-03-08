"use client";

import { useState, useEffect } from "react";
import { subscribeToComments, addComment } from "@/lib/firestore";
import { Comment } from "@/types";
import { useAuthStore } from "@/store/authStore";

export function useComments(storyId: string) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToComments(storyId, (newComments) => {
      setComments(newComments);
      setLoading(false);
    });
    return unsubscribe;
  }, [storyId]);

  const submit = async (content: string) => {
    if (!user || !content.trim()) return;
    setSubmitting(true);
    try {
      await addComment(storyId, user.uid, content);
    } catch (e) {
      console.error("Failed to add comment:", e);
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  return { comments, loading, submit, submitting };
}
