"use client";

import { useState } from "react";
import { Star, Volume2 } from "lucide-react";
import Illustration from "@/components/Illustration";
import TriText from "@/components/TriText";
import type { Language, Word } from "@/lib/types";

export default function MiniGame({
  words,
  target,
  language,
  onListen,
  onCorrect,
}: {
  words: readonly Word[];
  target: Word;
  language: Language;
  onListen: () => void;
  onCorrect: () => void;
}) {
  const [answered, setAnswered] = useState(false);
  const targetIndex = words.findIndex((word) => word.id === target.id);
  const options = Array.from({ length: Math.min(3, words.length) }, (_, index) =>
    words[(targetIndex + index) % words.length],
  );
  const languageLabel =
    language === "fa" ? "فارسی" : language === "ar" ? "العربية" : "English";

  const choose = (word: Word) => {
    if (answered) return;
    if (word.id === target.id) {
      setAnswered(true);
      onCorrect();
    } else {
      onListen();
    }
  };

  return (
    <section className="game-panel motion-safe-enter" aria-live="polite">
      <h2 className="side-heading">
        <TriText
          fa="صدا را بشنو و تصویر را بزن"
          ar="استمع إلى الكلمة واختر الصورة"
          en="Listen and choose the picture"
        />
      </h2>
      <p className="desktop-progress-copy">
        <TriText
          fa={`به ${languageLabel} گوش کن.`}
          ar={`استمع إلى ${languageLabel}.`}
          en={`Listen in ${languageLabel}.`}
        />
      </p>
      <button className="primary-button primary-warm" type="button" onClick={onListen}>
        <Volume2 aria-hidden="true" size={20} />
        <TriText fa="گوش کن" ar="استمع" en="Listen" />
      </button>
      <div className="game-options">
        {options.map((word) => (
          <button
            className="answer-card"
            type="button"
            key={word.id}
            onClick={() => choose(word)}
            disabled={answered}
            aria-label={`${word.fa.word}, ${word.ar.word}, ${word.en.word}`}
          >
            <Illustration word={word} />
          </button>
        ))}
      </div>
      <div className="game-feedback is-happy" aria-live="polite">
        {answered ? (
          <span className="reward-message inline-flex items-center gap-2">
            <Star className="reward-star" aria-hidden="true" size={21} />
            <TriText fa="آفرین! یک ستاره گرفتی" ar="أحسنت! حصلت على نجمة" en="Great! You earned a star" />
            <i className="reward-particle" aria-hidden="true" />
            <i className="reward-particle" aria-hidden="true" />
            <i className="reward-particle" aria-hidden="true" />
          </span>
        ) : (
          <TriText fa="هر وقت آماده‌ای، یک تصویر را بزن." ar="اختر صورة عندما تكون مستعدًا." en="Tap a picture when you are ready." />
        )}
      </div>
    </section>
  );
}
