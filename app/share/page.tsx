"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { addStory } from "@/lib/firestore";
import { detectSentiment } from "@/lib/sentiment";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { CATEGORIES, Category } from "@/types";

const DRAFT_KEY = "hervoice_draft";
const MAX_CHARS = 5000;

const step1Schema = z.object({
  category: z.enum(["Career", "Health", "Relationships", "Wins", "Struggles"]),
  title: z.string().min(5, "Title must be at least 5 characters").max(120),
});

const step2Schema = z.object({
  content: z
    .string()
    .min(100, "Please write at least 100 characters")
    .max(MAX_CHARS, `Maximum ${MAX_CHARS} characters`),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const TRIGGER_WARNING_OPTIONS = [
  "Mental health",
  "Sexual violence",
  "Domestic abuse",
  "Pregnancy loss",
  "Eating disorders",
  "Substance use",
  "Grief",
];

function SharePageContent() {
  const { user } = useAuthStore();
  const { showNotification } = useUIStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [selectedWarnings, setSelectedWarnings] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Restore draft
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.step1) setStep1Data(draft.step1);
        if (draft.step2) setStep2Data(draft.step2);
      } catch {}
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ step1: step1Data, step2: step2Data }));
  }, [step1Data, step2Data]);

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: step1Data || { category: "Struggles", title: "" },
  });

  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: step2Data || { content: "" },
  });

  const content = form2.watch("content");

  const handleStep1 = form1.handleSubmit((data) => {
    setStep1Data(data);
    setStep(2);
  });

  const handleStep2 = form2.handleSubmit((data) => {
    setStep2Data(data);
    setStep(3);
  });

  const handleSubmit = async () => {
    if (!user || !step1Data || !step2Data) return;
    setSubmitting(true);
    try {
      const sentimentTag = detectSentiment(step2Data.content);
      const id = await addStory(
        {
          title: step1Data.title,
          content: step2Data.content,
          category: step1Data.category as Category,
          sentimentTag,
          authorId: user.uid,
          status: "pending",
        },
        user.uid
      );
      localStorage.removeItem(DRAFT_KEY);
      showNotification("Your story has been published! 💜", "success");
      router.push(`/stories/${id}`);
    } catch (e: any) {
      showNotification(e.message ?? "Failed to publish story", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Share Your <span className="gradient-text">Story</span>
          </h1>
          <p className="text-white/40">Anonymous. Safe. Yours.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step === s
                    ? "bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/30"
                    : step > s
                    ? "bg-violet-500/30 text-violet-300 border border-violet-500/30"
                    : "bg-white/5 text-white/30 border border-white/10"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              <div className="hidden sm:block">
                <div className={`text-xs font-medium ${step >= s ? "text-white/70" : "text-white/25"}`}>
                  {s === 1 ? "Category & Title" : s === 2 ? "Your Story" : "Finalize"}
                </div>
              </div>
              {s < 3 && (
                <div className={`flex-1 h-px ${step > s ? "bg-violet-500/40" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <form onSubmit={handleStep1} className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                  {/* Category selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/70">
                      Choose a category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => form1.setValue("category", cat as any)}
                          className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                            form1.watch("category") === cat
                              ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                              : "bg-white/3 border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    {form1.formState.errors.category && (
                      <p className="text-xs text-red-400">
                        {form1.formState.errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <Input
                    label="Give your story a title"
                    placeholder="e.g. How I rebuilt my life after being let go..."
                    error={form1.formState.errors.title?.message}
                    {...form1.register("title")}
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Continue →
                </Button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <form onSubmit={handleStep2} className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/70">
                      Tell your story
                    </label>
                    <span className={`text-xs ${content?.length > MAX_CHARS * 0.9 ? "text-amber-400" : "text-white/30"}`}>
                      {content?.length ?? 0}/{MAX_CHARS}
                    </span>
                  </div>
                  <Textarea
                    placeholder="Share what happened, how you felt, what you learned. This is your space — write freely and honestly..."
                    rows={14}
                    error={form2.formState.errors.content?.message}
                    {...form2.register("content")}
                  />
                  <p className="text-xs text-white/30">
                    Minimum 100 characters. Your story will be published anonymously.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </Button>
                  <Button type="submit" variant="primary" size="lg" className="flex-2 flex-grow">
                    Continue →
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Preview */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider">
                  Preview
                </h3>
                <h2 className="text-2xl font-bold text-white">{step1Data?.title}</h2>
                <span className="inline-block bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs px-3 py-1 rounded-full">
                  {step1Data?.category}
                </span>
                <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                  {step2Data?.content}
                </p>
                <div className="flex items-center gap-2 text-white/30 text-xs">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-[10px]">A</span>
                  Anonymous • Just now
                </div>
              </div>

              {/* Trigger warnings */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="text-white/80 font-semibold mb-1">
                    Trigger warnings
                  </h3>
                  <p className="text-white/40 text-sm">
                    Optional — select any that apply to help readers prepare.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRIGGER_WARNING_OPTIONS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() =>
                        setSelectedWarnings((prev) =>
                          prev.includes(w)
                            ? prev.filter((x) => x !== w)
                            : [...prev, w]
                        )
                      }
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedWarnings.includes(w)
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                          : "bg-white/3 border-white/10 text-white/40 hover:border-white/20"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy reminder */}
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-5 flex gap-4">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="text-violet-200 font-medium text-sm">
                    Your anonymity is protected
                  </p>
                  <p className="text-violet-300/60 text-xs mt-1">
                    Your name and identity will never be shown. This story is yours.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(2)}
                >
                  ← Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-grow"
                  onClick={handleSubmit}
                  loading={submitting}
                >
                  Publish Story
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <AuthGuard>
      <SharePageContent />
    </AuthGuard>
  );
}
