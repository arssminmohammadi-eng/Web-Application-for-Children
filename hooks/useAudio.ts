"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Language, Word } from "@/lib/types";
import {
  audioCache,
  getCachedAudio,
  speakWithBrowser,
  type AudioTrack,
  type PlaybackState,
} from "@/lib/audio";

const silence = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

export function useAudio(enabled: boolean) {
  const [playing, setPlaying] = useState<PlaybackState>(null);
  const generation = useRef(0);

  const stop = useCallback(() => {
    generation.current += 1;
    for (const audio of audioCache.values()) {
      audio.pause();
      audio.currentTime = 0;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(null);
  }, []);

  useEffect(() => stop, [stop]);

  const playTrack = useCallback(
    async (track: AudioTrack, wordId: string, token: number) => {
      setPlaying({ wordId, language: track.language });
      if (!enabled) return;

      if (track.url) {
        const audio = getCachedAudio(track.url);
        audio.currentTime = 0;
        const result = await new Promise<"ended" | "failed" | "stopped">(
          (resolve) => {
            let completed = false;
            const finish = (status: "ended" | "failed" | "stopped") => {
              if (completed) return;
              completed = true;
              audio.onended = null;
              audio.onerror = null;
              audio.onpause = null;
              resolve(status);
            };
            audio.onended = () => finish("ended");
            audio.onerror = () => finish("failed");
            audio.onpause = () => {
              if (generation.current !== token) finish("stopped");
            };
            audio.play().catch(() => finish("failed"));
          },
        );
        if (result === "stopped" || generation.current !== token) return;
        if (result === "ended") return;
      }

      if (generation.current === token) {
        await speakWithBrowser(track.text, track.language);
      }
    },
    [enabled],
  );

  const play = useCallback(
    async (word: Word, language: Language) => {
      stop();
      const token = generation.current;
      const entry = word[language];
      await playTrack(
        { language, text: entry.word, url: entry.audio },
        word.id,
        token,
      );
      if (generation.current === token) setPlaying(null);
    },
    [playTrack, stop],
  );

  const playAll = useCallback(
    async (word: Word) => {
      stop();
      const token = generation.current;
      const languages: Language[] = ["fa", "ar", "en"];
      for (const language of languages) {
        if (generation.current !== token) return;
        const entry = word[language];
        await playTrack(
          { language, text: entry.word, url: entry.audio },
          word.id,
          token,
        );
        if (generation.current !== token) return;
        if (language !== "en") await silence(600);
      }
      if (generation.current === token) setPlaying(null);
    },
    [playTrack, stop],
  );

  const playFeedback = useCallback(
    async () => {
      if (!enabled) return;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      const AudioContextConstructor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextConstructor) return;

      const context = new AudioContextConstructor();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(660, context.currentTime);
      oscillator.frequency.setValueAtTime(880, context.currentTime + 0.12);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.31);
      oscillator.onended = () => {
        void context.close();
      };
    },
    [enabled],
  );

  return { playing, play, playAll, playFeedback, stop };
}
