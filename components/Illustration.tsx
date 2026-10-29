import {
  Beef,
  Bird,
  Cat,
  Circle,
  Dog,
  PawPrint,
  Palette,
  Shapes,
  Square,
  Star,
  Triangle,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { Word } from "@/lib/types";

const illustrations: Record<string, LucideIcon> = {
  Beef,
  Bird,
  Cat,
  Circle,
  Dog,
  PawPrint,
  Palette,
  Shapes,
  Square,
  Star,
  Triangle,
  UserRound,
};

export default function Illustration({
  word,
  className = "",
}: {
  word: Word;
  className?: string;
}) {
  if (word.count !== undefined) {
    return (
      <div
        className={`lesson-art ${className}`}
        role="img"
        aria-label={`${word.fa.word} — ${word.ar.word} — ${word.en.word}`}
      >
        <span className={`number-art ${word.count === 0 ? "number-art-zero" : ""}`} aria-hidden="true">
          {word.count === 0 ? (
            <span className="number-zero" />
          ) : (
            Array.from({ length: word.count }, (_, index) => (
              <span className="number-dot" key={index} />
            ))
          )}
        </span>
      </div>
    );
  }

  if (word.color) {
    return (
      <div
        className={`lesson-art ${className}`}
        role="img"
        aria-label={`${word.fa.word} — ${word.ar.word} — ${word.en.word}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 160 160"
          width="150"
          height="150"
        >
          <circle cx="80" cy="80" r="52" fill={word.color} stroke="#2b2d42" strokeWidth="4" />
          <circle cx="62" cy="60" r="12" fill="#ffffff" opacity=".55" />
        </svg>
      </div>
    );
  }

  const Icon = illustrations[word.icon] ?? Shapes;
  return (
    <div
      className={`lesson-art ${className}`}
      role="img"
      aria-label={`${word.fa.word} — ${word.ar.word} — ${word.en.word}`}
    >
      <Icon aria-hidden="true" />
    </div>
  );
}
