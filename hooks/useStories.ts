"use client";

import { useState, useEffect, useCallback } from "react";
import {
  subscribeToStories,
  getStories,
} from "@/lib/firestore";
import { Story, Category } from "@/types";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export function useStories(
  category?: Category,
  sortBy: "recent" | "trending" = "recent"
) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToStories(
      (newStories) => {
        setStories(newStories);
        setLoading(false);
      },
      category,
      sortBy
    );
    return unsubscribe;
  }, [category, sortBy]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !lastDoc) return;
    setLoadingMore(true);
    try {
      const { stories: more, lastDoc: newLast } = await getStories(
        category,
        sortBy,
        lastDoc
      );
      setStories((prev) => [...prev, ...more]);
      setLastDoc(newLast);
      if (more.length < 12) setHasMore(false);
    } catch (e) {
      setError("Failed to load more stories");
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, lastDoc, category, sortBy]);

  return { stories, loading, error, loadMore, hasMore, loadingMore };
}
