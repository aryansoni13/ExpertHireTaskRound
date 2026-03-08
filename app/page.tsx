"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getFeaturedStories, getStats } from "@/lib/firestore";
import { Story } from "@/types";
import { StoryCard } from "@/components/stories/StoryCard";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const HOW_IT_WORKS = [
  { icon: "✍️", title: "Write anonymously", desc: "No name, no photo. Your identity stays protected. Just your words." },
  { icon: "🌐", title: "Share with the community", desc: "Your story joins thousands of others — raw, real, unfiltered." },
  { icon: "⚡", title: "Get amplified", desc: "Other women amplify your voice. Your story reaches further." },
];

const FEATURES = [
  { href: "/stories", icon: "📖", title: "Stories", desc: "Share and read anonymous experiences" },
  { href: "/forums", icon: "💬", title: "Forums", desc: "Join conversations that matter" },
  { href: "/jobs", icon: "💼", title: "Jobs", desc: "Opportunities from inclusive companies" },
  { href: "/polls", icon: "📊", title: "Polls", desc: "Your opinion, anonymously" },
  { href: "/leaderboard", icon: "🏆", title: "Leaderboard", desc: "Celebrate the loudest voices" },
  { href: "/support", icon: "💜", title: "Crisis Support", desc: "Help is always here" },
];

export default function HomePage() {
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [stats, setStats] = useState<{ totalStories: number; categories: Record<string, number> } | null>(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    Promise.all([getFeaturedStories(), getStats()])
      .then(([stories, statsData]) => { setFeaturedStories(stories); setStats(statsData); })
      .finally(() => setLoadingFeatured(false));
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="orb w-[600px] h-[600px] -top-32 -left-32 bg-violet-600/20" />
          <motion.div animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="orb w-[500px] h-[500px] -bottom-32 -right-32 bg-pink-600/15" />
          <motion.div animate={{ x: [0, 20, 0], y: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }} className="orb w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-500/10" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm text-white/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Anonymous. Safe. Powerful.
          </motion.div>

          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="text-6xl md:text-8xl font-extrabold leading-[1.05] tracking-tight">
            Your Story.<br />
            <span className="gradient-text">Your Power.</span><br />
            Anonymous.
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            A sanctuary where women share their truth without fear. Career battles, health struggles, relationship storms — every story is valid, every voice amplified.
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/share"><Button variant="primary" size="lg" className="w-full sm:w-auto">Share Your Story</Button></Link>
            <Link href="/stories"><Button variant="secondary" size="lg" className="w-full sm:w-auto">Read Stories</Button></Link>
          </motion.div>

          {stats && (
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap items-center justify-center gap-8 pt-6">
              <div className="text-center"><div className="text-3xl font-bold gradient-text">{stats.totalStories}+</div><div className="text-white/40 text-sm mt-1">Stories shared</div></div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center"><div className="text-3xl font-bold gradient-text">5</div><div className="text-white/40 text-sm mt-1">Categories</div></div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center"><div className="text-3xl font-bold gradient-text">100%</div><div className="text-white/40 text-sm mt-1">Anonymous</div></div>
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0d0d1a]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-white/40 text-lg">Three steps. Zero barriers. Infinite impact.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-violet-500/30 transition-all duration-300">
                <div className="text-5xl mb-5">{step.icon}</div>
                <div className="text-sm font-bold text-violet-400 mb-2 tracking-widest uppercase">Step {i + 1}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/50 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Everything You Need ──────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white mb-4">Everything you need 🌟</h2>
            <p className="text-white/40 text-lg">One platform. Every kind of support.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.href} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                <Link href={f.href}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 hover:bg-white/8 transition-all duration-300 group h-full">
                    <div className="text-3xl mb-3">{f.icon}</div>
                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-violet-300 transition-colors">{f.title}</h3>
                    <p className="text-white/40 text-sm">{f.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Stories ─────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0d0d1a]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-3">Trending voices</h2>
              <p className="text-white/40">The most amplified stories this week</p>
            </div>
            <Link href="/stories" className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors hidden sm:block">View all →</Link>
          </motion.div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />)}
            </div>
          ) : featuredStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredStories.map((story, i) => <StoryCard key={story.id} story={story} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-white/30">
              <p className="text-lg mb-2">No stories yet.</p>
              <p className="text-sm">Be the first to share yours.</p>
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link href="/stories"><Button variant="secondary">View all stories</Button></Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-3xl p-12">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/5 to-pink-600/5" />
            <div className="relative z-10 space-y-6">
              <div className="text-5xl">💜</div>
              <h2 className="text-4xl font-bold text-white leading-tight">Ready to be heard?</h2>
              <p className="text-white/50 text-lg leading-relaxed">No name. No face. Just truth. Your story could be the one that changes someone else's life — or your own.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register"><Button variant="primary" size="lg">Join HerVoice</Button></Link>
                <Link href="/stories"><Button variant="secondary" size="lg">Browse Stories</Button></Link>
              </div>
              <p className="text-white/25 text-sm">Free forever. Anonymous always.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
