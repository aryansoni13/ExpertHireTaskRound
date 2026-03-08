"use client";

import { motion } from "framer-motion";
import { StoryFeed } from "@/components/stories/StoryFeed";

export default function StoriesPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-extrabold text-white mb-4">
            All <span className="gradient-text">Stories</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            Real stories from real women. Unfiltered. Unedited. 
            Anonymous and powerful.
          </p>
        </motion.div>

        <StoryFeed />
      </div>
    </div>
  );
}
