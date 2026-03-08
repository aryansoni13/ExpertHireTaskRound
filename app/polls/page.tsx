"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addDays } from "date-fns";
import { Timestamp } from "firebase/firestore";
import {
  subscribeToPolls,
  addPoll,
  castVote,
  getUserVote,
} from "@/lib/firestore";
import { checkAndAwardBadges } from "@/lib/badges";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Poll, PollOption } from "@/types";
import { formatDistanceToNow } from "date-fns";

const DURATIONS = [
  { label: "3 days", days: 3 },
  { label: "7 days", days: 7 },
  { label: "14 days", days: 14 },
];

const POLL_CATS = ["Career", "Health", "Relationships", "Tech", "General"];

export default function PollsPage() {
  const { user } = useAuthStore();
  const { showNotification } = useUIStore();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [category, setCategory] = useState("General");
  const [duration, setDuration] = useState(7);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsub = subscribeToPolls((p) => {
      setPolls(p);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user || polls.length === 0) return;
    polls.forEach(async (poll) => {
      const vote = await getUserVote(poll.id, user.uid);
      if (vote) setUserVotes((prev) => ({ ...prev, [poll.id]: vote }));
    });
  }, [polls, user]);

  const handleVote = async (pollId: string, optionId: string) => {
    if (!user) {
      showNotification("Sign in to vote", "error");
      return;
    }
    if (userVotes[pollId]) {
      showNotification("You already voted on this poll", "error");
      return;
    }
    await castVote(pollId, user.uid, optionId);
    setUserVotes((prev) => ({ ...prev, [pollId]: optionId }));
    showNotification("Vote cast! 📊", "success");
  };

  const handleCreatePoll = async () => {
    if (!user || !question.trim() || options.filter((o) => o.trim()).length < 2)
      return;
    setSubmitting(true);
    try {
      const pollOptions: PollOption[] = options
        .filter((o) => o.trim())
        .map((text, i) => ({ id: `opt_${i}`, text, votes: 0 }));
      const endsAt = Timestamp.fromDate(addDays(new Date(), duration));
      await addPoll(
        { question, options: pollOptions, category, endsAt },
        user.uid,
      );
      await checkAndAwardBadges(user.uid, "poll_created");
      showNotification("Poll created! 📊", "success");
      setShowModal(false);
      setQuestion("");
      setOptions(["", ""]);
      setCategory("General");
      setDuration(7);
    } catch {
      showNotification("Failed to create poll.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
              Community Polls 📊
            </h1>
            <p className="text-white/40 text-lg">
              Anonymous votes, real insights
            </p>
          </div>
          {user && (
            <Button variant="primary" onClick={() => setShowModal(true)}>
              + Create Poll
            </Button>
          )}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-lg">No polls yet. Create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {polls.map((poll, i) => {
              const voted = userVotes[poll.id];
              const isExpired =
                poll.endsAt &&
                typeof poll.endsAt.toDate === "function" &&
                poll.endsAt.toDate() < new Date();
              return (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <h3 className="text-white font-bold text-lg leading-snug">
                      {poll.question}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 shrink-0">
                      {poll.category}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {poll.options.map((opt) => {
                      const pct =
                        poll.totalVotes > 0
                          ? Math.round((opt.votes / poll.totalVotes) * 100)
                          : 0;
                      const isWinner =
                        voted || isExpired
                          ? poll.options.every((o) => opt.votes >= o.votes)
                          : false;
                      const isMyVote = voted === opt.id;
                      return (
                        <div key={opt.id}>
                          <button
                            onClick={() => handleVote(poll.id, opt.id)}
                            disabled={!!voted || isExpired}
                            className={`w-full text-left rounded-xl border p-3 text-sm transition-all ${
                              isMyVote
                                ? "border-violet-500/60 bg-violet-500/20 text-white"
                                : voted || isExpired
                                  ? "border-white/10 bg-white/5 text-white/60"
                                  : "border-white/10 bg-white/5 text-white/70 hover:border-violet-500/30 hover:bg-violet-500/10 cursor-pointer"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="font-medium">{opt.text}</span>
                              {(voted || isExpired) && (
                                <span className="text-white/50">{pct}%</span>
                              )}
                            </div>
                            {(voted || isExpired) && (
                              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.6 }}
                                  className={`h-full rounded-full ${isWinner ? "bg-gradient-to-r from-violet-500 to-pink-500" : "bg-white/30"}`}
                                />
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-white/30 text-xs border-t border-white/10 pt-3">
                    <span>{poll.totalVotes} votes</span>
                    <span>
                      {isExpired
                        ? "Closed"
                        : poll.endsAt &&
                            typeof poll.endsAt.toDate === "function"
                          ? `Closes ${formatDistanceToNow(poll.endsAt.toDate(), { addSuffix: true })}`
                          : ""}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Poll Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-white font-bold text-xl mb-5">
                Create a Poll
              </h2>
              <div className="space-y-4">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Your question..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50"
                />
                <div>
                  <label className="text-white/50 text-xs mb-2 block">
                    Options
                  </label>
                  {options.map((opt, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        value={opt}
                        onChange={(e) => {
                          const n = [...options];
                          n[i] = e.target.value;
                          setOptions(n);
                        }}
                        placeholder={`Option ${i + 1}`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50"
                      />
                      {options.length > 2 && (
                        <button
                          onClick={() =>
                            setOptions(options.filter((_, j) => j !== i))
                          }
                          className="text-red-400 hover:text-red-300 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {options.length < 4 && (
                    <button
                      onClick={() => setOptions([...options, ""])}
                      className="text-violet-400 text-sm hover:text-violet-300 transition-colors"
                    >
                      + Add option
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/50 text-xs mb-2 block">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
                    >
                      {POLL_CATS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/50 text-xs mb-2 block">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
                    >
                      {DURATIONS.map((d) => (
                        <option key={d.days} value={d.days}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreatePoll}
                  loading={submitting}
                  disabled={
                    !question.trim() ||
                    options.filter((o) => o.trim()).length < 2
                  }
                  className="flex-1"
                >
                  Create Poll
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
