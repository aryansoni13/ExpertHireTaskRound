import { cn } from "@/lib/utils";
import { Category, SentimentTag, CATEGORY_COLORS, SENTIMENT_COLORS } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "category" | "sentiment" | "status";
  category?: Category;
  sentiment?: SentimentTag;
}

export function Badge({
  children,
  className,
  variant = "default",
  category,
  sentiment,
}: BadgeProps) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border";

  if (variant === "category" && category) {
    return (
      <span
        className={cn(
          base,
          "bg-gradient-to-r text-white border-transparent",
          CATEGORY_COLORS[category],
          className
        )}
      >
        {children}
      </span>
    );
  }

  if (variant === "sentiment" && sentiment) {
    return (
      <span className={cn(base, SENTIMENT_COLORS[sentiment], className)}>
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        base,
        "bg-white/10 text-white/70 border-white/10",
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles = {
    published: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    amplified: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
        styles[status as keyof typeof styles] ?? styles.pending
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
