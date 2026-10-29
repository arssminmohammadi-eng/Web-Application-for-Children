export type Language = "fa" | "ar" | "en";
export type TopicId = "numbers" | "family" | "colors" | "shapes" | "animals";

export type WordLanguage = {
  word: string;
  audio: string;
  sentence: string;
};

export type Word = {
  id: string;
  topic: TopicId;
  image: string;
  icon: string;
  count?: number;
  color?: string;
  fa: WordLanguage;
  ar: WordLanguage;
  en: WordLanguage;
};

export type Progress = {
  learned: string[];
  stars: number;
  activeLang: Language;
};

export type TopicInfo = {
  id: TopicId;
  names: Record<Language, string>;
  icon: string;
  color: string;
  background: string;
};
