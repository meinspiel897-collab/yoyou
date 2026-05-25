"use client";

import { useEffect } from "react";
import EmptyState from "@/views/main/empty";

interface MainViewProps {
  isLoading?: boolean; // Управляется исключительно реальным состоянием загрузки данных сверху
}

export default function MainView({ isLoading = false }: MainViewProps) {
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
      
      {/* ХЕДЕР С ОБЪЕДИНЕННЫМ СКЕЛЕТОНОМ */}
      <header className="absolute top-[var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))] left-0 right-0 h-11 flex items-center justify-center z-50 pointer-events-none select-none">
        {isLoading ? (
          // Один общий слитный прямоугольник вместо мелких деталей хедера
          <div className="w-24 h-5 bg-neutral-300 dark:bg-neutral-800 rounded-md animate-pulse" />
        ) : (
          <div className="flex items-center space-x-2.5">
            <img 
              src="/icons/logo.png" 
              alt="Логотип" 
              className="w-5 h-5 object-contain"
            />
            <h1 className="text-base font-extrabold tracking-tight text-appleLight-text dark:text-appleDark-text" style={{ fontFamily: "'Manrope', sans-serif" }}>
              ЙОУЙОУ
            </h1>
          </div>
        )}
      </header>
      
      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 w-full pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] overflow-hidden">
        <EmptyState isLoading={isLoading} />
      </main>
    </div>
  );
}
