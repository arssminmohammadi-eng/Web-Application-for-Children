import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito";
import "next-persian-fonts/css/vazirmatn-variable.css";
import "next-persian-fonts/css/noto-naskh-arabic.css";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "سه‌زبانه | کلمه‌های کوچک، دنیای بزرگ",
  description:
    "یادگیری شاد واژگان فارسی، عربی و انگلیسی برای کودکان، با بازی و صدا.",
  applicationName: "سه‌زبانه",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "سه‌زبانه",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#fff9f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
