"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/store/uiStore";

export function Notification() {
  const { notification, clearNotification } = useUIStore();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className="fixed top-6 left-1/2 z-50"
        >
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-md shadow-2xl cursor-pointer ${
              notification.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-200"
                : "bg-red-500/20 border-red-500/30 text-red-200"
            }`}
            onClick={clearNotification}
          >
            <span className="text-lg">
              {notification.type === "success" ? "✓" : "✕"}
            </span>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
