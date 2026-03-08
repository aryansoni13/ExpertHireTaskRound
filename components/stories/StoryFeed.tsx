"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStories } from "@/hooks/useStories";
import { StoryCard } from "./StoryCard";
import { Button } from "@/components/ui/Button";
import { Category, CATEGORIES } from "@/types";
import { Spinner } from "@/components/ui/Spinner";

export function StoryFeed() {
  const [activeCategory, setActiveCategory] = useState<Category | undefined>();
  const [sortBy, setSortBy] = useState<"recent" | "trending">("recent");

  const { stories, loading, loadMore, hasMore, loadingMore } = useStories(
    activeCategory,
    sortBy
  );

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(undefined)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              !activeCategory
                ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory((prev) => (prev === cat ? undefined : cat))
              }
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("recent")}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              sortBy === "recent"
                ? "bg-white/10 border-white/20 text-white"
                : "bg-white/3 border-white/8 text-white/40 hover:text-white/70"
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setSortBy("trending")}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              sortBy === "trending"
                ? "bg-white/10 border-white/20 text-white"
                : "bg-white/3 border-white/8 text-white/40 hover:text-white/70"
            }`}
          >
            🔥 Trending
          </button>
        </div>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-white/40 text-lg">No stories found</p>
          <p className="text-white/20 text-sm mt-2">
            Be the first to share in this category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, i) => (
            <StoryCard key={story.id} story={story} index={i} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && stories.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="secondary"
            onClick={loadMore}
            loading={loadingMore}
          >
            Load more stories
          </Button>
        </div>
      )}
    </div>
  );
}
