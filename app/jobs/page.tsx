"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { getJobs } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import {
  Job,
  JOB_CATEGORIES,
  JOB_TYPES,
  JOB_LOCATIONS,
  JobCategory,
  JobType,
  JobLocation,
} from "@/types";
import { formatDistanceToNow } from "date-fns";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

const TYPE_COLORS: Record<string, string> = {
  "Full-time": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Part-time": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Contract: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Internship: "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

const LOC_COLORS: Record<string, string> = {
  Remote: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Hybrid: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "On-site": "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<JobCategory | "">("");
  const [filterType, setFilterType] = useState<JobType | "">("");
  const [filterLoc, setFilterLoc] = useState<JobLocation | "">("");

  useEffect(() => {
    getJobs(
      filterCat || undefined,
      filterType || undefined,
      filterLoc || undefined,
    )
      .then(setJobs)
      .finally(() => setLoading(false));
  }, [filterCat, filterType, filterLoc]);

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    return (
      !q ||
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q)
    );
  });

  const featured = filtered.filter((j) => j.featured);
  const regular = filtered.filter((j) => !j.featured);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
              Women in Tech Jobs 💼
            </h1>
            <p className="text-white/40 text-lg">
              Opportunities from companies that value you
            </p>
          </div>
          {user && (
            <Link href="/jobs/post">
              <Button variant="primary">+ Post a Job</Button>
            </Link>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex flex-wrap gap-3"
        >
          <input
            type="text"
            placeholder="Search by title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50"
          />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
          >
            <option value="">All Categories</option>
            {JOB_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
          >
            <option value="">All Types</option>
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={filterLoc}
            onChange={(e) => setFilterLoc(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
          >
            <option value="">All Locations</option>
            {JOB_LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-52 bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <div className="text-5xl mb-4">💼</div>
            <p className="text-lg mb-2">No jobs found.</p>
            {user && (
              <Link href="/jobs/post">
                <Button variant="primary" className="mt-4">
                  Post the first job
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="mb-10">
                <h2 className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-4">
                  ⭐ Featured
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featured.map((job, i) => (
                    <JobCard key={job.id} job={job} index={i} />
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regular.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.08, duration: 0.5 },
        }),
      }}
      className={`bg-white/5 backdrop-blur-md border rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300 flex flex-col gap-4 ${
        job.featured
          ? "border-violet-500/40 shadow-lg shadow-violet-500/10"
          : "border-white/10"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {job.featured && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                ⭐ Featured
              </span>
            )}
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[job.type] ?? "bg-white/10 text-white/60"}`}
            >
              {job.type}
            </span>
          </div>
          <h3 className="text-white font-bold text-lg leading-tight break-words [overflow-wrap:anywhere]">
            {job.title}
          </h3>
          <p className="text-white/50 text-sm mt-1 break-words [overflow-wrap:anywhere]">
            {job.company}
          </p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${LOC_COLORS[job.location] ?? "bg-white/10 text-white/60"}`}
        >
          {job.location}
        </span>
      </div>

      <p className="text-white/40 text-sm leading-relaxed line-clamp-3 break-words [overflow-wrap:anywhere]">
        {job.description}
      </p>

      {job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {job.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <span className="text-white/30 text-xs">
          {job.createdAt
            ? formatDistanceToNow(job.createdAt.toDate(), { addSuffix: true })
            : ""}
        </span>
        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="sm">
            Apply Now →
          </Button>
        </a>
      </div>
    </motion.div>
  );
}
