"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Story } from "@/types";
import { subscribeToStory, getRelatedStories } from "@/lib/firestore";
import { Badge } from "@/components/ui/Badge";
import { ReactionBar } from "@/components/stories/ReactionBar";
import { AmplifyButton } from "@/components/stories/AmplifyButton";
import { CommentSection } from "@/components/stories/CommentSection";
import { StoryCard } from "@/components/stories/StoryCard";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";

export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null | undefined>(undefined);
  const [related, setRelated] = useState<Story[]>([]);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToStory(id, (s) => {
      setStory(s);
      if (s) {
        getRelatedStories(s.category, s.id).then(setRelated);
      }
    });
    return unsubscribe;
  }, [id]);

  if (story === undefined) return <PageSpinner />;
  if (story === null) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 text-xl mb-4">Story not found</p>
          <Link href="/stories" className="text-violet-400 hover:underline">
            ← Back to stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="orb w-[500px] h-[500px] bg-violet-600/10 -top-20 -left-20 animate-pulse-slow" />
      <div className="orb w-[400px] h-[400px] bg-pink-600/10 top-1/2 -right-20 animate-float" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back link */}
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-10 transition-colors group"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All stories
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header section */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Badge
                  variant="category"
                  category={story.category}
                  className="px-4 py-1.5 text-xs font-bold tracking-wider uppercase"
                >
                  {story.category}
                </Badge>
                <div className="h-1 w-1 rounded-full bg-white/20" />
                <Badge
                  variant="sentiment"
                  sentiment={story.sentimentTag}
                  className="px-3 py-1 text-xs"
                >
                  {story.sentimentTag}
                </Badge>
                <div className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-white/30 text-xs font-medium uppercase tracking-tight">
                  {formatDate(story.createdAt)}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight break-words [overflow-wrap:anywhere] [word-break:break-word]">
                {story.title}
              </h1>

              {/* Author info */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-violet-500/20">
                  A
                </div>
                <div>
                  <div className="text-white font-bold tracking-tight">
                    Anonymous Member
                  </div>
                  <div className="text-white/40 text-xs font-medium">
                    Verified HerVoice Voice
                  </div>
                </div>
              </div>
            </div>

            {/* Story content container */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#0d0d1a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-violet-500/40 to-pink-500/40 rounded-l-[2rem] opacity-50" />
                <p className="text-white/90 text-xl md:text-2xl font-medium leading-[1.6] whitespace-pre-wrap break-words [overflow-wrap:anywhere] [word-break:break-word] selection:bg-pink-500/30 first-letter:text-4xl first-letter:font-black first-letter:text-violet-400">
                  {story.content}
                </p>
              </div>
            </div>

            {/* Amplify/Interaction area */}
            <div className="flex flex-col gap-8 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-lg leading-none">
                    Amplify this Voice
                  </h4>
                  <p className="text-white/40 text-sm italic">
                    Her story deserves to be heard
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <AmplifyButton
                    storyId={story.id}
                    amplifyCount={story.amplifyCount}
                  />
                  <div className="text-right">
                    <div className="text-white font-bold text-lg leading-none">
                      {story.amplifyCount}
                    </div>
                    <div className="text-white/30 text-[10px] uppercase font-black tracking-widest">
                      Amplified
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10 w-full" />

              <div className="space-y-4">
                <h3 className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                  Add your Reaction
                </h3>
                <ReactionBar story={story} />
              </div>
            </div>

            <div className="pt-10">
              <CommentSection storyId={story.id} />
            </div>
          </motion.div>

          {/* Sidebar */}
          {related.length > 0 && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6 lg:sticky lg:top-32 h-fit"
            >
              <div className="p-1 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent">
                <div className="bg-[#0a0a0f]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                  <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <span className="w-1 h-4 bg-violet-500 rounded-full" />
                    More in {story.category}
                  </h3>
                  <div className="space-y-6">
                    {related.map((r, i) => (
                      <StoryCard key={r.id} story={r} index={i} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </div>
      </div>
    </div>
  );
}
