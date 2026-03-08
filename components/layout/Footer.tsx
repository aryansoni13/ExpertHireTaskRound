import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0f] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">HV</span>
            </div>
            <span className="font-bold text-white/80">HerVoice</span>
          </div>

          <p className="text-white/30 text-sm text-center">
            A safe, anonymous space for women to share, heal, and be heard.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/stories" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              Stories
            </Link>
            <Link href="/share" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              Share
            </Link>
            <Link href="/register" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              Join
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-white/20 text-xs">
          © {new Date().getFullYear()} HerVoice. All stories are anonymous. Your truth is safe here.
        </div>
      </div>
    </footer>
  );
}
