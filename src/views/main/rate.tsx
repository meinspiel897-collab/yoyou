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

  // Тактильный отклик Telegram
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
    e.stopPropagation(); // Изолируем от клика по основной кнопке
    triggerHaptic("light");
    setShowTooltip(!showTooltip);
  };

  const handleMainButtonClick = () => {
    if (!title) return;
    triggerHaptic("medium");
    // Логика отправки будет тут 🛠️
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      
      {/* Невидимый слой для закрытия подсказки при тапе мимо */}
      {showTooltip && (
        <div 
          className="fixed inset-0 z-30 bg-transparent" 
          onClick={() => setShowTooltip(false)}
        />
      )}

      {/* СКРОЛЛ-ЗОНА ФОРМЫ */}
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

      {/* ФИКСИРОВАННЫЙ ПОДВАЛ С УМНОЙ КНОПКОЙ */}
      <div className="px-5 pb-8 pt-2 flex flex-col items-center relative z-40 bg-white dark:bg-neutral-900 flex-shrink-0">
        
        <div
          onClick={handleMainButtonClick}
          className={`w-full h-14 rounded-full font-bold text-sm transition-all duration-150 outline-none flex items-center justify-center relative select-none ${
            title 
              ? "bg-[#FC062D] text-white active:scale-[0.98] cursor-pointer" 
              : "bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg text-appleLight-text/30 dark:text-appleDark-text/30 cursor-default"
          }`}
        >
          <span>Закинуть в тренды</span>
          
          {/* Инкапсулированный узел знака вопроса и подсказки */}
          <div className="relative flex items-center justify-center">
            
            <div 
              onClick={toggleTooltip}
              className="w-[15px] h-[15px] rounded-full border border-current flex items-center justify-center text-[10px] font-bold ml-2 transition-transform active:scale-90 cursor-pointer"
            >
              ?
            </div>

            {/* Всплывающий монолитный поп-ап */}
            <div 
              className="absolute bottom-full mb-3.5 w-[230px] p-3.5 bg-white dark:bg-neutral-700 border border-neutral-200/60 dark:border-neutral-600/40 rounded-2xl text-neutral-600 dark:text-neutral-200 text-[11px] font-medium leading-normal shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 will-change-transform pointer-events-none z-50 text-center"
              style={{
                left: "calc(50% + 4px)", // Сдвиг центра под ширину иконки вопроса с отступом
                transform: showTooltip ? "scale(1) translateY(0) translateX(-50%)" : "scale(0.3) translateY(15px) translateX(-50%)",
                opacity: showTooltip ? 1 : 0,
                transformOrigin: "bottom center",
                transitionTimingFunction: showTooltip ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : "cubic-bezier(0.25, 1, 0.5, 1)"
              }}
            >
              Твоя оценка попадет в ленту трендов, так что каждый сможет ее увидеть и добавить свою!
              
              {/* Хвостик, идеально сливающийся с телом */}
              <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white dark:bg-neutral-700 border-r border-b border-neutral-200/60 dark:border-neutral-600/40 rotate-45" />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
