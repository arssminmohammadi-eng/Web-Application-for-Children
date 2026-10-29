"use client";

import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import TriText from "@/components/TriText";
import {
  clearProgress,
  readProgress,
  readSoundSetting,
  writeProgress,
  writeSoundSetting,
} from "@/lib/progress";
import type { Language, Progress } from "@/lib/types";

const languages: { id: Language; name: string }[] = [
  { id: "fa", name: "فارسی — العربية — English" },
  { id: "ar", name: "العربية — فارسی — English" },
  { id: "en", name: "English — فارسی — العربية" },
];

function isLanguage(value: string): value is Language {
  return value === "fa" || value === "ar" || value === "en";
}

export default function ParentPanel() {
  const [progress, setProgress] = useState<Progress>({
    learned: [],
    stars: 0,
    activeLang: "fa",
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setProgress(readProgress());
    setSoundEnabled(readSoundSetting());
  }, []);

  const changeLanguage = (activeLang: Language) => {
    const nextProgress = { ...progress, activeLang };
    setProgress(nextProgress);
    writeProgress(nextProgress);
  };

  const changeSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    writeSoundSetting(enabled);
  };

  const reset = () => {
    clearProgress();
    const clean: Progress = { learned: [], stars: 0, activeLang: "fa" };
    setProgress(clean);
    writeProgress(clean);
  };

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <ArrowRight aria-hidden="true" />
          </span>
          <TriText fa="بازگشت" ar="عودة" en="Back" />
        </Link>
        <TriText fa="راهنمای والدین" ar="دليل الوالدين" en="Parents" />
      </header>
      <section className="parent-wrap">
        <div className="page-heading">
          <h1>
            <TriText fa="تنظیمات خانواده" ar="إعدادات العائلة" en="Family settings" />
          </h1>
        </div>
        <div className="parent-card">
          <label className="setting-row">
            <span>
              <TriText fa="صدای درس" ar="صوت الدرس" en="Lesson audio" />
            </span>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(event) => changeSound(event.target.checked)}
              aria-label="روشن یا خاموش کردن صدا، تشغيل أو إيقاف الصوت، Toggle sound"
            />
          </label>
          <label className="setting-row">
            <span>
              <TriText fa="زبان پیش‌فرض بازی" ar="اللغة الافتراضية" en="Default language" />
            </span>
            <select
              value={progress.activeLang}
              onChange={(event) => {
                if (isLanguage(event.target.value)) {
                  changeLanguage(event.target.value);
                }
              }}
              aria-label="زبان پیش‌فرض، اللغة الافتراضية، Default language"
            >
              {languages.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.name}
                </option>
              ))}
            </select>
          </label>
          <div className="setting-row">
            <span>
              <TriText
                fa={`پیشرفت: ${progress.learned.length} واژه، ${progress.stars} ستاره`}
                ar={`التقدم: ${progress.learned.length} كلمات، ${progress.stars} نجوم`}
                en={`Progress: ${progress.learned.length} words, ${progress.stars} stars`}
              />
            </span>
          </div>
          <button className="primary-button primary-warm" type="button" onClick={reset}>
            <Trash2 aria-hidden="true" size={20} />
            <TriText fa="پاک‌کردن پیشرفت" ar="مسح التقدم" en="Clear progress" />
          </button>
          <p className="privacy-note">
            <TriText
              fa="حریم خصوصی: هیچ داده‌ای جمع‌آوری نمی‌شود. پیشرفت و تنظیمات فقط روی همین دستگاه ذخیره می‌شوند."
              ar="الخصوصية: لا يتم جمع أي بيانات. يُحفظ التقدم والإعدادات على هذا الجهاز فقط."
              en="Privacy: No data is collected. Progress and settings stay on this device."
            />
          </p>
          <p className="desktop-progress-copy">
            <TriText
              fa="اگر فایل صوتی در دسترس نباشد، از صدای مرورگر استفاده می‌شود."
              ar="إذا لم يتوفر الملف الصوتي، فسيُستخدم صوت المتصفح."
              en="If an audio file is unavailable, your browser’s voice is used."
            />
          </p>
        </div>
      </section>
    </main>
  );
}
