"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { addAmplify, hasAmplified } from "@/lib/firestore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useRouter } from "next/navigation";

interface AmplifyButtonProps {
  storyId: string;
  amplifyCount: number;
}

export function AmplifyButton({ storyId, amplifyCount }: AmplifyButtonProps) {
  const { user } = useAuthStore();
  const { showNotification } = useUIStore();
  const router = useRouter();
  const [amplified, setAmplified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localCount, setLocalCount] = useState(amplifyCount);

  useEffect(() => {
    if (user) {
      hasAmplified(storyId, user.uid).then(setAmplified);
    }
  }, [storyId, user]);

  useEffect(() => {
    setLocalCount(amplifyCount);
  }, [amplifyCount]);

  const handleAmplify = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (amplified) {
      showNotification("You've already amplified this story", "success");
      return;
    }
    setLoading(true);
    try {
      const success = await addAmplify(storyId, user.uid);
      if (success) {
        setAmplified(true);
        setLocalCount((c) => c + 1);
        showNotification("Story amplified! 🔥", "success");
      }
    } catch (e) {
      showNotification("Failed to amplify", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleAmplify}
      disabled={loading}
      className={`flex items-center gap-3 px-6 py-3 rounded-xl border font-semibold text-sm transition-all duration-200 ${
        amplified
          ? "bg-gradient-to-r from-violet-500/30 to-pink-500/30 border-violet-500/50 text-violet-300 shadow-lg shadow-violet-500/20"
          : "bg-white/5 border-white/15 text-white/80 hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-pink-600/20 hover:border-violet-500/40 hover:text-white"
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>{amplified ? "Amplified" : "Amplify"}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${amplified ? "bg-violet-500/30 text-violet-300" : "bg-white/10 text-white/40"}`}>
        {localCount}
      </span>
    </motion.button>
  );
}
