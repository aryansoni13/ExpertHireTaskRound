"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getTopStories } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { Story, REACTION_EMOJIS } from "@/types";

const TABS = ["Top Stories", "Most Reactions"] as const;
type Tab = typeof TABS[number];

const RANK_STYLES = [
  "from-amber-400 to-yellow-500 border-amber-400/40",
  "from-slate-300 to-slate-400 border-slate-300/40",
  "from-amber-600 to-orange-700 border-amber-600/40",
];

const RANK_EMOJIS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>("Top Stories");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    getTopStories(10).then((s) => {
      setStories(s);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const sorted = [...stories].sort((a, b) => {
    if (tab === "Most Reactions") {
      const aR = Object.values(a.reactions).reduce((s, v) => s + v, 0);
      const bR = Object.values(b.reactions).reduce((s, v) => s + v, 0);
      return bR - aR;
    }
    return b.amplifyCount - a.amplifyCount;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Hall of Fame 🏆</h1>
            <p className="text-white/40 text-lg">Celebrating the loudest voices in HerVoice</p>
          </div>
          <Button variant="secondary" onClick={fetchData}>↻ Refresh</Button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 mb-8 w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md" : "text-white/50 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">{[1,2,3,4,5].map((i) => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)}</div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-24 text-white/30"><div className="text-5xl mb-4">🏆</div><p>No stories yet.</p></div>
        ) : (
          <div className="space-y-3">
            {sorted.map((story, i) => {
              const totalReactions = Object.values(story.reactions).reduce((s, v) => s + v, 0);
              const isTop3 = i < 3;
              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link href={`/stories/${story.id}`}>
                    <div className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] group ${
                      isTop3
                        ? `bg-gradient-to-r ${RANK_STYLES[i].split(" border-")[0]}/10 border-${RANK_STYLES[i].split(" border-")[1].replace("/40","")}/40 hover:border-opacity-60`
                        : "bg-white/5 border-white/10 hover:border-violet-500/30"
                    }`}>
                      {/* Rank */}
                      <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg shrink-0 ${
                        isTop3 ? `bg-gradient-to-br ${RANK_STYLES[i].split(" border-")[0]} text-white` : "bg-white/10 text-white/50"
                      }`}>
                        {isTop3 ? RANK_EMOJIS[i] : `#${i + 1}`}
                      </div>

                      {/* Story info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold group-hover:text-violet-300 transition-colors truncate">{story.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">{story.category}</span>
                          <span className="text-white/30 text-xs">{story.sentimentTag}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1 text-violet-400 font-bold">
                          <span className="text-sm">📣</span>
                          <span className="text-sm">{story.amplifyCount}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-white/30 text-xs">
                          {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => (
                            <span key={type}>{emoji}{story.reactions[type as keyof typeof story.reactions]}</span>
                          ))}
                        </div>
                        <span className="text-white/20 text-xs">{totalReactions} reactions</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
