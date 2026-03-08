"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/Button";

const primaryLinks = [
  { href: "/stories", label: "Stories" },
  { href: "/forums", label: "Forums" },
  { href: "/jobs", label: "Jobs" },
  { href: "/polls", label: "Polls" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { showNotification } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    showNotification("Signed out. See you soon 💜", "success");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">HV</span>
            </div>
            <span className="font-bold text-white tracking-tight text-lg group-hover:text-violet-300 transition-colors">
              HerVoice
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-violet-400"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/support"
              className={`text-sm font-medium transition-colors ${
                pathname === "/support" ? "text-pink-400" : "text-pink-400/70 hover:text-pink-400"
              }`}
            >
              Support 💜
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/share">
              <Button variant="primary" size="sm">Share Yours</Button>
            </Link>
            {loading ? (
              <div className="h-9 w-24 bg-white/5 animate-pulse rounded-xl" />
            ) : user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">Profile</Button>
                </Link>
                <Button variant="secondary" size="sm" onClick={handleLogout}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="sm">Join Free</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setMenuOpen((v) => !v)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mx-6 mt-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-2"
          >
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 px-4 rounded-xl transition-all text-sm font-medium ${
                  pathname === link.href ? "text-violet-400 bg-violet-500/10" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/support" className="py-2 px-4 rounded-xl text-pink-400/80 hover:text-pink-400 hover:bg-pink-500/10 transition-all text-sm font-medium" onClick={() => setMenuOpen(false)}>
              Support 💜
            </Link>
            <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
              <Link href="/share" onClick={() => setMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">Share Yours</Button>
              </Link>
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full">Profile</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => { handleLogout(); setMenuOpen(false); }}>Sign Out</Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">Join Free</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
