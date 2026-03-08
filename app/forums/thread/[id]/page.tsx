"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getThread,
  incrementThreadViews,
  subscribeToReplies,
  addForumReply,
  likeReply,
} from "@/lib/firestore";
import { checkAndAwardBadges } from "@/lib/badges";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { ForumThread, ForumReply } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function ThreadPage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuthStore();
  const { showNotification } = useUIStore();
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    getThread(id).then((t) => {
      setThread(t);
      if (t) incrementThreadViews(id);
    });
    const unsub = subscribeToReplies(id, setReplies);
    return unsub;
  }, [id]);

  const handleReply = async () => {
    if (!user || !replyContent.trim()) return;
    setSubmitting(true);
    try {
      await addForumReply(id, user.uid, replyContent);
      await checkAndAwardBadges(user.uid, "forum_reply");
      setReplyContent("");
      showNotification("Reply posted! 💬", "success");
    } catch {
      showNotification("Failed to post reply.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (replyId: string) => {
    if (!user) {
      showNotification("Sign in to like replies", "error");
      return;
    }
    await likeReply(id, replyId, user.uid);
    setLikedReplies((prev) => {
      const next = new Set(prev);
      next.has(replyId) ? next.delete(replyId) : next.add(replyId);
      return next;
    });
  };

  if (!thread)
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-white/30 text-center">
          <div className="text-5xl mb-4">💬</div>
          <p>Loading thread...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/forums/${encodeURIComponent(thread.category)}`}
          className="text-white/40 text-sm hover:text-white/70 transition-colors mb-6 inline-block"
        >
          ← {thread.category}
        </Link>

        {/* Thread */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            {thread.isPinned && <span>📌</span>}
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {thread.category}
            </span>
            <span className="text-white/30 text-xs">
              Anonymous #{thread.authorId.slice(-4)}
            </span>
            <span className="text-white/20 text-xs ml-auto">
              {thread.createdAt
                ? formatDistanceToNow(thread.createdAt.toDate(), {
                    addSuffix: true,
                  })
                : ""}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4 break-words [overflow-wrap:anywhere]">
            {thread.title}
          </h1>
          <p className="text-white/60 leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {thread.content}
          </p>
          <div className="flex gap-4 mt-4 text-white/30 text-xs border-t border-white/10 pt-4">
            <span>💬 {thread.replyCount} replies</span>
            <span>👁 {thread.views} views</span>
          </div>
        </motion.div>

        {/* Replies */}
        <h2 className="text-white font-semibold text-lg mb-4">
          Replies ({replies.length})
        </h2>
        <div className="space-y-4 mb-8">
          {replies.map((reply, i) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/30 text-xs">
                  Anonymous #{reply.authorId.slice(-4)}
                </span>
                <span className="text-white/20 text-xs">
                  {reply.createdAt
                    ? formatDistanceToNow(reply.createdAt.toDate(), {
                        addSuffix: true,
                      })
                    : ""}
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed break-words [overflow-wrap:anywhere]">
                {reply.content}
              </p>
              <button
                onClick={() => handleLike(reply.id)}
                className={`mt-3 flex items-center gap-1 text-xs transition-colors ${likedReplies.has(reply.id) ? "text-pink-400" : "text-white/30 hover:text-pink-400"}`}
              >
                ❤️ {reply.likes}
              </button>
            </motion.div>
          ))}
          {replies.length === 0 && (
            <p className="text-white/30 text-sm text-center py-8">
              No replies yet. Be the first!
            </p>
          )}
        </div>

        {/* Reply Form */}
        {user ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3 text-sm">
              Add a Reply
            </h3>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Share your thoughts anonymously..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 resize-none mb-3"
            />
            <Button
              variant="primary"
              onClick={handleReply}
              loading={submitting}
              disabled={!replyContent.trim()}
            >
              Post Reply
            </Button>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-white/40 mb-3">
              Sign in to join the conversation
            </p>
            <Link href="/login">
              <Button variant="primary">Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
