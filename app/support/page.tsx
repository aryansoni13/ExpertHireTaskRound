"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const RESOURCES = [
  { name: "iCall", phone: "9152987821", desc: "Psychological counselling by trained professionals", hours: "Mon–Sat, 8am–10pm", color: "from-violet-500/20 to-purple-500/20 border-violet-500/30" },
  { name: "Vandrevala Foundation", phone: "1860-2662-345", desc: "24/7 mental health helpline", hours: "24/7", color: "from-pink-500/20 to-rose-500/20 border-pink-500/30" },
  { name: "Snehi", phone: "044-24640050", desc: "Emotional support and crisis intervention", hours: "24/7", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30" },
  { name: "iMind", phone: "4422 2771", desc: "Mental wellness support", hours: "Mon–Fri, 9am–6pm", color: "from-teal-500/20 to-emerald-500/20 border-teal-500/30" },
  { name: "NCW Helpline", phone: "7827170170", desc: "National Commission for Women support", hours: "24/7", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30" },
  { name: "Women Helpline", phone: "1091", desc: "National women in distress helpline", hours: "24/7", color: "from-rose-500/20 to-red-500/20 border-rose-500/30" },
  { name: "Police Emergency", phone: "100", desc: "Immediate emergency response", hours: "24/7", color: "from-red-500/20 to-rose-600/20 border-red-500/40" },
];

const AFFIRMATIONS = [
  "You are stronger than you know. 💜",
  "This moment will pass. You are safe.",
  "You deserve care, rest, and peace.",
  "Your feelings are valid. You matter.",
  "You are not alone in this.",
  "Asking for help is an act of courage.",
];

const TOOLKIT_ITEMS = [
  {
    id: "breathing",
    title: "4-7-8 Breathing",
    emoji: "🫁",
    content: null,
  },
  {
    id: "grounding",
    title: "5-4-3-2-1 Grounding",
    emoji: "🌿",
    content: [
      "👁 Name 5 things you can SEE",
      "✋ Name 4 things you can TOUCH",
      "👂 Name 3 things you can HEAR",
      "👃 Name 2 things you can SMELL",
      "👅 Name 1 thing you can TASTE",
    ],
  },
  {
    id: "journaling",
    title: "Journaling Prompts",
    emoji: "📖",
    content: [
      "What am I feeling right now, without judgment?",
      "What do I need most in this moment?",
      "Name one small thing that brought comfort today.",
      "What would I say to a friend going through this?",
      "What can I let go of today?",
    ],
  },
];

function BreathingCircle() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(4);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const phases = [
      { name: "inhale" as const, duration: 4 },
      { name: "hold" as const, duration: 7 },
      { name: "exhale" as const, duration: 8 },
    ];
    let phaseIdx = 0;
    let timer: NodeJS.Timeout;
    const runPhase = () => {
      const p = phases[phaseIdx % 3];
      setPhase(p.name);
      setCount(p.duration);
      let remaining = p.duration;
      timer = setInterval(() => {
        remaining--;
        setCount(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
          phaseIdx++;
          runPhase();
        }
      }, 1000);
    };
    runPhase();
    return () => clearInterval(timer);
  }, [running]);

  const phaseLabels = { inhale: "Breathe In", hold: "Hold", exhale: "Breathe Out" };
  const phaseColors = { inhale: "from-violet-500 to-blue-500", hold: "from-blue-500 to-teal-500", exhale: "from-teal-500 to-emerald-500" };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={running ? {
            scale: phase === "inhale" ? 1.6 : phase === "hold" ? 1.6 : 1,
            opacity: phase === "exhale" ? 0.5 : 1,
          } : { scale: 1 }}
          transition={{ duration: phase === "inhale" ? 4 : phase === "hold" ? 0.2 : 8, ease: "easeInOut" }}
          className={`w-28 h-28 rounded-full bg-gradient-to-br ${phaseColors[phase]} opacity-30`}
        />
        <div className="absolute text-center">
          <div className="text-white font-bold text-2xl">{running ? count : "✿"}</div>
          <div className="text-white/60 text-xs mt-1">{running ? phaseLabels[phase] : "Ready"}</div>
        </div>
      </div>
      <Button variant={running ? "secondary" : "primary"} size="sm" onClick={() => setRunning((v) => !v)}>
        {running ? "Stop" : "Start Breathing Exercise"}
      </Button>
    </div>
  );
}

function AffirmationCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % AFFIRMATIONS.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-center py-4 min-h-[60px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="text-white/80 text-lg font-medium italic">
          "{AFFIRMATIONS[idx]}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default function SupportPage() {
  const [openToolkit, setOpenToolkit] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-3xl p-12">
          <div className="text-6xl mb-4">💜</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">You Are Not Alone</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            If you're going through something difficult, help is available right now. You deserve support.
          </p>
        </motion.div>

        {/* Emergency Resources */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Emergency Resources 📞</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RESOURCES.map((r, i) => (
              <motion.div key={r.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className={`bg-gradient-to-br ${r.color} rounded-2xl p-5 border`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white font-bold">{r.name}</h3>
                  <span className="text-white/40 text-xs shrink-0">{r.hours}</span>
                </div>
                <p className="text-white/60 text-sm mb-3">{r.desc}</p>
                <a href={`tel:${r.phone.replace(/[-\s]/g, "")}`}>
                  <Button variant="primary" size="sm" className="w-full">
                    📞 Call {r.phone}
                  </Button>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Self-Care Toolkit */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Self-Care Toolkit 🧘</h2>
          <div className="space-y-3">
            {TOOLKIT_ITEMS.map((item) => (
              <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenToolkit(openToolkit === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-white font-semibold">{item.title}</span>
                  </div>
                  <span className="text-white/40 text-lg">{openToolkit === item.id ? "↑" : "↓"}</span>
                </button>
                <AnimatePresence>
                  {openToolkit === item.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-5 pb-5 border-t border-white/10 pt-4">
                        {item.id === "breathing" ? (
                          <BreathingCircle />
                        ) : (
                          <ul className="space-y-2">
                            {(item.content as string[]).map((line, i) => (
                              <li key={i} className="text-white/60 text-sm flex items-start gap-2">{line}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Affirmations */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">Daily Affirmations ✨</h2>
          <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-2xl p-6">
            <AffirmationCarousel />
          </div>
        </motion.section>

        {/* Community Link */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-white font-bold text-xl mb-2">Talk to the Community</h3>
            <p className="text-white/50 text-sm mb-4">Our Mental Health forum is a safe, anonymous space to share and be heard.</p>
            <Link href={`/forums/${encodeURIComponent("Mental Health")}`}>
              <Button variant="primary">Open Mental Health Forum</Button>
            </Link>
          </div>
        </motion.section>

        {/* Disclaimer */}
        <p className="text-white/25 text-xs text-center leading-relaxed">
          HerVoice is a community platform and not a substitute for professional help.
          If you are in immediate danger, please call emergency services (100) immediately.
        </p>
      </div>
    </div>
  );
}
