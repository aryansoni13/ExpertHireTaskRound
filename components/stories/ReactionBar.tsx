"use client";

import { motion } from "framer-motion";
import { Story, ReactionType, REACTION_EMOJIS } from "@/types";
import { useReactions } from "@/hooks/useReactions";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface ReactionBarProps {
  story: Story;
}

const REACTION_LABELS: Record<ReactionType, string> = {
  HEART: "Love",
  FIRE: "Fire",
  STRONG: "Strong",
  HUG: "Hug",
};

export function ReactionBar({ story }: ReactionBarProps) {
  const { user } = useAuthStore();
  const { userReaction, react, loading } = useReactions(story.id);
  const router = useRouter();

  const handleReact = async (type: ReactionType) => {
    if (!user) {
      router.push("/login");
      return;
    }
    await react(type);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((type) => {
        const count = story.reactions?.[type] ?? 0;
        const isActive = userReaction === type;

        return (
          <motion.button
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleReact(type)}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-violet-500/20 border-violet-500/50 text-white shadow-lg shadow-violet-500/20"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            <span className="text-base">{REACTION_EMOJIS[type]}</span>
            <span>{count > 0 ? count : REACTION_LABELS[type]}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
