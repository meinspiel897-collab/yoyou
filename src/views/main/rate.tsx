"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-light-react"), { ssr: false });

interface RateViewProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  animationData: any;
}

export default function RateView({
  title,
  setTitle,
  description,
  setDescription,
  animationData,
}: RateViewProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Нативный тактильный отклик Telegram
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

  const toggleTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    setShowTooltip(!showTooltip);
  };

  const handleMainButtonClick = () => {
    if (!title) return;
    triggerHaptic("medium");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      
      {/* Невидимый оверлей: быстро и плавно закрывает подсказку при тапе мимо */}
      {showTooltip && (
        <div 
          className="fixed inset-0 z-30 bg-transparent" 
          onClick={() => setShowTooltip(false)}
        />
      )}

      {/* СКРОЛЛ-ЗОНА ДЛЯ ФОРМЫ */}
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
            Имя тут
          </label>
          <div className="w-full h-11 bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-full flex items-center px-4 transition-colors duration-200">
            <input
              type="text"
              placeholder="Что угодно"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 20))}
              maxLength={20}
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
              placeholder="Что угодно"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 130))}
              maxLength={130}
              rows={3}
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

      {/* ФИКСИРОВАННЫЙ НИЖНИЙ БЛОК ДЛЯ КНОПОК */}
      <div className="px-5 pb-8 pt-2 flex flex-col items-center relative z-40 bg-white dark:bg-neutral-900 flex-shrink-0">
        
        {/* Прямоугольник подсказки — смещен для баланса границ экрана, хвостик бьет четко в цель */}
        <div 
          className="absolute bottom-[78px] right-[-14px] w-[260px] bg-[#FC062D]/85 backdrop-blur-md border border-[#FC062D] rounded-2xl text-white text-[11px] font-medium p-3.5 leading-normal shadow-xl transition-all duration-300 will-change-transform pointer-events-none z-50 flex flex-col"
          style={{
            transform: showTooltip ? "scale(1) translateY(0)" : "scale(0.3) translateY(24px)",
            opacity: showTooltip ? 1 : 0,
            transformOrigin: "bottom right",
            transitionTimingFunction: showTooltip ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : "cubic-bezier(0.25, 1, 0.5, 1)"
          }}
        >
          <span>Твоя оценка попадет в ленту трендов, так что каждый сможет ее увидеть и добавить свою!</span>
          
          {/* Бесшовный треугольный хвостик */}
          <div className="absolute -bottom-[6px] right-[44px] -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-top-[6px] border-top-[#FC062D]" />
          
          {/* Микро-маска для удаления контура под хвостиком, соединяющая фигуры в одну */}
          <div className="absolute bottom-0 right-[44px] -translate-x-1/2 w-[10px] h-[1px] bg-[#FC062D]" />
        </div>

        {/* Интерактивная зона */}
        <div className="w-full h-14 relative">
          
          {/* Главная кнопка "Закинуть в тренды" */}
          <button
            onClick={handleMainButtonClick}
            disabled={!title}
            className={`w-full h-full rounded-full font-bold text-sm transition-all duration-150 outline-none flex items-center justify-center select-none pr-12 ${
              title 
                ? "bg-[#FC062D] text-white active:scale-[0.98]" 
                : "bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg text-appleLight-text/30 dark:text-appleDark-text/30"
            }`}
          >
            Закинуть в тренды
          </button>

          {/* Независимый круг с вопросом — копия капли-слайдера, доступен ВСЕГДА */}
          <button
            onClick={toggleTooltip}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-white/95 dark:bg-neutral-700/90 border border-neutral-200/20 dark:border-neutral-600/30 shadow-sm text-[#FC062D] dark:text-white transition-all active:scale-90 outline-none z-20 cursor-pointer"
          >
            ?
          </button>
        </div>

      </div>

    </div>
  );
}
