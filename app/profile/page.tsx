"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { getUserStories, deleteStory } from "@/lib/firestore";
import { updateUserEmail } from "@/lib/auth";
import { Story, REACTION_EMOJIS, ReactionType } from "@/types";
import { timeAgo } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { PageSpinner } from "@/components/ui/Spinner";
import { BADGES } from "@/lib/badges";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

function ProfileContent() {
  const { user } = useAuthStore();
  const { showNotification } = useUIStore();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    getUserStories(user.uid)
      .then(setStories)
      .finally(() => setLoading(false));
    // Fetch badges
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) setEarnedBadges(snap.data().badges ?? []);
    });
  }, [user]);

  const totalReactions = stories.reduce((total, story) => {
    return (
      total + Object.values(story.reactions).reduce((a, b) => a + b, 0)
    );
  }, 0);

  const totalAmplifies = stories.reduce(
    (total, story) => total + story.amplifyCount,
    0
  );

  const handleDelete = async (storyId: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    setDeletingId(storyId);
    try {
      await deleteStory(storyId);
      setStories((prev) => prev.filter((s) => s.id !== storyId));
      showNotification("Story deleted", "success");
    } catch {
      showNotification("Failed to delete story", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEmailUpdate = async () => {
    if (!newEmail) return;
    setUpdatingEmail(true);
    try {
      await updateUserEmail(newEmail);
      showNotification("Email updated successfully", "success");
      setShowEmailForm(false);
      setNewEmail("");
    } catch (e: any) {
      const msg =
        e.code === "auth/requires-recent-login"
          ? "Please sign out and sign back in to update your email"
          : "Failed to update email";
      showNotification(msg, "error");
    } finally {
      setUpdatingEmail(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            A
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Your Profile</h1>
            <p className="text-white/40 text-sm mt-1">
              {user?.email ?? "Anonymous"}
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { label: "Stories shared", value: stories.length },
            { label: "Total reactions", value: totalReactions },
            { label: "Total amplifies", value: totalAmplifies },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center"
            >
              <div className="text-3xl font-extrabold gradient-text">
                {stat.value}
              </div>
              <div className="text-white/40 text-xs mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* My Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">My Stories</h2>
            <Link href="/share">
              <Button variant="primary" size="sm">
                + New story
              </Button>
            </Link>
          </div>

          {stories.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-white/40 text-lg mb-2">No stories yet</p>
              <p className="text-white/20 text-sm mb-6">
                Share your first story — anonymously, safely.
              </p>
              <Link href="/share">
                <Button variant="primary">Share your story</Button>
              </Link>
            </div>
          ) : (
            <AnimatePresence>
              {stories.map((story, i) => {
                const reactionTotal = Object.values(story.reactions).reduce(
                  (a, b) => a + b,
                  0
                );
                return (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={story.status} />
                          <span className="text-white/30 text-xs">
                            {timeAgo(story.createdAt)}
                          </span>
                        </div>
                        <Link href={`/stories/${story.id}`}>
                          <h3 className="font-bold text-white hover:text-violet-300 transition-colors line-clamp-1">
                            {story.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-3">
                            {(
                              Object.entries(story.reactions) as [
                                ReactionType,
                                number
                              ][]
                            )
                              .filter(([, count]) => count > 0)
                              .map(([type, count]) => (
                                <span
                                  key={type}
                                  className="flex items-center gap-1"
                                >
                                  <span>{REACTION_EMOJIS[type]}</span>
                                  <span className="text-white/40 text-xs">
                                    {count}
                                  </span>
                                </span>
                              ))}
                            {reactionTotal === 0 && (
                              <span className="text-white/20 text-xs">
                                No reactions yet
                              </span>
                            )}
                          </div>
                          <span className="text-white/30 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {story.amplifyCount}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={deletingId === story.id}
                        onClick={() => handleDelete(story.id)}
                        className="shrink-0"
                      >
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-5">My Badges 🏅</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BADGES.map((badge) => {
              const earned = earnedBadges.includes(badge.id);
              return (
                <div key={badge.id} className={`rounded-xl border p-3 text-center transition-all ${earned ? "bg-violet-500/10 border-violet-500/30 shadow-sm shadow-violet-500/10" : "bg-white/5 border-white/10 opacity-40 grayscale"}`}>
                  <div className="text-2xl mb-1">{earned ? badge.emoji : "🔒"}</div>
                  <div className="text-white text-xs font-semibold mb-0.5">{badge.label}</div>
                  <div className="text-white/40 text-xs">{badge.desc}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-white">Account Settings</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="text-white/70 text-sm font-medium">Email</p>
                <p className="text-white/40 text-xs mt-0.5">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmailForm((v) => !v)}
              >
                Change
              </Button>
            </div>

            <AnimatePresence>
              {showEmailForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-3 pt-2">
                    <Input
                      type="email"
                      placeholder="New email address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleEmailUpdate}
                      loading={updatingEmail}
                    >
                      Update
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-white/70 text-sm font-medium">Identity</p>
                <p className="text-white/40 text-xs mt-0.5">
                  Always anonymous to other users
                </p>
              </div>
              <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                Protected
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
