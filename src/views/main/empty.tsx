"use client";

import Lottie from "lottie-light-react";
import noneAnimation from "@/../public/icons/none.json";

interface EmptyStateProps {
  isLoading?: boolean;
}

export default function EmptyState({ isLoading = false }: EmptyStateProps) {
  const handleTryAgain = () => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try {
          anyWindow.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
        } catch (e) {}
      }
    }
  };

  // Режим заглушки (Skeleton)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full px-6 select-none animate-pulse">
        <div className="flex flex-col items-center max-w-[260px] w-full space-y-4">
          {/* Иллюстрация в скелетоне тоже чуть крупнее под размер Lottie */}
          <div className="w-[120px] h-[120px] bg-neutral-300 dark:bg-neutral-800 rounded-2xl mb-1" />
          
          {/* Заголовок */}
          <div className="w-48 h-5 bg-neutral-300 dark:bg-neutral-800 rounded-md" />
          
          {/* Текст описания */}
          <div className="w-full flex flex-col items-center space-y-2 pt-1">
            <div className="w-full h-3.5 bg-neutral-300 dark:bg-neutral-800 rounded-md" />
            <div className="w-[85%] h-3.5 bg-neutral-300 dark:bg-neutral-800 rounded-md" />
          </div>
          
          {/* Скелетон кнопки под размер h-11 */}
          <div className="w-full h-11 bg-neutral-300 dark:bg-neutral-800 rounded-full mt-1" />
        </div>
      </div>
    );
  }

  // Рабочее состояние
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-6 select-none">
      <div className="flex flex-col items-center max-w-[260px] w-full">
        {/* Lottie вместо картинки, на 24px крупнее исходного */}
        <div className="w-[120px] h-[120px] flex items-center justify-center mb-4">
          <Lottie 
            animationData={noneAnimation} 
            loop={true} 
            autoplay={true}
            className="w-full h-full object-contain"
          />
        </div>

        <h2 className="text-lg font-bold tracking-tight text-center text-appleLight-text dark:text-appleDark-text">
          Тут 100 проц что-то есть
        </h2>
        <p className="text-sm font-medium text-center text-appleLight-text/75 dark:text-appleDark-text/75 mt-1">
          Но у тебя этого пока не видно. Проверь там свое соединение, чтоль
        </p>
        
        {/* Кнопка сохранила исходный размер h-11 и стиль */}
        <button 
          onClick={handleTryAgain}
          className="w-full mt-5 h-11 bg-[#FC062D] text-white font-semibold text-sm rounded-full outline-none active:scale-[0.98] transition-all duration-150"
        >
          Попытаться снова
        </button>
      </div>
    </div>
  );
}
