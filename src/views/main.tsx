"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/views/main/empty";

export default function MainView() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      const theme = webApp.colorScheme || "dark";
      const bgColor = theme === "dark" ? "#000000" : "#FFFFFF";
      
      webApp.setHeaderColor(bgColor);
      webApp.setBackgroundColor(bgColor);
    }

    // Имитируем профессиональную подгрузку контента (резкий свап через 1.8 сек)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300">
      
      {/* ХЕДЕР С ПОДДЕРЖКОЙ СКЕЛЕТОНА */}
      <header className="absolute top-[var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))] left-0 right-0 h-11 flex items-center justify-center z-50 pointer-events-none select-none">
        {isLoading ? (
          <div className="flex items-center space-x-2.5 animate-pulse">
            {/* Квадрат под мини-лого */}
            <div className="w-5 h-5 bg-neutral-300 dark:bg-neutral-800 rounded-sm" />
            {/* Прямоугольник под текст ЙОУЙОУ */}
            <div className="w-16 h-4 bg-neutral-300 dark:bg-neutral-800 rounded-sm" />
          </div>
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
