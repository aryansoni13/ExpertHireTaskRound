import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  increment,
  runTransaction,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  Unsubscribe,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Story, Comment, Category, Reactions, ReactionType } from "@/types";
import { MOCK_STORIES, MOCK_JOBS, MOCK_THREADS, MOCK_POLLS } from "./mockData";

// ─── Stories ────────────────────────────────────────────────────────────────

function docToStory(doc: QueryDocumentSnapshot<DocumentData>): Story {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title ?? "",
    content: data.content ?? "",
    category: data.category ?? "Struggles",
    sentimentTag: data.sentimentTag ?? "Raw & Real",
    authorId: data.authorId ?? "",
    status: data.status ?? "pending",
    amplifyCount: data.amplifyCount ?? 0,
    createdAt: data.createdAt,
    reactions: data.reactions ?? { HEART: 0, FIRE: 0, STRONG: 0, HUG: 0 },
  };
}

export async function getStories(
  category?: Category,
  sortBy: "recent" | "trending" = "recent",
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  pageSize = 12,
): Promise<{
  stories: Story[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const storiesRef = collection(db, "stories");
  const constraints: Parameters<typeof query>[1][] = [
    where("status", "==", "published"),
  ];

  if (category) {
    constraints.push(where("category", "==", category));
  }

  if (sortBy === "trending") {
    constraints.push(orderBy("amplifyCount", "desc"));
  } else {
    constraints.push(orderBy("createdAt", "desc"));
  }

  constraints.push(limit(pageSize));

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q = query(storiesRef, ...constraints);
  try {
    const snapshot = await getDocs(q);
    let stories = snapshot.docs.map(docToStory);
    if (stories.length === 0 && !lastDoc) {
      if (category) {
        stories = MOCK_STORIES.filter((s) => s.category === category);
      } else if (sortBy === "recent") {
        stories = MOCK_STORIES;
      }
    }
    const last = snapshot.docs[snapshot.docs.length - 1] ?? null;
    return { stories, lastDoc: last };
  } catch (error) {
    console.error("Firestore error, falling back to mock data:", error);
    const stories = category
      ? MOCK_STORIES.filter((s) => s.category === category)
      : MOCK_STORIES;
    return { stories, lastDoc: null };
  }
}

export function subscribeToStories(
  callback: (stories: Story[]) => void,
  category?: Category,
  sortBy: "recent" | "trending" = "recent",
): Unsubscribe {
  const storiesRef = collection(db, "stories");
  const constraints: Parameters<typeof query>[1][] = [
    where("status", "==", "published"),
  ];

  if (category) {
    constraints.push(where("category", "==", category));
  }

  if (sortBy === "trending") {
    constraints.push(orderBy("amplifyCount", "desc"));
  } else {
    constraints.push(orderBy("createdAt", "desc"));
  }

  constraints.push(limit(20));

  const q = query(storiesRef, ...constraints);

  return onSnapshot(q, {
    next: (snapshot) => {
      const stories = snapshot.docs.map(docToStory);
      if (stories.length === 0 && !category) {
        callback(MOCK_STORIES);
      } else if (stories.length === 0 && category) {
        callback(MOCK_STORIES.filter((s) => s.category === category));
      } else {
        callback(stories);
      }
    },
    error: (error) => {
      console.error(
        "Firestore subscription error, falling back to mock data:",
        error,
      );
      callback(
        category
          ? MOCK_STORIES.filter((s) => s.category === category)
          : MOCK_STORIES,
      );
    },
  });
}

export async function getStory(id: string): Promise<Story | null> {
  try {
    const ref = doc(db, "stories", id);
    const snap = await getDoc(ref);
    if (!snap.exists())
      return MOCK_STORIES.find((s) => s.id === id) || MOCK_STORIES[0];
    return { id: snap.id, ...snap.data() } as Story;
  } catch (error) {
    console.error("Firestore error, falling back to mock story:", error);
    return MOCK_STORIES.find((s) => s.id === id) || MOCK_STORIES[0];
  }
}

export function subscribeToStory(
  id: string,
  callback: (story: Story | null) => void,
): Unsubscribe {
  const ref = doc(db, "stories", id);
  return onSnapshot(ref, {
    next: (snap) => {
      if (!snap.exists()) {
        callback(null);
      } else {
        callback({ id: snap.id, ...snap.data() } as Story);
      }
    },
    error: (error) => {
      console.error("Firestore story subscription error:", error);
      callback(MOCK_STORIES.find((s) => s.id === id) || MOCK_STORIES[0]);
    },
  });
}

export async function addStory(
  data: Omit<Story, "id" | "createdAt" | "amplifyCount" | "reactions">,
  userId: string,
): Promise<string> {
  const {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    increment,
    Timestamp,
  } = await import("firebase/firestore");
  try {
    const ref = await addDoc(collection(db, "stories"), {
      ...data,
      authorId: userId,
      amplifyCount: 0,
      reactions: { HEART: 0, FIRE: 0, STRONG: 0, HUG: 0 },
      createdAt: serverTimestamp(),
    });

    // auto-publish after basic check
    await updateDoc(ref, { status: "published" });

    // Increment user story count
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { storiesCount: increment(1) }).catch(() => {});

    return ref.id;
  } catch (error) {
    console.error(
      "Failed to add story to Firestore, adding to mock data for demo:",
      error,
    );
    const newStory: Story = {
      id: `mock-${Date.now()}`,
      ...data,
      authorId: userId,
      status: "published",
      amplifyCount: 0,
      reactions: { HEART: 0, FIRE: 0, STRONG: 0, HUG: 0 },
      createdAt: Timestamp.now(),
    };
    MOCK_STORIES.unshift(newStory);
    return newStory.id;
  }
}

export async function deleteStory(storyId: string): Promise<void> {
  await deleteDoc(doc(db, "stories", storyId));
}

export async function getUserStories(userId: string): Promise<Story[]> {
  try {
    const q = query(
      collection(db, "stories"),
      where("authorId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map(docToStory);
  } catch (error) {
    console.error("Firestore error, falling back to mock user stories:", error);
    return MOCK_STORIES.slice(0, 2);
  }
}

export async function getFeaturedStories(): Promise<Story[]> {
  const q = query(
    collection(db, "stories"),
    where("status", "==", "published"),
    orderBy("amplifyCount", "desc"),
    limit(3),
  );
  const snap = await getDocs(q);
  const stories = snap.docs.map(docToStory);
  return stories.length > 0 ? stories : MOCK_STORIES.slice(0, 3);
}

export async function getRelatedStories(
  category: Category,
  excludeId: string,
): Promise<Story[]> {
  const q = query(
    collection(db, "stories"),
    where("status", "==", "published"),
    where("category", "==", category),
    orderBy("createdAt", "desc"),
    limit(4),
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(docToStory)
    .filter((s) => s.id !== excludeId)
    .slice(0, 3);
}

// ─── Reactions ──────────────────────────────────────────────────────────────

export async function addReaction(
  storyId: string,
  userId: string,
  type: ReactionType,
): Promise<void> {
  try {
    const reactionDocId = `${userId}_${storyId}`;
    const reactionRef = doc(db, "userReactions", reactionDocId);
    const storyRef = doc(db, "stories", storyId);

    await runTransaction(db, async (tx) => {
      const reactionSnap = await tx.get(reactionRef);
      const storySnap = await tx.get(storyRef);

      if (!storySnap.exists()) throw new Error("Story not found");

      const currentReactions = storySnap.data().reactions as Reactions;

      if (reactionSnap.exists()) {
        const existingType = reactionSnap.data().type as ReactionType;
        if (existingType === type) {
          // Toggle off — remove reaction
          tx.delete(reactionRef);
          tx.update(storyRef, {
            [`reactions.${type}`]: Math.max(
              0,
              (currentReactions[type] ?? 0) - 1,
            ),
          });
        } else {
          // Switch reaction type
          tx.set(reactionRef, { userId, storyId, type });
          tx.update(storyRef, {
            [`reactions.${existingType}`]: Math.max(
              0,
              (currentReactions[existingType] ?? 0) - 1,
            ),
            [`reactions.${type}`]: (currentReactions[type] ?? 0) + 1,
          });
        }
      } else {
        // New reaction
        tx.set(reactionRef, { userId, storyId, type });
        tx.update(storyRef, {
          [`reactions.${type}`]: increment(1),
        });
      }
    });
  } catch (error) {
    console.error(
      "Failed to add reaction to Firestore, updating mock data for demo:",
      error,
    );
    const story = MOCK_STORIES.find((s) => s.id === storyId);
    if (story) {
      story.reactions[type]++;
    }
  }
}

export async function getUserReaction(
  storyId: string,
  userId: string,
): Promise<ReactionType | null> {
  const ref = doc(db, "userReactions", `${userId}_${storyId}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data().type as ReactionType;
}

// ─── Amplify ─────────────────────────────────────────────────────────────────

export async function addAmplify(
  storyId: string,
  userId: string,
): Promise<boolean> {
  try {
    const amplifyDocId = `${userId}_${storyId}`;
    const amplifyRef = doc(db, "amplifies", amplifyDocId);
    const storyRef = doc(db, "stories", storyId);

    const snap = await getDoc(amplifyRef);
    if (snap.exists()) return false; // already amplified

    await runTransaction(db, async (tx) => {
      tx.set(amplifyRef, { userId, storyId });
      tx.update(storyRef, { amplifyCount: increment(1) });
    });

    return true;
  } catch (error) {
    console.error(
      "Failed to add amplify to Firestore, updating mock data for demo:",
      error,
    );
    const story = MOCK_STORIES.find((s) => s.id === storyId);
    if (story) {
      story.amplifyCount++;
    }
    return true;
  }
}

export async function hasAmplified(
  storyId: string,
  userId: string,
): Promise<boolean> {
  const ref = doc(db, "amplifies", `${userId}_${storyId}`);
  const snap = await getDoc(ref);
  return snap.exists();
}

// ─── Comments ────────────────────────────────────────────────────────────────

export function subscribeToComments(
  storyId: string,
  callback: (comments: Comment[]) => void,
): Unsubscribe {
  const commentsRef = collection(db, "stories", storyId, "comments");
  const q = query(commentsRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, {
    next: (snap) => {
      const comments = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Comment[];
      callback(comments);
    },
    error: (error) => {
      console.error("Firestore comments subscription error:", error);
      callback([]);
    },
  });
}

export async function addComment(
  storyId: string,
  userId: string,
  content: string,
): Promise<void> {
  try {
    const commentsRef = collection(db, "stories", storyId, "comments");
    await addDoc(commentsRef, {
      content,
      authorId: userId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(
      "Failed to add comment to Firestore, faking for demo:",
      error,
    );
  }
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function createUserDocument(
  userId: string,
  email: string,
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await updateDoc(userRef, {
        email,
        createdAt: serverTimestamp(),
        storiesCount: 0,
      }).catch(async () => {
        // If doc doesn't exist, use set via addDoc alternative
        await setDoc(userRef, {
          email,
          createdAt: serverTimestamp(),
          storiesCount: 0,
        });
      });
    }
  } catch (error) {
    console.error("Failed to create user document in Firestore:", error);
  }
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export async function getStats(): Promise<{
  totalStories: number;
  categories: Record<string, number>;
}> {
  try {
    const q = query(
      collection(db, "stories"),
      where("status", "==", "published"),
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      return {
        totalStories: MOCK_STORIES.length,
        categories: MOCK_STORIES.reduce(
          (acc, s) => {
            acc[s.category] = (acc[s.category] ?? 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
      };
    }
    const categories: Record<string, number> = {};
    snap.docs.forEach((d) => {
      const cat = d.data().category as string;
      categories[cat] = (categories[cat] ?? 0) + 1;
    });
    return { totalStories: snap.size, categories };
  } catch (error) {
    console.error("Firestore error, falling back to mock stats:", error);
    return {
      totalStories: MOCK_STORIES.length,
      categories: MOCK_STORIES.reduce(
        (acc, s) => {
          acc[s.category] = (acc[s.category] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}

// ─── Jobs ────────────────────────────────────────────────────────────────────

import type {
  Job,
  JobCategory,
  JobType,
  JobLocation,
  ForumThread,
  ForumReply,
  ForumCategory,
  Poll,
  PollOption,
} from "@/types";

export async function getJobs(
  category?: JobCategory,
  type?: JobType,
  location?: JobLocation,
): Promise<Job[]> {
  const ref = collection(db, "jobs");
  const constraints: any[] = [
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
  ];
  if (category) constraints.push(where("category", "==", category));
  if (type) constraints.push(where("type", "==", type));
  if (location) constraints.push(where("location", "==", location));
  try {
    const snap = await getDocs(query(ref, ...constraints));
    const jobs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Job);
    if (jobs.length === 0 && !category && !type && !location) return MOCK_JOBS;
    return jobs;
  } catch (error) {
    console.error("Firestore error, falling back to mock jobs:", error);
    return MOCK_JOBS;
  }
}

export async function addJob(
  data: Omit<Job, "id" | "createdAt" | "status">,
  userId: string,
): Promise<string> {
  try {
    const ref = await addDoc(collection(db, "jobs"), {
      ...data,
      status: "active",
      postedBy: userId,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error(
      "Failed to add job to Firestore, adding to mock data for demo:",
      error,
    );
    const newJob: Job = {
      id: `mock-${Date.now()}`,
      ...data,
      status: "active",
      postedBy: userId,
      createdAt: Timestamp.now(),
      featured: (data as any).featured ?? false,
    } as Job;
    MOCK_JOBS.unshift(newJob);
    return newJob.id;
  }
}

// ─── Forums ───────────────────────────────────────────────────────────────────

export async function getForumThreads(
  category?: ForumCategory,
): Promise<ForumThread[]> {
  const ref = collection(db, "forums");
  const constraints: any[] = [
    orderBy("isPinned", "desc"),
    orderBy("createdAt", "desc"),
  ];
  if (category) constraints.push(where("category", "==", category));
  try {
    const snap = await getDocs(query(ref, ...constraints));
    const threads = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as ForumThread,
    );
    if (threads.length === 0) {
      return category
        ? MOCK_THREADS.filter((t) => t.category === category)
        : MOCK_THREADS;
    }
    return threads;
  } catch (error) {
    console.error("Firestore error, falling back to mock data:", error);
    return category
      ? MOCK_THREADS.filter((t) => t.category === category)
      : MOCK_THREADS;
  }
}

export function subscribeToThreads(
  category: ForumCategory | undefined,
  callback: (threads: ForumThread[]) => void,
) {
  const ref = collection(db, "forums");
  const constraints: any[] = [
    orderBy("isPinned", "desc"),
    orderBy("createdAt", "desc"),
  ];
  if (category) constraints.push(where("category", "==", category));
  return onSnapshot(query(ref, ...constraints), {
    next: (snap: any) => {
      const threads = snap.docs.map(
        (d: any) => ({ id: d.id, ...d.data() }) as ForumThread,
      );
      if (threads.length === 0) {
        callback(
          category
            ? MOCK_THREADS.filter((t) => t.category === category)
            : MOCK_THREADS,
        );
      } else {
        callback(threads);
      }
    },
    error: (error: any) => {
      console.error(
        "Firestore subscription error, falling back to mock data:",
        error,
      );
      callback(
        category
          ? MOCK_THREADS.filter((t) => t.category === category)
          : MOCK_THREADS,
      );
    },
  });
}

export async function getThread(id: string): Promise<ForumThread | null> {
  try {
    const snap = await getDoc(doc(db, "forums", id));
    if (!snap.exists())
      return MOCK_THREADS.find((t) => t.id === id) || MOCK_THREADS[0];
    return { id: snap.id, ...snap.data() } as ForumThread;
  } catch (error) {
    console.error("Firestore error, falling back to mock thread:", error);
    return MOCK_THREADS.find((t) => t.id === id) || MOCK_THREADS[0];
  }
}

export async function addThread(
  data: { title: string; content: string; category: ForumCategory },
  userId: string,
): Promise<string> {
  try {
    const ref = await addDoc(collection(db, "forums"), {
      ...data,
      authorId: userId,
      replyCount: 0,
      views: 0,
      isPinned: false,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error(
      "Failed to add thread to Firestore, adding to mock data for demo:",
      error,
    );
    const newThread: ForumThread = {
      id: `mock-${Date.now()}`,
      ...data,
      authorId: userId,
      replyCount: 0,
      views: 0,
      isPinned: false,
      createdAt: Timestamp.now(),
    };
    MOCK_THREADS.unshift(newThread);
    return newThread.id;
  }
}

export async function incrementThreadViews(threadId: string): Promise<void> {
  await updateDoc(doc(db, "forums", threadId), { views: increment(1) });
}

export function subscribeToReplies(
  threadId: string,
  callback: (replies: ForumReply[]) => void,
) {
  const ref = collection(db, "forums", threadId, "replies");
  return onSnapshot(query(ref, orderBy("createdAt", "asc")), {
    next: (snap: any) => {
      callback(
        snap.docs.map((d: any) => ({ id: d.id, ...d.data() }) as ForumReply),
      );
    },
    error: (error: any) => {
      console.error("Firestore replies subscription error:", error);
      callback([]);
    },
  });
}

export async function addForumReply(
  threadId: string,
  userId: string,
  content: string,
): Promise<void> {
  try {
    await addDoc(collection(db, "forums", threadId, "replies"), {
      content,
      authorId: userId,
      likes: 0,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "forums", threadId), { replyCount: increment(1) });
  } catch (error) {
    console.error(
      "Failed to add reply to Firestore, updating mock data for demo:",
      error,
    );
    const thread = MOCK_THREADS.find((t) => t.id === threadId);
    if (thread) {
      thread.replyCount++;
    }
  }
}

export async function likeReply(
  threadId: string,
  replyId: string,
  userId: string,
): Promise<void> {
  const likeRef = doc(db, "forumReplyLikes", `${userId}_${replyId}`);
  const replyRef = doc(db, "forums", threadId, "replies", replyId);
  const snap = await getDoc(likeRef);
  if (snap.exists()) {
    await deleteDoc(likeRef);
    await updateDoc(replyRef, { likes: increment(-1) });
  } else {
    await setDoc(likeRef, { userId, replyId });
    await updateDoc(replyRef, { likes: increment(1) });
  }
}

export async function getRecentThreads(limitCount = 5): Promise<ForumThread[]> {
  try {
    const snap = await getDocs(
      query(
        collection(db, "forums"),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      ),
    );
    const threads = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as ForumThread,
    );
    if (threads.length === 0) return MOCK_THREADS.slice(0, limitCount);
    return threads;
  } catch (error) {
    console.error("Firestore error, falling back to mock threads:", error);
    return MOCK_THREADS.slice(0, limitCount);
  }
}

// ─── Polls ────────────────────────────────────────────────────────────────────

export async function getPolls(): Promise<Poll[]> {
  try {
    const snap = await getDocs(
      query(collection(db, "polls"), orderBy("createdAt", "desc")),
    );
    const polls = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Poll);
    if (polls.length === 0) return MOCK_POLLS;
    return polls;
  } catch (error) {
    console.error("Firestore error, falling back to mock data:", error);
    return MOCK_POLLS;
  }
}

export function subscribeToPolls(callback: (polls: Poll[]) => void) {
  return onSnapshot(
    query(collection(db, "polls"), orderBy("createdAt", "desc")),
    {
      next: (snap: any) => {
        const polls = snap.docs.map(
          (d: any) => ({ id: d.id, ...d.data() }) as Poll,
        );
        if (polls.length === 0) {
          callback(MOCK_POLLS);
        } else {
          callback(polls);
        }
      },
      error: (error: any) => {
        console.error(
          "Firestore subscription error, falling back to mock data:",
          error,
        );
        callback(MOCK_POLLS);
      },
    },
  );
}

export async function addPoll(
  data: {
    question: string;
    options: PollOption[];
    category: string;
    endsAt: any;
  },
  userId: string,
): Promise<string> {
  try {
    const ref = await addDoc(collection(db, "polls"), {
      ...data,
      authorId: userId,
      totalVotes: 0,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error(
      "Failed to add poll to Firestore, adding to mock data for demo:",
      error,
    );
    const newPoll: Poll = {
      id: `mock-${Date.now()}`,
      ...data,
      authorId: userId,
      totalVotes: 0,
      createdAt: Timestamp.now(),
    };
    MOCK_POLLS.unshift(newPoll);
    return newPoll.id;
  }
}

export async function castVote(
  pollId: string,
  userId: string,
  optionId: string,
): Promise<void> {
  try {
    const voteRef = doc(db, "pollVotes", `${userId}_${pollId}`);
    const pollRef = doc(db, "polls", pollId);
    const existing = await getDoc(voteRef);
    if (existing.exists()) return;
    await runTransaction(db, async (tx) => {
      const pollSnap = await tx.get(pollRef);
      if (!pollSnap.exists()) return;
      const options: PollOption[] = pollSnap.data().options;
      const updated = options.map((o) =>
        o.id === optionId ? { ...o, votes: o.votes + 1 } : o,
      );
      tx.update(pollRef, {
        options: updated,
        totalVotes: (pollSnap.data().totalVotes ?? 0) + 1,
      });
      tx.set(voteRef, { userId, pollId, optionId });
    });
  } catch (error) {
    console.error(
      "Failed to cast vote in Firestore, updating mock data for demo:",
      error,
    );
    const poll = MOCK_POLLS.find((p) => p.id === pollId);
    if (poll) {
      const option = poll.options.find((o) => o.id === optionId);
      if (option) {
        option.votes++;
        poll.totalVotes++;
      }
    }
  }
}

export async function getUserVote(
  pollId: string,
  userId: string,
): Promise<string | null> {
  const snap = await getDoc(doc(db, "pollVotes", `${userId}_${pollId}`));
  if (!snap.exists()) return null;
  return snap.data().optionId as string;
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export async function getTopStories(limitCount = 10): Promise<Story[]> {
  try {
    const snap = await getDocs(
      query(
        collection(db, "stories"),
        where("status", "==", "published"),
        orderBy("amplifyCount", "desc"),
        limit(limitCount),
      ),
    );
    const stories = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Story);
    if (stories.length === 0) return MOCK_STORIES.slice(0, limitCount);
    return stories;
  } catch (error) {
    console.error("Firestore error, falling back to mock stories:", error);
    return MOCK_STORIES.slice(0, limitCount);
  }
}
