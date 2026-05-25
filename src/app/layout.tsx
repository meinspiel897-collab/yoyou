"use client";

import "./globals.css";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        requestFullscreen: () => void;
        isVerticalSwipesEnabled: boolean;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        colorScheme: "light" | "dark";
        headerColor: string;
        backgroundColor: string;
        initDataUnsafe?: {
          user?: {
            language_code?: string;
          };
        };
        HapticFeedback: {
          impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
          notificationOccurred: (type: "error" | "success" | "warning") => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      webApp.expand();
      
      try {
        webApp.isVerticalSwipesEnabled = false;
      } catch (e) {}

      const tgLang = webApp.initDataUnsafe?.user?.language_code;
      if (tgLang === "ru" || tgLang === "en") {
        setLang(tgLang);
      }

      const theme = webApp.colorScheme || "dark";
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, []);

  return (
    <html lang={lang} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <script src="https://telegram.org/js/telegram-web-app.js" defer></script>
      </head>
      <body className="bg-appleLight-bg text-appleLight-text dark:bg-appleDark-bg dark:text-appleDark-text antialiased w-full h-full font-inter">
        {children}
      </body>
    </html>
  );
}
