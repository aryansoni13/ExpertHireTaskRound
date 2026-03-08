import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  desc: string;
}

export const BADGES: Badge[] = [
  { id: "first_story", label: "First Voice", emoji: "🎤", desc: "Shared your first story" },
  { id: "amplified_5", label: "Amplified", emoji: "📣", desc: "Your story was amplified 5 times" },
  { id: "storyteller", label: "Storyteller", emoji: "✍️", desc: "Shared 5 stories" },
  { id: "community_pillar", label: "Community Pillar", emoji: "🏛️", desc: "Posted 10 forum threads" },
  { id: "job_poster", label: "Opportunity Maker", emoji: "💼", desc: "Posted a job listing" },
  { id: "100_reactions", label: "Beloved", emoji: "💜", desc: "Received 100 reactions total" },
  { id: "forum_helper", label: "Forum Helper", emoji: "🤝", desc: "Replied to 10 forum threads" },
  { id: "poll_creator", label: "Poll Creator", emoji: "📊", desc: "Created your first poll" },
];

export async function awardBadge(userId: string, badgeId: string): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { badges: arrayUnion(badgeId) });
}

export async function checkAndAwardBadges(
  userId: string,
  action: "story_posted" | "job_posted" | "poll_created" | "forum_thread" | "forum_reply"
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const data = userSnap.data();
    const badges: string[] = data.badges ?? [];
    const storiesCount: number = data.storiesCount ?? 0;

    if (action === "story_posted") {
      if (storiesCount >= 1 && !badges.includes("first_story")) await awardBadge(userId, "first_story");
      if (storiesCount >= 5 && !badges.includes("storyteller")) await awardBadge(userId, "storyteller");
    }
    if (action === "job_posted" && !badges.includes("job_poster")) await awardBadge(userId, "job_poster");
    if (action === "poll_created" && !badges.includes("poll_creator")) await awardBadge(userId, "poll_creator");
  } catch (e) {
    console.error("Badge check failed:", e);
  }
}
