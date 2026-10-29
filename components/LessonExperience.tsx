"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Gamepad2, Star, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Illustration from "@/components/Illustration";
import MiniGame from "@/components/MiniGame";
import TriText from "@/components/TriText";
import WordRow from "@/components/WordRow";
import { useAudio } from "@/hooks/useAudio";
import {
  readProgress,
  readSoundSetting,
  writeProgress,
  writeSoundSetting,
} from "@/lib/progress";
import { getTopicInfo, topics } from "@/lib/words";
import type { CSSProperties } from "react";
import type { Language, Progress, TopicId, Word } from "@/lib/types";

const languages: Language[] = ["fa", "ar", "en"];
const languageNames: Record<Language, string> = {
  fa: "فارسی",
  ar: "العربية",
  en: "English",
};

export default function LessonExperience({
  topic,
  words,
}: {
  topic: TopicId;
  words: Word[];
}) {
  const topicInfo = getTopicInfo(topic);
  const [index, setIndex] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [progress, setProgress] = useState<Progress>({
    learned: [],
    stars: 0,
    activeLang: "fa",
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const current = words[index];
  const { playing, play, playAll, playFeedback, stop } = useAudio(soundEnabled);
  const isPlaying = playing?.wordId === current.id;

  useEffect(() => {
    const saved = readProgress();
    setProgress(saved);
    setSoundEnabled(readSoundSetting());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.controller?.postMessage({
        type: "CACHE_URLS",
        urls: [
          `/lesson/${topic}`,
          ...new Set(words.map((word) => word.image)),
        ],
      });
    }
  }, [topic, words]);

  const updateProgress = (next: Progress) => {
    setProgress(next);
    writeProgress(next);
  };

  const selectLanguage = () => {
    const nextLanguage =
      languages[(languages.indexOf(progress.activeLang) + 1) % languages.length];
    updateProgress({ ...progress, activeLang: nextLanguage });
  };

  const markLearned = () => {
    if (progress.learned.includes(current.id)) return;
    updateProgress({ ...progress, learned: [...progress.learned, current.id] });
  };

  const answerCorrect = () => {
    void playFeedback();
    updateProgress({
      ...progress,
      learned: progress.learned.includes(current.id)
        ? progress.learned
        : [...progress.learned, current.id],
      stars: progress.stars + 1,
    });
  };

  const moveWord = (direction: -1 | 1) => {
    markLearned();
    stop();
    setShowGame(false);
    setIndex((previous) => (previous + direction + words.length) % words.length);
  };

  const toggleSound = () => {
    const enabled = !soundEnabled;
    if (!enabled) stop();
    setSoundEnabled(enabled);
    writeSoundSetting(enabled);
  };

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="بازگشت به موضوعات، العودة للمواضيع، Back to topics">
          <span className="brand-mark">
            <ArrowRight aria-hidden="true" />
          </span>
          <TriText fa="بازگشت" ar="عودة" en="Back" />
        </Link>
        <div className="tri-stack">
          <span lang="fa" dir="rtl" className="font-fa">{topicInfo.names.fa}</span>
          <span lang="ar" dir="rtl" className="font-ar">{topicInfo.names.ar}</span>
          <span lang="en" dir="ltr" className="font-en">{topicInfo.names.en}</span>
        </div>
        <div className="header-actions">
          <button
            className="small-button"
            type="button"
            onClick={selectLanguage}
            aria-label="تغییر زبان فعال، تغيير اللغة، Change active language"
          >
            <span
              className={`font-${progress.activeLang}`}
              lang={progress.activeLang}
              dir={progress.activeLang === "en" ? "ltr" : "rtl"}
            >
              {languageNames[progress.activeLang]}
            </span>
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={toggleSound}
            aria-label={
              soundEnabled
                ? "خاموش کردن صدا، إيقاف الصوت، Mute sound"
                : "روشن کردن صدا، تشغيل الصوت، Enable sound"
            }
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? (
              <Volume2 aria-hidden="true" />
            ) : (
              <VolumeX aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <div className="lesson-layout">
        <aside className="side-panel topics-panel" aria-label="موضوعات">
          <h2 className="side-heading">
            <TriText fa="موضوعات" ar="المواضيع" en="Topics" />
          </h2>
          <nav className="topic-list">
            {topics.map((item) => (
              <Link
                className="topic-list-link"
                href={`/lesson/${item.id}`}
                key={item.id}
                aria-current={item.id === topic ? "page" : undefined}
              >
                <span className="topic-icon" style={{ "--topic-bg": item.background, "--topic-color": item.color } as CSSProperties}>
                  <BookOpen aria-hidden="true" size={20} />
                </span>
                <span className="tri-stack">
                  <span lang="fa" dir="rtl" className="font-fa">{item.names.fa}</span>
                  <span lang="ar" dir="rtl" className="font-ar">{item.names.ar}</span>
                  <span lang="en" dir="ltr" className="font-en">{item.names.en}</span>
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        <section className="lesson-main">
          {!showGame ? (
            <article className="lesson-card" key={current.id}>
              <Illustration word={current} />
              <h1 className="lesson-word-title">
                <TriText fa="با هم یاد بگیریم" ar="لنتعلم معًا" en="Let’s learn together" />
              </h1>
              <div className="word-rows">
                {languages.map((language) => (
                  <WordRow
                    key={language}
                    language={language}
                    entry={current[language]}
                    active={isPlaying && playing?.language === language}
                    play={(selected) => void play(current, selected)}
                  />
                ))}
              </div>
              <div className="action-row">
                <button
                  className="primary-button primary-warm"
                  type="button"
                  onClick={() => void playAll(current)}
                  disabled={!soundEnabled}
                >
                  <Volume2 aria-hidden="true" size={20} />
                  <TriText fa="شنیدن هر سه" ar="استمع إلى اللغات الثلاث" en="Listen to all three" />
                </button>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    stop();
                    setShowGame(true);
                  }}
                >
                  <Gamepad2 aria-hidden="true" size={20} />
                  <TriText fa="بازی کن" ar="العب" en="Play a game" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-3 pt-4">
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => moveWord(-1)}
                  aria-label="واژهٔ قبلی، الكلمة السابقة، Previous word"
                >
                  <ArrowRight aria-hidden="true" />
                </button>
                <span className="desktop-progress-copy">
                  <TriText
                    fa={`واژهٔ ${index + 1} از ${words.length}`}
                    ar={`الكلمة ${index + 1} من ${words.length}`}
                    en={`Word ${index + 1} of ${words.length}`}
                  />
                </span>
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => moveWord(1)}
                  aria-label="واژهٔ بعدی، الكلمة التالية، Next word"
                >
                  <ArrowLeft aria-hidden="true" />
                </button>
              </div>
            </article>
          ) : (
            <div className="lesson-card">
              <MiniGame
                words={words}
                target={current}
                language={progress.activeLang}
                onListen={() => void play(current, progress.activeLang)}
                onCorrect={answerCorrect}
              />
              <button
                className="primary-button primary-warm mt-4 w-full"
                type="button"
                onClick={() => {
                  setShowGame(false);
                  moveWord(1);
                }}
              >
                <TriText fa="واژهٔ بعدی" ar="الكلمة التالية" en="Next word" />
              </button>
              <button
                className="primary-button mt-2 w-full"
                type="button"
                onClick={() => setShowGame(false)}
              >
                <TriText fa="بازگشت به درس" ar="العودة إلى الدرس" en="Back to lesson" />
              </button>
            </div>
          )}
        </section>

        <aside className="side-panel progress-panel" id="progress">
          <h2 className="side-heading">
            <TriText fa="پیشرفت تو" ar="تقدمك" en="Your progress" />
          </h2>
          <div className="progress-summary">
            <Star className="progress-star" aria-hidden="true" size={42} />
            <span className="progress-number">{progress.stars}</span>
            <TriText fa="ستارهٔ تشویقی" ar="نجوم التشجيع" en="Happy stars" />
          </div>
          <div className="progress-meter" aria-label={`پیشرفت ${progress.learned.length} از ${words.length}`}>
            <span style={{ width: `${Math.min(100, (progress.learned.length / words.length) * 100)}%` }} />
          </div>
          <p className="desktop-progress-copy">
            <TriText
              fa={`${progress.learned.length} از ${words.length} واژه`}
              ar={`${progress.learned.length} من ${words.length} كلمات`}
              en={`${progress.learned.length} of ${words.length} words`}
            />
          </p>
        </aside>
      </div>

      <BottomNav onGame={() => setShowGame(true)} />
    </main>
  );
}
