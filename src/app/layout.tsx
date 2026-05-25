"use client";

import "./globals.css";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        isVerticalSwipesEnabled: boolean;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        colorScheme: "light" | "dark";
        initDataUnsafe?: {
          user?: {
            language_code?: string;
          };
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <script src="https://telegram.org/js/telegram-web-app.js" defer></script>
      </head>
      <body className="bg-appleLight-bg text-appleLight-text dark:bg-appleDark-bg dark:text-appleDark-text antialiased w-full h-full overflow-hidden fixed select-none">
        {children}
      </body>
    </html>
  );
}
