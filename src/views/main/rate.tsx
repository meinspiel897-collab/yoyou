"use client";

import React from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-light-react"), { ssr: false });

interface RateViewProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  animationData: any;
  setIsTyping?: (typing: boolean) => void; // Проп для блокировки свайпов
}

export default function RateView({
  title,
  setTitle,
  description,
  setDescription,
  animationData,
  setIsTyping,
}: RateViewProps) {

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

  const handleMainButtonClick = () => {
    if (!title) return;
    triggerHaptic("medium");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      
      {/* СКРОЛЛ-ЗОНА ФОРМЫ (Единственная зона, которая скроллится при нехватке места) */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col space-y-4 scrollbar-none">
        
        {/* Описание с Lottie */}
        <div className="flex items-start space-x-3.5 px-1 min-h-[52px] select-none pt-1">
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
            Йоу, оценивай все что душа пожелает! Введи название и описание, а наш ИИ сам подгонит классную картиночку. Не зашло - поменяешь в один тап
          </p>
        </div>

        {/* Поле: Название */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
            Название тут
          </label>
          <div className="w-full h-11 bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-full flex items-center px-4 transition-colors duration-200">
            <input
              type="text"
              placeholder="Что угодно"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 20))}
              maxLength={20}
              onFocus={() => setIsTyping?.(true)}
              onBlur={() => setIsTyping?.(false)}
              className="flex-1 h-full bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text placeholder-neutral-300 dark:placeholder-neutral-600"
            />
            <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-600 ml-2 select-none tracking-wide">
              {title.length}/20
            </span>
          </div>
        </div>

        {/* Поле: Описание */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
            Описание здесь
          </label>
          <div className="w-full min-h-[78px] bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-[20px] flex items-start p-3.5 transition-colors duration-200 relative">
            <textarea
              placeholder="Если хочешь, напиши классное описание"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 130))}
              maxLength={130}
              rows={3}
              onFocus={() => setIsTyping?.(true)}
              onBlur={() => setIsTyping?.(false)}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text placeholder-neutral-300 dark:placeholder-neutral-600 resize-none overflow-y-auto h-[48px] pr-14 leading-tight scrollbar-none"
            />
            <span className="absolute right-4 bottom-3.5 text-[11px] font-bold text-neutral-400 dark:text-neutral-600 select-none tracking-wide">
              {description.length}/130
            </span>
          </div>
        </div>

        {/* Поле: Картинки */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
            Картинка
          </label>
          <div className="grid grid-cols-3 gap-3 w-full">
            {[0, 1, 2].map((index) => (
              <div 
                key={index}
                className={`aspect-[3/4] w-full border border-neutral-600 dark:border-neutral-800 rounded-2xl flex items-center justify-center relative overflow-hidden select-none ${
                  index !== 0 ? "bg-neutral-200 dark:bg-neutral-800 animate-pulse" : "bg-neutral-50/50 dark:bg-neutral-950/20"
                }`}
              >
                {index === 0 && (
                  <img 
                    src="/icons/add.png" 
                    alt="Добавить" 
                    className="w-9 h-9 object-contain block dark:brightness-0 dark:invert opacity-25"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ФИКСИРОВАННЫЙ ПОДВАЛ (Жестко заперт на своем месте) */}
      <div className="px-5 pb-8 pt-9 flex flex-col items-center relative z-40 bg-white dark:bg-neutral-900 flex-shrink-0 select-none">
        
        <div className="w-full relative flex flex-col items-center">
          
          {/* Плашка */}
          <div className="absolute -top-7 left-0 right-0 bg-neutral-600 dark:bg-neutral-800 rounded-t-[20px] pt-2 pb-10 text-center pointer-events-none z-10">
            <p className="text-[11px] font-normal text-white dark:text-neutral-200 tracking-wide px-4">
              Твоя оценка улетит прямиком в общую ленту трендов
            </p>
          </div>

          {/* Главная кнопка */}
          <div
            onClick={handleMainButtonClick}
            className={`w-full h-14 rounded-full font-bold text-sm transition-all duration-150 outline-none flex items-center justify-center relative z-20 ${
              title.trim().length > 0
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
