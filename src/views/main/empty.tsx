"use client";

import { useState } from "react";
import Lottie from "lottie-light-react";
import noneAnimation from "@/../public/icons/none.json";
import none2Animation from "@/../public/icons/none2.json";
import none3Animation from "@/../public/icons/none3.json";

// Обновленные типы под новый порядок вкладок
type TabType = "trending" | "events" | "favorites";

interface EmptyStateProps {
  isLoading?: boolean;
  activeTab: TabType;
}

export default function EmptyState({ isLoading = false, activeTab }: EmptyStateProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTryAgain = () => {
    if (isRefreshing) return;

    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try {
          anyWindow.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
        } catch (e) {}
      }
    }

    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  // Рокировка контента: первая вкладка забрала анимацию удаленной «Ленты», а «Избранное» забрало анимацию «Трендов»
  const tabContent = {
    trending: {
      animation: noneAnimation,
      title: "Тут 100 проц что-то есть",
      desc: "Но в трендах этого пока не видно. Проверь там соединение, чтоль",
    },
    events: {
      animation: none2Animation,
      title: "Либо все дома, либо движ отменили",
      desc: "Календарь пустой, ивентов ноль. Попробуй обновить, вдруг че залетит",
    },
    favorites: {
      animation: none3Animation,
      title: "Хайп еще не подвезли",
      desc: "Избранное чистое как моя совесть. Давай рефрешнем, пока админы спят",
    },
  };

  const currentContent = tabContent[activeTab] || tabContent.trending;

  // Режим скелетона при загрузке
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full px-6 select-none animate-pulse">
        <div className="flex flex-col items-center max-w-[260px] w-full space-y-4">
          <div className="w-[120px] h-[120px] bg-neutral-300 dark:bg-neutral-800 rounded-2xl mb-1" />
          <div className="w-48 h-5 bg-neutral-300 dark:bg-neutral-800 rounded-md" />
          <div className="w-full flex flex-col items-center space-y-2 pt-1">
            <div className="w-full h-3.5 bg-neutral-300 dark:bg-neutral-800 rounded-md" />
            <div className="w-[85%] h-3.5 bg-neutral-300 dark:bg-neutral-800 rounded-md" />
          </div>
          <div className="w-full h-11 bg-neutral-300 dark:bg-neutral-800 rounded-full mt-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-6 select-none">
      <div className="flex flex-col items-center max-w-[260px] w-full">
        <div className="w-[120px] h-[120px] flex items-center justify-center mb-4">
          <Lottie 
            animationData={currentContent.animation} 
            loop={true} 
            autoplay={true}
            className="w-full h-full object-contain"
          />
        </div>

        <h2 className="text-lg font-bold tracking-tight text-center text-appleLight-text dark:text-appleDark-text">
          {currentContent.title}
        </h2>
        <p className="text-sm font-medium text-center text-appleLight-text/75 dark:text-appleDark-text/75 mt-1">
          {currentContent.desc}
        </p>
        
        <button 
          onClick={handleTryAgain}
          disabled={isRefreshing}
          className={`w-full mt-5 h-11 font-semibold text-sm rounded-full outline-none flex items-center justify-center transition-all duration-300 select-none ${
            isRefreshing 
              ? "bg-[#1C1C1E] text-[#8E8E93] cursor-default" 
              : "bg-[#FC062D] text-white active:scale-[0.98]"
          }`}
        >
          {isRefreshing ? (
            <svg 
              className="animate-spin h-5 w-5 text-neutral-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="3"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            "Попытаться снова"
          )}
        </button>
      </div>
    </div>
  );
}
