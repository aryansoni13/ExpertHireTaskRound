"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getRecentThreads } from "@/lib/firestore";
import { FORUM_CATEGORIES, FORUM_CATEGORY_META, ForumThread } from "@/types";
import { formatDistanceToNow } from "date-fns";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

export default function ForumsPage() {
  const [recentThreads, setRecentThreads] = useState<ForumThread[]>([]);

  useEffect(() => {
    getRecentThreads(5).then(setRecentThreads);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
            Community Forums 💬
          </h1>
          <p className="text-white/40 text-lg">
            Safe spaces for real conversations
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {FORUM_CATEGORIES.map((cat, i) => {
            const meta = FORUM_CATEGORY_META[cat];
            const slug = encodeURIComponent(cat);
            return (
              <motion.div
                key={cat}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <Link href={`/forums/${slug}`}>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 hover:bg-white/8 transition-all duration-300 group cursor-pointer h-full">
                    <div className="text-4xl mb-4">{meta.icon}</div>
                    <h3 className="text-white font-bold text-xl mb-2 group-hover:text-violet-300 transition-colors">
                      {cat}
                    </h3>
                    <p className="text-white/40 text-sm">{meta.desc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Threads */}
        {recentThreads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Recent Threads
            </h2>
            <div className="space-y-3">
              {recentThreads.map((thread, i) => (
                <motion.div
                  key={thread.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Link href={`/forums/thread/${thread.id}`}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-violet-500/20 hover:bg-white/8 transition-all duration-200 flex items-center justify-between gap-4 group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {thread.isPinned && (
                            <span className="text-xs">📌</span>
                          )}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                            {thread.category}
                          </span>
                        </div>
                        <h4 className="text-white font-semibold text-sm group-hover:text-violet-300 transition-colors truncate">
                          {thread.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 text-white/30 text-xs shrink-0">
                        <span>💬 {thread.replyCount}</span>
                        <span>
                          {thread.createdAt &&
                          typeof thread.createdAt.toDate === "function"
                            ? formatDistanceToNow(thread.createdAt.toDate(), {
                                addSuffix: true,
                              })
                            : "Recent"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
