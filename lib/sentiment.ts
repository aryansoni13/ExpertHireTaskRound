import { SentimentTag } from "@/types";

const SENTIMENT_KEYWORDS: Record<SentimentTag, string[]> = {
  "Raw & Real": [
    "fired",
    "lost",
    "failed",
    "rejected",
    "heartbreak",
    "broken",
    "hurt",
    "pain",
    "cry",
    "cried",
    "tears",
    "depression",
    "depressed",
    "alone",
    "hopeless",
    "betrayed",
    "abandoned",
    "shame",
    "ashamed",
    "grief",
    "loss",
    "divorce",
    "cheated",
    "abused",
  ],
  Victory: [
    "promoted",
    "achieved",
    "proud",
    "won",
    "succeeded",
    "milestone",
    "accomplished",
    "triumph",
    "success",
    "celebrate",
    "celebrated",
    "overcome",
    "conquered",
    "thriving",
    "growth",
    "promoted",
    "raise",
    "dream",
    "finally",
    "graduated",
    "launched",
    "published",
    "hired",
    "landed",
  ],
  Brave: [
    "scared",
    "anxious",
    "afraid",
    "nervous",
    "uncertain",
    "survived",
    "courage",
    "brave",
    "fear",
    "terrified",
    "took the leap",
    "stood up",
    "spoke up",
    "left",
    "walked away",
    "quit",
    "ended",
    "started over",
    "chose myself",
    "boundary",
    "no more",
    "enough",
    "therapy",
    "healing",
    "recovery",
  ],
  Community: [
    "grateful",
    "support",
    "community",
    "together",
    "helped",
    "kindness",
    "friends",
    "family",
    "love",
    "sisterhood",
    "solidarity",
    "not alone",
    "we",
    "us",
    "collective",
    "share",
    "inspire",
    "mentor",
    "guide",
    "lifted",
    "connection",
    "belong",
    "welcome",
    "included",
    "safe",
  ],
};

export function detectSentiment(text: string): SentimentTag {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  const scores: Record<SentimentTag, number> = {
    "Raw & Real": 0,
    Victory: 0,
    Brave: 0,
    Community: 0,
  };

  for (const [tag, keywords] of Object.entries(SENTIMENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (keyword.includes(" ")) {
        // Multi-word phrase
        if (lowerText.includes(keyword)) {
          scores[tag as SentimentTag] += 2;
        }
      } else {
        // Single word
        if (words.some((w) => w.replace(/[^a-z]/g, "") === keyword)) {
          scores[tag as SentimentTag] += 1;
        }
      }
    }
  }

  const maxScore = Math.max(...Object.values(scores));

  if (maxScore === 0) {
    return "Raw & Real"; // default
  }

  const topTag = (Object.entries(scores) as [SentimentTag, number][]).find(
    ([, score]) => score === maxScore
  )?.[0];

  return topTag ?? "Raw & Real";
}
