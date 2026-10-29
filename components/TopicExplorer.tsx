"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Illustration from "@/components/Illustration";
import TriText from "@/components/TriText";
import { readProgress } from "@/lib/progress";
import { topics, wordsByTopic } from "@/lib/words";
import type { Progress } from "@/lib/types";

export default function TopicExplorer() {
  const [progress, setProgress] = useState<Progress>({
    learned: [],
    stars: 0,
    activeLang: "fa",
  });

  useEffect(() => setProgress(readProgress()), []);

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="سه‌زبانه، ثلاث لغات، Three Languages">
          <span className="brand-mark">
            <BookOpen aria-hidden="true" />
          </span>
          <TriText fa="سه‌زبانه" ar="ثلاث لغات" en="Three Languages" />
        </Link>
        <div className="header-actions">
          <Link className="small-button" href="/parent">
            <TriText fa="والدین" ar="الوالدان" en="Parents" />
          </Link>
          <div className="small-button" aria-label="ستاره‌های شما">
            <Star aria-hidden="true" size={19} color="#aa7417" />
            <span>{progress.stars}</span>
          </div>
        </div>
      </header>

      <section className="content-wrap" id="topics">
        <div className="page-heading">
          <h1>
            <TriText
              fa="کلمه‌های کوچک، دنیای بزرگ"
              ar="كلمات صغيرة، عالم كبير"
              en="Little words, big world"
            />
          </h1>
          <p>
            <TriText
              fa="یک موضوع را انتخاب کن و با هم یاد بگیریم."
              ar="اختر موضوعًا لنتعلم معًا."
              en="Choose a topic and let’s learn together."
            />
          </p>
        </div>

        <div className="home-grid">
          {topics.map((topic) => {
            const words = wordsByTopic[topic.id];
            const sample = words[topic.id === "numbers" ? 1 : 0];
            return (
              <Link
                className="topic-card"
                href={`/lesson/${topic.id}`}
                key={topic.id}
                style={
                  {
                    "--topic-color": topic.color,
                    "--topic-bg": topic.background,
                  } as CSSProperties
                }
              >
                <span className="topic-icon" aria-hidden="true">
                  <Illustration word={sample} className="topic-card-art" />
                </span>
                <span className="topic-copy">
                  <strong className="tri-stack">
                    <span lang="fa" dir="rtl" className="font-fa">{topic.names.fa}</span>
                    <span lang="ar" dir="rtl" className="font-ar">{topic.names.ar}</span>
                    <span lang="en" dir="ltr" className="font-en">{topic.names.en}</span>
                  </strong>
                  <span className="topic-count">
                    <TriText
                      fa={`${words.length} واژه`}
                      ar={`${words.length} كلمات`}
                      en={`${words.length} words`}
                    />
                  </span>
                  <ArrowLeft aria-hidden="true" size={18} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
