import type { Language, Progress } from "@/lib/types";

const STORAGE_KEY = "trilingual-kids-progress";
const SETTINGS_KEY = "trilingual-kids-settings";

const defaultProgress: Progress = {
  learned: [],
  stars: 0,
  activeLang: "fa",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function readProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress;

  try {
    const stored: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "null",
    );
    if (!isRecord(stored)) return defaultProgress;

    const activeLang: Language =
      stored.activeLang === "ar" || stored.activeLang === "en"
        ? stored.activeLang
        : "fa";
    return {
      learned: Array.isArray(stored.learned)
        ? stored.learned.filter(
            (id): id is string => typeof id === "string",
          )
        : [],
      stars:
        typeof stored.stars === "number" &&
        Number.isFinite(stored.stars) &&
        stored.stars >= 0
          ? stored.stars
          : 0,
      activeLang,
    };
  } catch (error) {
    console.error("Could not read local learning progress.", error);
    return defaultProgress;
  }
}

export function writeProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Could not save local learning progress.", error);
  }
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Could not clear local learning progress.", error);
    throw error;
  }
}

export function readSoundSetting(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(SETTINGS_KEY) !== "false";
  } catch (error) {
    console.error("Could not read local sound setting.", error);
    return true;
  }
}

export function writeSoundSetting(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, String(enabled));
  } catch (error) {
    console.error("Could not save local sound setting.", error);
  }
}
