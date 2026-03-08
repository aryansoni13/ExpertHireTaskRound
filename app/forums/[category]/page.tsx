"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToThreads, addThread } from "@/lib/firestore";
import { checkAndAwardBadges } from "@/lib/badges";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { ForumThread, ForumCategory, FORUM_CATEGORY_META } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function ForumCategoryPage() {
  const params = useParams();
  const category = decodeURIComponent(params.category as string) as ForumCategory;
  const { user } = useAuthStore();
  const { showNotification } = useUIStore();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const meta = FORUM_CATEGORY_META[category];

  useEffect(() => {
    const unsub = subscribeToThreads(category, (t) => { setThreads(t); setLoading(false); });
    return unsub;
  }, [category]);

  const handleSubmit = async () => {
    if (!user || !title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      await addThread({ title, content, category }, user.uid);
      await checkAndAwardBadges(user.uid, "forum_thread");
      showNotification("Thread posted! 💬", "success");
      setTitle(""); setContent(""); setShowModal(false);
    } catch { showNotification("Failed to post thread.", "error"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-10 gap-4">
          <div>
            <Link href="/forums" className="text-white/40 text-sm hover:text-white/70 transition-colors mb-2 inline-block">← Back to Forums</Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              {meta?.icon} {category}
            </h1>
            <p className="text-white/40 mt-1">{meta?.desc}</p>
          </div>
          {user ? (
            <Button variant="primary" onClick={() => setShowModal(true)}>+ New Thread</Button>
          ) : (
            <Link href="/login"><Button variant="secondary">Sign in to post</Button></Link>
          )}
        </motion.div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}</div>
        ) : threads.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-lg mb-2">No threads yet in this forum.</p>
            {user && <Button variant="primary" onClick={() => setShowModal(true)} className="mt-4">Start the first thread</Button>}
          </div>
        ) : (
          <div className="space-y-3">
            {threads.map((thread, i) => (
              <motion.div key={thread.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/forums/thread/${thread.id}`}>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-violet-500/30 hover:bg-white/8 transition-all group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {thread.isPinned && <span className="text-sm">📌</span>}
                          <span className="text-white/30 text-xs">Anonymous #{thread.authorId.slice(-4)}</span>
                        </div>
                        <h3 className="text-white font-semibold group-hover:text-violet-300 transition-colors">{thread.title}</h3>
                        <p className="text-white/40 text-sm mt-1 line-clamp-2">{thread.content}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-white/30 text-xs shrink-0">
                        <span>💬 {thread.replyCount}</span>
                        <span>👁 {thread.views}</span>
                        <span>{thread.createdAt ? formatDistanceToNow(thread.createdAt.toDate(), { addSuffix: true }) : ""}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* New Thread Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
              <h2 className="text-white font-bold text-xl mb-5">Start a New Thread</h2>
              <div className="space-y-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Thread title..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 resize-none"
                />
              </div>
              <div className="flex gap-3 mt-5">
                <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} loading={submitting} disabled={!title.trim() || !content.trim()} className="flex-1">Post Thread</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
