import { Timestamp } from "firebase/firestore";
import { Story, Job, ForumThread, Poll } from "@/types";

const now = Timestamp.now();
const daysAgo = (days: number) =>
  Timestamp.fromDate(new Date(Date.now() - days * 24 * 60 * 60 * 1000));

export const MOCK_STORIES: Story[] = [
  {
    id: "demo-1",
    title: "Breaking the Glass Ceiling in Fintech",
    content:
      "After 10 years in the industry, I finally landed a CTO role. It wasn't easy, and I faced countless microaggressions, but standing here today, I want every woman to know: your technical depth is your greatest asset. Don't let anyone make you feel like you don't belong in the room where decisions are made.",
    category: "Career",
    sentimentTag: "Victory",
    authorId: "demo-user-1",
    status: "published",
    amplifyCount: 124,
    createdAt: daysAgo(1),
    reactions: { HEART: 45, FIRE: 30, STRONG: 50, HUG: 12 },
  },
  {
    id: "demo-2",
    title: "The Silence of Post-Partum Return",
    content:
      "Coming back from maternity leave was the loneliest experience of my professional life. My projects were gone, my desk was moved, and no one asked how I was doing. It felt like I was being punished for having a life outside of work. We need to do better for mothers in the workplace.",
    category: "Struggles",
    sentimentTag: "Raw & Real",
    authorId: "demo-user-2",
    status: "published",
    amplifyCount: 89,
    createdAt: daysAgo(3),
    reactions: { HEART: 20, FIRE: 5, STRONG: 15, HUG: 60 },
  },
  {
    id: "demo-3",
    title: "Finding my Voice in a Male-Dominated Startup",
    content:
      "I used to stay quiet in meetings, afraid that my ideas would be dismissed. One day, I decided to speak up about a major architectural flaw I'd spotted. Not only was I heard, but we saved months of rework. Now, I mentor other junior devs to find their voice early. Confidence is a muscle!",
    category: "Wins",
    sentimentTag: "Brave",
    authorId: "demo-user-3",
    status: "published",
    amplifyCount: 56,
    createdAt: daysAgo(5),
    reactions: { HEART: 10, FIRE: 25, STRONG: 30, HUG: 5 },
  },
  {
    id: "demo-4",
    title: "Overcoming Burnout and Rediscovering Passion",
    content:
      "I reached a point where I couldn't even look at code without feeling physical dread. I took a three-month sabbatical, focused on my mental health, and slowly started building for fun again. If you're feeling the same, please listen to your body before it forced you to stop.",
    category: "Health",
    sentimentTag: "Community",
    authorId: "demo-user-4",
    status: "published",
    amplifyCount: 72,
    createdAt: daysAgo(2),
    reactions: { HEART: 30, FIRE: 15, STRONG: 20, HUG: 40 },
  },
  {
    id: "demo-5",
    title: "Setting Boundaries with Senior Leadership",
    content:
      "I used to be the 'yes' person. I'd take on everything, work late, and sacrifice my weekends. Last week, I joined a leadership meeting and for the first time, I said: 'I cannot take this on without delaying other priorities.' The result? They actually respected me more.",
    category: "Relationships",
    sentimentTag: "Brave",
    authorId: "demo-user-5",
    status: "published",
    amplifyCount: 45,
    createdAt: daysAgo(4),
    reactions: { HEART: 15, FIRE: 20, STRONG: 25, HUG: 10 },
  },
];

export const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Full Stack Engineer",
    company: "FutureTech Solutions",
    location: "Remote",
    type: "Full-time",
    category: "Engineering",
    description:
      "Looking for a passionate engineer to lead our core product team. We value diversity and offer flexible working hours, comprehensive health benefits, and a culture that prioritizes work-life balance.",
    applyUrl: "https://example.com/apply",
    postedBy: "demo-admin",
    tags: ["React", "Node.js", "Firebase", "Diversity-First"],
    featured: true,
    createdAt: daysAgo(2),
    status: "active",
  },
  {
    id: "job-2",
    title: "Product Designer (UX/UI)",
    company: "CreativeFlow",
    location: "Hybrid",
    type: "Contract",
    category: "Design",
    description:
      "Join our design-led startup to build beautiful interfaces for women-focused health apps. You will have a direct impact on how millions of women interact with their health data.",
    applyUrl: "https://example.com/apply",
    postedBy: "demo-admin",
    tags: ["Figma", "Design Systems", "User Research"],
    featured: false,
    createdAt: daysAgo(4),
    status: "active",
  },
  {
    id: "job-3",
    title: "Data Scientist - Analytics",
    company: "InsightX",
    location: "On-site",
    type: "Full-time",
    category: "Data",
    description:
      "We are looking for a data scientist to join our inclusive team in Bangalore. You will work on identifying patterns in user behavior to drive personalized experiences.",
    applyUrl: "https://example.com/apply",
    postedBy: "demo-admin",
    tags: ["Python", "SQL", "Machine Learning"],
    featured: true,
    createdAt: daysAgo(1),
    status: "active",
  },
  {
    id: "job-4",
    title: "Marketing Lead",
    company: "GlobalReach",
    location: "Remote",
    type: "Full-time",
    category: "Marketing",
    description:
      "Lead our marketing efforts across multiple continents. We are looking for someone with a deep understanding of audience growth and a passion for storytelling.",
    applyUrl: "https://example.com/apply",
    postedBy: "demo-admin",
    tags: ["SEO", "Content Strategy", "Growth"],
    featured: false,
    createdAt: daysAgo(3),
    status: "active",
  },
];

export const MOCK_THREADS: ForumThread[] = [
  {
    id: "thread-1",
    title: "How to negotiate a remote-work clause?",
    content:
      "I'm about to get a job offer but want to ensure my remote status is contractually guaranteed. Any tips on phrasing?",
    category: "Career Advice",
    authorId: "user-alpha",
    replyCount: 15,
    views: 240,
    isPinned: true,
    createdAt: daysAgo(2),
  },
  {
    id: "thread-2",
    title: "Dealing with Imposter Syndrome as a Self-Taught Dev",
    content:
      "I've been working for 2 years now, but I still feel like a fraud every time I open a PR. Does it ever go away?",
    category: "Mental Health",
    authorId: "user-beta",
    replyCount: 42,
    views: 1200,
    isPinned: false,
    createdAt: daysAgo(1),
  },
  {
    id: "thread-3",
    title: "Best resources for learning System Design?",
    content:
      "I'm preparing for Senior roles. What are your go-to books or courses for scaling applications?",
    category: "Tech Talk",
    authorId: "user-gamma",
    replyCount: 8,
    views: 150,
    isPinned: false,
    createdAt: daysAgo(4),
  },
  {
    id: "thread-4",
    title: "Healthy habits for remote engineers",
    content:
      "I've been sitting for 8 hours straight and my back is killing me. What are your favorite stretches or desk setups?",
    category: "Mental Health",
    authorId: "user-delta",
    replyCount: 12,
    views: 320,
    isPinned: false,
    createdAt: daysAgo(0.5),
  },
  {
    id: "thread-5",
    title: "Celebrating my first open-source contribution!",
    content:
      "I finally got my PR merged into a major library today. Feeling so proud!",
    category: "Wins & Celebrations",
    authorId: "user-epsilon",
    replyCount: 20,
    views: 500,
    isPinned: false,
    createdAt: daysAgo(0.1),
  },
  {
    id: "thread-6",
    title: "Relationship boundaries and career growth",
    content:
      "How do you handle a partner who doesn't understand the time commitment of a fast-growing startup?",
    category: "Relationships",
    authorId: "user-zeta",
    replyCount: 18,
    views: 410,
    isPinned: false,
    createdAt: daysAgo(2),
  },
];

export const MOCK_POLLS: Poll[] = [
  {
    id: "poll-1",
    question: "Do you prefer working from an office, hybrid, or fully remote?",
    options: [
      { id: "opt_0", text: "Fully Remote", votes: 450 },
      { id: "opt_1", text: "Hybrid", votes: 200 },
      { id: "opt_2", text: "Office Only", votes: 25 },
    ],
    authorId: "admin",
    totalVotes: 675,
    endsAt: Timestamp.fromDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
    category: "Career",
    createdAt: daysAgo(2),
  },
  {
    id: "poll-2",
    question: "How often do you prioritize self-care?",
    options: [
      { id: "opt_0", text: "Every day", votes: 89 },
      { id: "opt_1", text: "Once a week", votes: 156 },
      { id: "opt_2", text: "Rarely", votes: 210 },
    ],
    authorId: "admin",
    totalVotes: 455,
    endsAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    category: "Health",
    createdAt: daysAgo(10),
  },
  {
    id: "poll-3",
    question: "What is your primary goal for 2024?",
    options: [
      { id: "opt_0", text: "Career Advancement", votes: 320 },
      { id: "opt_1", text: "Learning New Skills", votes: 280 },
      { id: "opt_2", text: "Work/Life Balance", votes: 410 },
      { id: "opt_3", text: "Entrepreneurship", votes: 150 },
    ],
    authorId: "admin",
    totalVotes: 1160,
    endsAt: Timestamp.fromDate(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)),
    category: "General",
    createdAt: daysAgo(1),
  },
  {
    id: "poll-4",
    question: "Which tech field are you most interested in?",
    options: [
      { id: "opt_0", text: "AI / ML", votes: 500 },
      { id: "opt_1", text: "Cybersecurity", votes: 150 },
      { id: "opt_2", text: "Web Development", votes: 350 },
      { id: "opt_3", text: "Mobile Apps", votes: 100 },
    ],
    authorId: "admin",
    totalVotes: 1100,
    endsAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    category: "Tech",
    createdAt: daysAgo(0.5),
  },
];
