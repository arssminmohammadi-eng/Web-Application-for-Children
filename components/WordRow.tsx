"use client";

import AudioButton from "@/components/AudioButton";
import type { Language, WordLanguage } from "@/lib/types";

const rowNames: Record<Language, { label: string; lang: string }> = {
  fa: { label: "فارسی", lang: "fa" },
  ar: { label: "العربية", lang: "ar" },
  en: { label: "English", lang: "en" },
};

export default function WordRow({
  language,
  entry,
  active,
  play,
}: {
  language: Language;
  entry: WordLanguage;
  active: boolean;
  play: (language: Language) => void;
}) {
  const details = rowNames[language];
  return (
    <div
      className={`word-row language-${language} ${active ? "is-playing" : ""}`}
      lang={details.lang}
      dir={language === "en" ? "ltr" : "rtl"}
    >
      <span className="language-label" lang={details.lang}>
        {details.label}
      </span>
      <span className={`word-value font-${language}`} lang={details.lang}>
        {entry.word}
      </span>
      <AudioButton
        language={language}
        active={active}
        onClick={() => play(language)}
      />
    </div>
  );
}
