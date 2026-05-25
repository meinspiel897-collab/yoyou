"use client";

import { useEffect } from "react";

export default function MainView() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      const theme = webApp.colorScheme || "dark";
      const bgColor = theme === "dark" ? "#000000" : "#FFFFFF";
      
      webApp.setHeaderColor(bgColor);
      webApp.setBackgroundColor(bgColor);
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300">
      <header className="absolute top-[var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))] left-0 right-0 h-11 flex items-center justify-center z-50 pointer-events-none select-none">
        <div className="flex items-center space-x-2.5">
          <img 
            src="/icons/logo.png" 
            alt="Логотип" 
            className="w-5 h-5 object-contain"
          />
          <h1 className="text-base font-semibold tracking-tight text-appleLight-text dark:text-appleDark-text">
            ЙОУЙОУ
          </h1>
        </div>
      </header>
      
      <main className="flex-1 w-full pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] overflow-hidden">
      </main>
    </div>
  );
}
