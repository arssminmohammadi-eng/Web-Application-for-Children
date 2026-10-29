"use client";

import { Volume2 } from "lucide-react";
import type { Language } from "@/lib/types";
import TriText from "@/components/TriText";

const labels: Record<Language, { fa: string; ar: string; en: string }> = {
  fa: { fa: "پخش فارسی", ar: "استمع بالفارسية", en: "Play Persian" },
  ar: { fa: "پخش عربی", ar: "استمع بالعربية", en: "Play Arabic" },
  en: { fa: "پخش انگلیسی", ar: "استمع بالإنجليزية", en: "Play English" },
};

export default function AudioButton({
  language,
  active,
  onClick,
}: {
  language: Language;
  active: boolean;
  onClick: () => void;
}) {
  const label = labels[language];
  return (
    <button
      className={`audio-button ${active ? "is-playing" : ""}`}
      type="button"
      aria-label={`${label.en}: ${label.fa}، ${label.ar}`}
      aria-pressed={active}
      onClick={onClick}
    >
      <Volume2 aria-hidden="true" size={22} />
      <TriText
        fa="صدا"
        ar="صوت"
        en="Sound"
        className="visually-hidden"
      />
    </button>
  );
}
