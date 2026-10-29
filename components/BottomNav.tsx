"use client";

import Link from "next/link";
import { BookOpen, Gamepad2, Settings2, Star } from "lucide-react";
import TriText from "@/components/TriText";

export default function BottomNav({
  onGame,
  progressId = "progress",
}: {
  onGame?: () => void;
  progressId?: string;
}) {
  return (
    <nav className="bottom-nav" aria-label="ناوبری اصلی">
      <Link href="/#topics" aria-label="موضوعات، المواضيع، Topics">
        <BookOpen aria-hidden="true" size={19} />
        <TriText fa="موضوعات" ar="المواضيع" en="Topics" />
      </Link>
      <button type="button" onClick={onGame} aria-label="بازی، العب، Play">
        <Gamepad2 aria-hidden="true" size={19} />
        <TriText fa="بازی" ar="العب" en="Play" />
      </button>
      <Link href={`#${progressId}`} aria-label="پیشرفت، التقدم، Progress">
        <Star aria-hidden="true" size={19} />
        <TriText fa="پیشرفت" ar="التقدم" en="Progress" />
      </Link>
      <Link href="/parent" aria-label="والدین، الوالدان، Parents">
        <Settings2 aria-hidden="true" size={19} />
        <TriText fa="والدین" ar="الوالدان" en="Parents" />
      </Link>
    </nav>
  );
}
