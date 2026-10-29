import animals from "@/data/words/animals.json";
import colors from "@/data/words/colors.json";
import family from "@/data/words/family.json";
import numbers from "@/data/words/numbers.json";
import shapes from "@/data/words/shapes.json";
import type {
  Language,
  TopicId,
  TopicInfo,
  Word,
  WordLanguage,
} from "@/lib/types";

export const topicIds: TopicId[] = [
  "numbers",
  "family",
  "colors",
  "shapes",
  "animals",
];

export function isTopicId(topic: string): topic is TopicId {
  return topicIds.some((id) => id === topic);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWordLanguage(value: unknown): value is WordLanguage {
  return (
    isRecord(value) &&
    typeof value.word === "string" &&
    typeof value.audio === "string" &&
    typeof value.sentence === "string"
  );
}

function isWord(value: unknown): value is Word {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.topic === "string" &&
    isTopicId(value.topic) &&
    typeof value.image === "string" &&
    typeof value.icon === "string" &&
    (value.count === undefined || typeof value.count === "number") &&
    (value.color === undefined || typeof value.color === "string") &&
    (["fa", "ar", "en"] as Language[]).every((language) =>
      isWordLanguage(value[language]),
    )
  );
}

function loadWords(data: unknown, expectedTopic: TopicId): readonly Word[] {
  if (!Array.isArray(data)) {
    throw new Error(`The ${expectedTopic} words file must contain an array.`);
  }
  return data.map((item, index) => {
    if (!isWord(item) || item.topic !== expectedTopic) {
      throw new Error(`Invalid ${expectedTopic} word at index ${index}.`);
    }
    return item;
  });
}

export const topics: TopicInfo[] = [
  {
    id: "numbers",
    names: { fa: "شمارش", ar: "الأعداد", en: "Numbers" },
    icon: "Circle",
    color: "#b65b42",
    background: "#fff0df",
  },
  {
    id: "family",
    names: { fa: "خانواده", ar: "العائلة", en: "Family" },
    icon: "UserRound",
    color: "#76549b",
    background: "#f2eafb",
  },
  {
    id: "colors",
    names: { fa: "رنگ‌ها", ar: "الألوان", en: "Colors" },
    icon: "Palette",
    color: "#34775a",
    background: "#e7f2e8",
  },
  {
    id: "shapes",
    names: { fa: "شکل‌ها", ar: "الأشكال", en: "Shapes" },
    icon: "Shapes",
    color: "#3d5a80",
    background: "#e9f1fb",
  },
  {
    id: "animals",
    names: { fa: "جانورها", ar: "الحيوانات", en: "Animals" },
    icon: "PawPrint",
    color: "#a7652f",
    background: "#f9eedf",
  },
];

export const wordsByTopic: Record<TopicId, readonly Word[]> = {
  numbers: loadWords(numbers, "numbers"),
  family: loadWords(family, "family"),
  colors: loadWords(colors, "colors"),
  shapes: loadWords(shapes, "shapes"),
  animals: loadWords(animals, "animals"),
};

export function getTopicWords(topic: string): Word[] | null {
  if (!isTopicId(topic)) return null;
  return [...wordsByTopic[topic]];
}

export function getTopicInfo(topic: TopicId): TopicInfo {
  const info = topics.find((item) => item.id === topic);
  if (!info) throw new Error(`Missing topic information for "${topic}".`);
  return info;
}
