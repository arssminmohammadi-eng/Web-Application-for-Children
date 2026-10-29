import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "سه‌زبانه — واژه‌آموزی برای کودکان",
    short_name: "سه‌زبانه",
    description: "یادگیری واژه‌های فارسی، عربی و انگلیسی با بازی",
    start_url: "/",
    display: "standalone",
    background_color: "#fff9f0",
    theme_color: "#fff9f0",
    lang: "fa",
    dir: "rtl",
    icons: [
      {
        src: "/icons/app-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
