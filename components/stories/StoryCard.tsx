"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Story, REACTION_EMOJIS } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { timeAgo, truncate } from "@/lib/utils";

interface StoryCardProps {
  story: Story;
  index?: number;
}

export function StoryCard({ story, index = 0 }: StoryCardProps) {
  const totalReactions = Object.values(story.reactions).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link href={`/stories/${story.id}`}>
        <div className="group h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="category" category={story.category}>
                {story.category}
              </Badge>
              <Badge variant="sentiment" sentiment={story.sentimentTag}>
                {story.sentimentTag}
              </Badge>
            </div>
            <span className="text-white/30 text-xs shrink-0 mt-1">
              {timeAgo(story.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-white text-lg leading-snug group-hover:text-violet-200 transition-colors line-clamp-2 break-words [overflow-wrap:anywhere]">
            {story.title}
          </h3>

          {/* Excerpt */}
          <p className="text-white/50 text-sm leading-relaxed flex-1 line-clamp-3 break-words [overflow-wrap:anywhere]">
            {truncate(story.content, 200)}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-3">
              {(Object.entries(story.reactions) as [string, number][])
                .filter(([, count]) => count > 0)
                .slice(0, 3)
                .map(([type, count]) => (
                  <span key={type} className="flex items-center gap-1 text-sm">
                    <span>
                      {REACTION_EMOJIS[type as keyof typeof REACTION_EMOJIS]}
                    </span>
                    <span className="text-white/40 text-xs">{count}</span>
                  </span>
                ))}
              {totalReactions === 0 && (
                <span className="text-white/20 text-xs">No reactions yet</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-white/30 text-xs">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>{story.amplifyCount}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
