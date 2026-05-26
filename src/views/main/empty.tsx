"use client";

import Lottie from "lottie-light-react";
import noneAnimation from "@/../public/icons/none.json";

interface EmptyStateProps {
  isLoading?: boolean;
}

export default function EmptyState({ isLoading = false }: EmptyStateProps) {
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 box-border">
        <div className="w-48 h-48 bg-neutral-300 dark:bg-neutral-800 rounded-full animate-pulse" />
        <div className="w-32 h-4 bg-neutral-300 dark:bg-neutral-800 rounded-md mt-5 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 box-border select-none pointer-events-none">
      {/* Контейнер для Lottie — сделали крупнее, с авто-выравниванием */}
      <div className="w-56 h-56 flex items-center justify-center">
        <Lottie 
          animationData={noneAnimation} 
          loop={true} 
          autoplay={true}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Текст под анимацией, если нужен (можно удалить строку ниже, если там должна быть только анимация) */}
      <p className="text-xs font-semibold text-appleLight-text/35 dark:text-appleDark-text/35 mt-3 tracking-wide">
        Здесь пока ничего нет
      </p>
    </div>
  );
}
