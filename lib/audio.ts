import type { Language } from "@/lib/types";

export type AudioTrack = {
  language: Language;
  text: string;
  url?: string;
};

export type PlaybackState = {
  wordId: string;
  language: Language;
} | null;

export const browserLanguage: Record<Language, string> = {
  fa: "fa-IR",
  ar: "ar-SA",
  en: "en-US",
};

export const audioCache = new Map<string, HTMLAudioElement>();

export function getCachedAudio(url: string): HTMLAudioElement {
  const cached = audioCache.get(url);
  if (cached) return cached;

  const audio = new Audio(url);
  audio.preload = "none";
  audioCache.set(url, audio);
  return audio;
}

export function speakWithBrowser(
  text: string,
  language: Language,
): Promise<void> {
  if (!("speechSynthesis" in window)) {
    console.error(`No audio source is available for ${language}.`);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = browserLanguage[language];
    utterance.rate = 0.82;
    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      console.error("Browser speech synthesis failed.", event.error);
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
}
