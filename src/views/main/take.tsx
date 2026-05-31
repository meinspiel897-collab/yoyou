"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-light-react"), { ssr: false });

interface TakeViewProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  animationData: any;
}

export default function TakeView({
  title, // Это наш текст тейка
  setTitle,
  description, // Это наш контекст (теперь заголовок)
  setDescription,
  animationData,
}: TakeViewProps) {
  
  // Флаг фокуса на любом из полей ввода для адаптации под клавиатуру
  const [isFocused, setIsFocused] = useState(false);

  const triggerHaptic = (style: "light" | "medium" | "heavy") => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try {
          anyWindow.Telegram.WebApp.HapticFeedback.impactOccurred(style);
        } catch (e) {}
      }
    }
  };

  // Кнопка активна ТОЛЬКО если заполнены оба обязательных поля
  const isFormValid = title.trim().length > 0 && description.trim().length > 0;

  const handleMainButtonClick = () => {
    if (!isFormValid) return;
    triggerHaptic("medium");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      
      {/* СКРОЛЛ-ЗОНА КОНТЕНТА */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col transition-all duration-200 scrollbar-none space-y-4">
        
        {/* Шапка таба с Lottie-анимацией (скрывается при фокусе, экономя место) */}
        {!isFocused && (
          <div className="flex items-start space-x-3.5 px-1 min-h-[52px] select-none pt-1 transition-all duration-200">
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
              {animationData ? (
                <Lottie 
                  animationData={animationData} 
                  loop={true} 
                  style={{ width: 24, height: 24 }}
                />
              ) : (
                <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
              )}
            </div>
            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 leading-relaxed">
              Выдай свой самый лучший тейк! Пускай толпа решает, гений ты или пускаешь кринж.
            </p>
          </div>
        )}

        {/* 1. Поле: Контекст (Тема / Заголовок) — ТЕПЕРЬ НАВЕРХУ И ОБЯЗАТЕЛЬНО */}
        <div className="flex flex-col space-y-1.5 pt-1">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none flex justify-between">
            <span>Контекст / Тема</span>
            <span className="text-[#FC062D] text-[10px] font-bold uppercase tracking-wider">Обязательно</span>
          </label>
          <div className="w-full h-11 bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-full flex items-center px-4 transition-colors duration-200">
            <input
              type="text"
              placeholder="Например: SWGOH Bot, Музыка, UI/UX"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 40))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={40}
              className="flex-1 h-full bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text placeholder-neutral-300 dark:placeholder-neutral-600"
            />
            <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-600 ml-2 select-none tracking-wide">
              {description.length}/40
            </span>
          </div>
        </div>

        {/* 2. Поле: Текст Тейка (Занимает максимум места, когда клавиатура поднята) */}
        <div className="flex-1 flex flex-col space-y-1.5 min-h-[160px]">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
            Твой тейк
          </label>
          <div className="flex-1 w-full bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-[24px] flex items-start p-4 transition-colors duration-200 relative min-h-[130px]">
            <textarea
              placeholder="Пиши всё, что думаешь..."
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 750))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={750}
              className="w-full h-full bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text placeholder-neutral-300 dark:placeholder-neutral-600 resize-none overflow-y-auto pr-2 leading-snug scrollbar-none"
            />
            <span className="absolute right-4 bottom-3.5 text-[11px] font-bold text-neutral-400 dark:text-neutral-600 select-none tracking-wide bg-white dark:bg-neutral-900 pl-1 rounded">
              {title.length}/750
            </span>
          </div>
        </div>

      </div>

      {/* ФИКСИРОВАННЫЙ ПОДВАЛ */}
      <div className={`px-5 pb-8 flex flex-col items-center relative z-40 bg-white dark:bg-neutral-900 flex-shrink-0 select-none transition-all duration-200 ${
        isFocused ? "pt-4" : "pt-9"
      }`}>
        
        <div className="w-full relative flex flex-col items-center">
          
          {/* Плашка подсказки (скрывается при фокусе, чтобы не мешать клавиатуре) */}
          {!isFocused && (
            <div className="absolute -top-7 left-0 right-0 bg-neutral-600 dark:bg-neutral-800 rounded-t-[20px] pt-2 pb-10 text-center pointer-events-none z-10 transition-all duration-200">
              <p className="text-[11px] font-normal text-white dark:text-neutral-200 tracking-wide px-4">
                Твой тейк отправится прямо в общую ленту трендов
              </p>
            </div>
          )}

          {/* Главная кнопка */}
          <div
            onClick={handleMainButtonClick}
            className={`w-full h-14 rounded-full font-bold text-sm transition-all duration-150 outline-none flex items-center justify-center relative z-20 ${
              isFormValid 
                ? "bg-[#FC062D] text-white active:scale-[0.98] cursor-pointer" 
                : "bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg text-appleLight-text/30 dark:text-appleDark-text/30 cursor-default"
            }`}
          >
            <span>Закинуть в тренды</span>
          </div>

        </div>

      </div>

    </div>
  );
}
