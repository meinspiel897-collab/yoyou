"use client";

import { useEffect, useState, useRef } from "react";
import EmptyState from "@/views/main/empty";

interface MainViewProps {
  isLoading?: boolean;
}

type TabType = "feed" | "events";

export default function MainView({ isLoading = false }: MainViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      const theme = webApp.colorScheme || "dark";
      const bgColor = theme === "dark" ? "#000000" : "#FFFFFF";
      
      webApp.setHeaderColor(bgColor);
      webApp.setBackgroundColor(bgColor);
    }
  }, []);

  const triggerHaptic = (style: "light" | "medium") => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try {
          anyWindow.Telegram.WebApp.HapticFeedback.impactOccurred(style);
        } catch (e) {}
      }
    }
  };

  const handleTabClick = (tab: TabType) => {
    if (tab !== activeTab) {
      triggerHaptic("light");
      setActiveTab(tab);
    }
  };

  const enableSearch = () => {
    triggerHaptic("light");
    setIsSearching(true);
    // Мягкий фокус на инпут после анимации открытия
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const disableSearch = () => {
    triggerHaptic("light");
    setIsSearching(false);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300">
      
      {/* ХЕДЕР С ОБЪЕДИНЕННЫМ СКЕЛЕТОНОМ */}
      <header className="absolute top-[var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))] left-0 right-0 h-11 flex items-center justify-center z-50 pointer-events-none select-none">
        {isLoading ? (
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
      <main className="flex-1 w-full pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] flex flex-col overflow-hidden">
        
        {/* ИНТЕРАКТИВНАЯ ЗОНА УПРАВЛЕНИЯ (ЧУЗБАР + ПОИСК) */}
        <div className="w-full max-w-[340px] mx-auto px-6 pt-3 box-border">
          {isLoading ? (
            // Скелетон всей панели управления в одну линию
            <div className="w-full h-10 bg-neutral-300 dark:bg-neutral-800 rounded-full animate-pulse" />
          ) : (
            <div className="relative w-full h-10 flex items-center justify-between">
              
              {/* ХОДОВОЙ КОНТЕЙНЕР ДЛЯ ЧУЗБАРА */}
              <div 
                className="h-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg p-0.5 box-border rounded-full flex relative transition-all duration-300 cubic-bezier(0.25, 1, 0.5, 1)"
                style={{
                  // Когда ищем — зажимаем ширину табов в ноль, когда не ищем — отдаем всю ширину минус кнопка поиска
                  width: isSearching ? "0px" : "calc(100% - 48px)",
                  opacity: isSearching ? 0 : 1,
                  visibility: isSearching ? "hidden" : "visible",
                  pointerEvents: isSearching ? "none" : "auto",
                }}
              >
                {/* Скользящий задний фон под активным табом */}
                <div 
                  className="absolute top-0.5 bottom-0.5 bg-white dark:bg-neutral-800 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-transform duration-250 ease-out"
                  style={{
                    width: "calc(50% - 2px)",
                    transform: activeTab === "feed" ? "translateX(0)" : "translateX(100%)",
                  }}
                />

                {/* Таб: Лента */}
                <button
                  onClick={() => handleTabClick("feed")}
                  className={`flex-1 h-full rounded-full text-xs font-bold z-10 transition-colors duration-200 outline-none ${
                    activeTab === "feed" 
                      ? "text-appleLight-text dark:text-appleDark-text" 
                      : "text-appleLight-text/50 dark:text-appleDark-text/50"
                  }`}
                >
                  Лента
                </button>

                {/* Таб: События */}
                <button
                  onClick={() => handleTabClick("events")}
                  className={`flex-1 h-full rounded-full text-xs font-bold z-10 transition-colors duration-200 outline-none ${
                    activeTab === "events" 
                      ? "text-appleLight-text dark:text-appleDark-text" 
                      : "text-appleLight-text/50 dark:text-appleDark-text/50"
                  }`}
                >
                  События
                </button>
              </div>

              {/* МОРФИНГ-ОБЪЕКТ: КРУГЛАЯ КНОПКА ПОИСКА -> СТРОКА ВВОДА */}
              <div 
                className="h-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-full transition-all duration-300 cubic-bezier(0.25, 1, 0.5, 1) flex items-center relative"
                style={{
                  width: isSearching ? "100%" : "40px",
                  padding: isSearching ? "0 14px" : "0px",
                }}
              >
                {isSearching ? (
                  // Полноценный инпут в режиме поиска
                  <div className="w-full h-full flex items-center justify-between">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Поиск..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[calc(100%-24px)] h-full bg-transparent border-none outline-none text-xs font-semibold text-appleLight-text dark:text-appleDark-text placeholder-appleLight-text/40 dark:text-appleDark-text/40"
                    />
                    {/* Кнопка "Закрыть/Сбросить" крестик */}
                    <button 
                      onClick={disableSearch}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-appleLight-text/10 dark:bg-white/10 outline-none active:scale-90 transition-transform"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="stroke-appleLight-text dark:stroke-appleDark-text stroke-[1.5]">
                        <path d="M1 1L9 9M9 1L1 9" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  // Иконка-кнопка в режиме покоя
                  <button
                    onClick={enableSearch}
                    className="w-full h-full flex items-center justify-center rounded-full outline-none active:scale-95 transition-transform"
                  >
                    <img 
                      src="/icons/search.png" 
                      alt="Поиск" 
                      className="w-4 h-4 object-contain opacity-70 dark:opacity-90"
                    />
                  </button>
                )}
              </div>

            </div>
          )}
        </div>

        {/* НИЖНЯЯ ПАНЕЛЬ С КОНТЕНТОМ */}
        <div className="flex-1 w-full">
          <EmptyState isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
