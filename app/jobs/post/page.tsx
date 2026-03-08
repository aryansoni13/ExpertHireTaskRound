"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/Button";
import { addJob } from "@/lib/firestore";
import { checkAndAwardBadges } from "@/lib/badges";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { JOB_CATEGORIES, JOB_TYPES, JOB_LOCATIONS } from "@/types";

const schema = z.object({
  title: z.string().min(3, "Job title required"),
  company: z.string().min(2, "Company name required"),
  location: z.enum(["Remote", "Hybrid", "On-site"]),
  type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  category: z.enum(["Engineering", "Design", "Product", "Marketing", "Data", "Other"]),
  description: z.string().min(20, "Please write a description"),
  applyUrl: z.string().url("Must be a valid URL"),
  tags: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function PostJobPage() {
  return <AuthGuard><PostJobForm /></AuthGuard>;
}

function PostJobForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showNotification } = useUIStore();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { location: "Remote", type: "Full-time", category: "Engineering" },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const tags = data.tags.split(",").map((t) => t.trim()).filter(Boolean);
      await addJob({ ...data, tags, featured: false, status: "active", postedBy: user.uid }, user.uid);
      await checkAndAwardBadges(user.uid, "job_posted");
      showNotification("Job posted successfully! 💼", "success");
      router.push("/jobs");
    } catch {
      showNotification("Failed to post job. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition-colors";
  const labelCls = "block text-white/70 text-sm font-medium mb-2";
  const errorCls = "text-red-400 text-xs mt-1";

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-extrabold text-white mb-2">Post a Job 💼</h1>
          <p className="text-white/40 mb-10">Help women find inclusive opportunities</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
              <div>
                <label className={labelCls}>Job Title</label>
                <input {...register("title")} className={inputCls} placeholder="e.g. Senior Frontend Engineer" />
                {errors.title && <p className={errorCls}>{errors.title.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Company Name</label>
                <input {...register("company")} className={inputCls} placeholder="e.g. Acme Inc." />
                {errors.company && <p className={errorCls}>{errors.company.message}</p>}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Location</label>
                  <select {...register("location")} className={inputCls}>
                    {JOB_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Type</label>
                  <select {...register("type")} className={inputCls}>
                    {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select {...register("category")} className={inputCls}>
                    {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea {...register("description")} rows={5} className={inputCls} placeholder="Describe the role, responsibilities, and what makes your company women-friendly..." />
                {errors.description && <p className={errorCls}>{errors.description.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Apply URL</label>
                <input {...register("applyUrl")} className={inputCls} placeholder="https://company.com/careers/job-id" />
                {errors.applyUrl && <p className={errorCls}>{errors.applyUrl.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Tags <span className="text-white/30">(comma-separated)</span></label>
                <input {...register("tags")} className={inputCls} placeholder="React, TypeScript, Entry-level, Mentorship..." />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
              Post Job
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
