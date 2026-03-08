export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatDate(
  timestamp: { toDate?: () => Date } | Date | null | undefined,
): string {
  if (!timestamp) return "Recently";
  try {
    const date =
      typeof (timestamp as any).toDate === "function"
        ? (timestamp as any).toDate()
        : timestamp instanceof Date
          ? timestamp
          : new Date(timestamp as any);

    if (isNaN(date.getTime())) return "Recently";

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return "Recently";
  }
}

export function timeAgo(
  timestamp: { toDate?: () => Date } | Date | null | undefined,
): string {
  if (!timestamp) return "just now";
  try {
    const date =
      typeof (timestamp as any).toDate === "function"
        ? (timestamp as any).toDate()
        : timestamp instanceof Date
          ? timestamp
          : new Date(timestamp as any);

    if (isNaN(date.getTime())) return "just now";

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(date);
  } catch (e) {
    return "just now";
  }
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
