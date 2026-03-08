import { Timestamp } from "firebase/firestore";

export type Category = "Career" | "Health" | "Relationships" | "Wins" | "Struggles";
export type SentimentTag = "Victory" | "Raw & Real" | "Brave" | "Community";
export type StoryStatus = "pending" | "published";
export type ReactionType = "HEART" | "FIRE" | "STRONG" | "HUG";

export interface Reactions { HEART: number; FIRE: number; STRONG: number; HUG: number; }

export interface Story {
  id: string; title: string; content: string; category: Category;
  sentimentTag: SentimentTag; authorId: string; status: StoryStatus;
  amplifyCount: number; createdAt: Timestamp; reactions: Reactions;
}

export interface Comment { id: string; content: string; authorId: string; createdAt: Timestamp; }

export interface User {
  id: string; email: string; createdAt: Timestamp; storiesCount: number;
  badges?: string[]; totalReactionsReceived?: number; totalAmplifies?: number;
}

export interface UserReaction { userId: string; storyId: string; type: ReactionType; }
export interface Amplify { userId: string; storyId: string; }

export const REACTION_EMOJIS: Record<ReactionType, string> = { HEART: "❤️", FIRE: "🔥", STRONG: "💪", HUG: "🫂" };
export const CATEGORIES: Category[] = ["Career", "Health", "Relationships", "Wins", "Struggles"];
export const SENTIMENT_TAGS: SentimentTag[] = ["Victory", "Raw & Real", "Brave", "Community"];
export const CATEGORY_COLORS: Record<Category, string> = {
  Career: "from-blue-500 to-cyan-500", Health: "from-emerald-500 to-teal-500",
  Relationships: "from-pink-500 to-rose-500", Wins: "from-amber-500 to-orange-500",
  Struggles: "from-violet-500 to-purple-500",
};
export const SENTIMENT_COLORS: Record<SentimentTag, string> = {
  Victory: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Raw & Real": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Brave: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Community: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

// Job Board
export type JobCategory = "Engineering" | "Design" | "Product" | "Marketing" | "Data" | "Other";
export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type JobLocation = "Remote" | "Hybrid" | "On-site";
export interface Job {
  id: string; title: string; company: string; location: JobLocation;
  type: JobType; category: JobCategory; description: string; applyUrl: string;
  postedBy: string; tags: string[]; featured: boolean; createdAt: Timestamp; status: "active" | "closed";
}
export const JOB_CATEGORIES: JobCategory[] = ["Engineering", "Design", "Product", "Marketing", "Data", "Other"];
export const JOB_TYPES: JobType[] = ["Full-time", "Part-time", "Contract", "Internship"];
export const JOB_LOCATIONS: JobLocation[] = ["Remote", "Hybrid", "On-site"];

// Forums
export type ForumCategory = "Career Advice" | "Mental Health" | "Tech Talk" | "Relationships" | "Wins & Celebrations" | "General";
export interface ForumThread {
  id: string; title: string; content: string; category: ForumCategory;
  authorId: string; replyCount: number; views: number; isPinned: boolean; createdAt: Timestamp;
}
export interface ForumReply { id: string; content: string; authorId: string; likes: number; createdAt: Timestamp; }
export const FORUM_CATEGORIES: ForumCategory[] = ["Career Advice", "Mental Health", "Tech Talk", "Relationships", "Wins & Celebrations", "General"];
export const FORUM_CATEGORY_META: Record<ForumCategory, { icon: string; desc: string }> = {
  "Career Advice": { icon: "🏢", desc: "Navigate the workplace together" },
  "Mental Health": { icon: "🧠", desc: "You're not alone in this" },
  "Tech Talk": { icon: "💻", desc: "All things women in tech" },
  Relationships: { icon: "💕", desc: "Love, family, boundaries" },
  "Wins & Celebrations": { icon: "🏆", desc: "Shout your victories here" },
  General: { icon: "💬", desc: "Everything else" },
};

// Polls
export interface PollOption { id: string; text: string; votes: number; }
export interface Poll {
  id: string; question: string; options: PollOption[]; authorId: string;
  totalVotes: number; endsAt: Timestamp; category: string; createdAt: Timestamp;
}
