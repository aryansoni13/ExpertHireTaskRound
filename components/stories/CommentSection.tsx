"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useComments } from "@/hooks/useComments";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

interface CommentSectionProps {
  storyId: string;
}

export function CommentSection({ storyId }: CommentSectionProps) {
  const { user } = useAuthStore();
  const { comments, loading, submit, submitting } = useComments(storyId);
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await submit(text);
    setText("");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <span>Community Voices</span>
        <span className="text-sm font-normal text-white/40 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
          {comments.length}
        </span>
      </h3>

      {/* Comment form */}
      {user ? (
        <div className="bg-[#0d0d1a]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts, support, or solidarity..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
              {text.length} / 500
            </span>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!text.trim() || text.length > 500}
              className="px-6 shadow-lg shadow-violet-500/20"
            >
              Post Voice
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 text-center border-dashed">
          <p className="text-white/40 text-sm mb-4 font-medium">
            Join the conversation and amplify this voice
          </p>
          <Link href="/login">
            <Button
              size="sm"
              variant="primary"
              className="px-8 shadow-xl shadow-violet-500/10"
            >
              Sign in to Comment
            </Button>
          </Link>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-24 bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        <AnimatePresence initial={false}>
          {comments.map((comment, i) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group bg-white/3 hover:bg-white/5 border border-white/8 hover:border-white/20 rounded-2xl p-6 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                    <span className="text-white/80 text-xs font-bold uppercase">
                      A
                    </span>
                  </div>
                  <div>
                    <span className="text-white font-bold text-xs block leading-none mb-0.5">
                      Anonymous Member
                    </span>
                    <span className="text-white/20 text-[10px] font-black uppercase tracking-wider">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed break-words [overflow-wrap:anywhere] [word-break:break-word] selection:bg-violet-500/30">
                {comment.content}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && comments.length === 0 && (
          <div className="text-center py-12 bg-white/2 border border-white/5 rounded-3xl border-dashed">
            <div className="text-3xl mb-3 opacity-20">💜</div>
            <p className="text-white/30 text-sm font-medium italic">
              Be the first to show support
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
