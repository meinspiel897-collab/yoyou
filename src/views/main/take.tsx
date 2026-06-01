"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import ShieldSelectionModal, { Shield } from "./modal-sh";
import { shields } from "../main/shields"; // Путь к твоим шилдам. Поправь, если папки лежат иначе

const Lottie = dynamic(() => import("lottie-light-react"), { ssr: false });

interface TakeViewProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  animationData: any;
  setIsTyping?: (typing: boolean) => void; // Проп для блокировки свайпов
}

export default function TakeView({
  title,
  setTitle,
  description,
  setDescription,
  animationData,
  setIsTyping,
}: TakeViewProps) {
  // Внутренний стейт для управления шилдами
  const [isShieldModalOpen, setIsShieldModalOpen] = useState(false);
  const [selectedShield, setSelectedShield] = useState<Shield | null>(null);

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
    if (!title || !description) return;
    triggerHaptic("medium");
    // Тут при отправке можно прокидывать selectedShield в общую ленту
  };

  const isFormValid = title.trim().length > 0 && description.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      
      {/* СКРОЛЛ-ЗОНА КОНТЕНТА */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col space-y-5 scrollbar-none">
        
        {/* Шапка таба с Lottie-анимацией */}
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
            Выдай свой самый лучший тейк! Напиши базу или кринж — пускай толпа решает, гений ты или «очередной зумер»
          </p>
        </div>

        {/* Поле: Тема тейка */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
            Тема тейка
          </label>
          <div className="w-full h-11 bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-full flex items-center px-4 transition-colors duration-200">
            <input
              type="text"
              placeholder="Добавь тейку заголовок"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 40))}
              maxLength={40}
              onFocus={() => setIsTyping?.(true)}
              onBlur={() => setIsTyping?.(false)}
              className="flex-1 h-full bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text placeholder-neutral-300 dark:placeholder-neutral-600"
            />
            <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-600 ml-2 select-none tracking-wide">
              {description.length}/40
            </span>
          </div>
        </div>

        {/* НОВОЕ ПОЛЕ: Выбор шилда */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
            Шилд публикации
          </label>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setIsShieldModalOpen(true);
            }}
            className="w-full h-11 bg-transparent border border-neutral-600 dark:border-neutral-800 rounded-full flex items-center justify-between px-4 transition-colors duration-200 active:bg-neutral-50 dark:active:bg-neutral-800/40 outline-none group text-left"
          >
            <span className={`text-sm font-medium ${selectedShield ? "text-appleLight-text dark:text-appleDark-text" : "text-neutral-400 dark:text-neutral-600"}`}>
              {selectedShield ? `${selectedShield.icon}  ${selectedShield.name}` : "Выбери шилд публикации"}
            </span>
            <span className="text-xs font-bold text-neutral-400 dark:text-neutral-600 transition-transform group-active:translate-x-0.5">
              ➔
            </span>
          </button>
        </div>

        {/* Поле: Текст Тейка */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
            Твой тейк
          </label>
          <div className="w-full min-h-[164px] bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-[24px] flex items-start p-4 transition-colors duration-200 relative">
            <textarea
              placeholder="Пиши всё, что думаешь..."
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 750))}
              maxLength={750}
              rows={5}
              onFocus={() => setIsTyping?.(true)}
              onBlur={() => setIsTyping?.(false)}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text placeholder-neutral-300 dark:placeholder-neutral-600 resize-none overflow-y-auto h-[116px] pr-2 leading-snug scrollbar-none"
            />
            <span className="absolute right-4 bottom-3.5 text-[11px] font-bold text-neutral-400 dark:text-neutral-600 select-none tracking-wide">
              {title.length}/750
            </span>
          </div>
        </div>

      </div>

      {/* ФИКСИРОВАННЫЙ ПОДВАЛ */}
      <div className="px-5 pb-8 pt-9 flex flex-col items-center relative z-40 bg-white dark:bg-neutral-900 flex-shrink-0 select-none">
        <div className="w-full relative flex flex-col items-center">
          <div className="absolute -top-7 left-0 right-0 bg-neutral-600 dark:bg-neutral-800 rounded-t-[20px] pt-2 pb-10 text-center pointer-events-none z-10">
            <p className="text-[11px] font-normal text-white dark:text-neutral-200 tracking-wide px-4">
              Твой тейк отправится прямо в общую ленту трендов
            </p>
          </div>

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

      {/* ПОДКЛЮЧЕНИЕ МОДАЛКИ ВЫБОРА ШИЛДОВ */}
      <ShieldSelectionModal 
        isOpen={isShieldModalOpen}
        onClose={() => setIsShieldModalOpen(false)}
        onSelect={(shield) => setSelectedShield(shield)}
        currentShield={selectedShield}
        shields={shields}
      />

    </div>
  );
}
