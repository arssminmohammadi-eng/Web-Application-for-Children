import type { ReactNode } from "react";

type TriTextProps = {
  fa: ReactNode;
  ar: ReactNode;
  en: ReactNode;
  className?: string;
};

export default function TriText({ fa, ar, en, className = "" }: TriTextProps) {
  return (
    <span className={`tri-stack ${className}`}>
      <span lang="fa" dir="rtl" className="font-fa">
        {fa}
      </span>
      <span lang="ar" dir="rtl" className="font-ar">
        {ar}
      </span>
      <span lang="en" dir="ltr" className="font-en">
        {en}
      </span>
    </span>
  );
}
