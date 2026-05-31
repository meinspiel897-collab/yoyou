"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-light-react"), { ssr: false });

interface TierItem {
  id: string;
  text: string;
}

interface TierViewProps {
  animationData: any;
  setIsTyping?: (typing: boolean) => void;
}

export default function TierView({ animationData, setIsTyping }: TierViewProps) {
  const [items, setItems] = useState<TierItem[]>([
    { id: "item-1", text: "" }
  ]);
  
  // Реф для отслеживания индекса перетаскиваемого элемента
  const dragItemIndex = useRef<number | null>(null);

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

  const handleAddItem = () => {
    if (items.length >= 10) return;
    triggerHaptic("light");
    
    setItems([
      ...items,
      { id: `item-${Date.now()}`, text: "" }
    ]);
  };

  const handleInputChange = (id: string, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, text: value.slice(0, 40) } : item));
  };

  // --- МЕХАНИКА DRAG & DROP ---
  const handleDragStart = (index: number) => {
    dragItemIndex.current = index;
    setIsTyping?.(true); // Блокируем свайпы модалки при перетаскивании
  };

  const handleDragEnter = (index: number) => {
    if (dragItemIndex.current === null || dragItemIndex.current === index) return;
    
    // Пересчитываем порядок в массиве
    const newItems = [...items];
    const draggedItem = newItems[dragItemIndex.current];
    
    newItems.splice(dragItemIndex.current, 1);
    newItems.splice(index, 0, draggedItem);
    
    dragItemIndex.current = index;
    setItems(newItems);
  };

  const handleDragEnd = () => {
    dragItemIndex.current = null;
    setIsTyping?.(false); // Возвращаем управление свайпами модалки
    triggerHaptic("light");
  };

  const handleMainButtonClick = () => {
    if (items.length === 0 || !items[0].text.trim()) return;
    triggerHaptic("medium");
  };

  const isFormValid = items.length > 0 && items[0].text.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      
      {/* ОСНОВНОЙ КОНТЕНТ (НЕ СКРОЛЛИТСЯ, скролл убран внутрь блока) */}
      <div className="flex-1 px-5 pb-4 flex flex-col space-y-5 overflow-hidden">
        
        {/* Шапка таба с Lottie-анимацией */}
        <div className="flex items-start space-x-3.5 px-1 min-h-[52px] select-none pt-1 flex-shrink-0">
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
            Собери свой личный топ! Добавляй позиции, распределяй места и двигай их как хочешь. Главное — аргументируй, почему топ-1 именно он 🫪
          </p>
        </div>

        {/* Заголовок блока */}
        <div className="flex flex-col space-y-1.5 flex-1 overflow-hidden">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none px-1 flex-shrink-0">
            Позиции в рейтинге
          </label>
          
          {/* ЕДИНЫЙ БЛОК ДЛЯ ВСЕХ СТРОК (С изолированным внутренним невидимым скроллом) */}
          <div className="w-full flex flex-col bg-neutral-50/50 dark:bg-neutral-950/20 rounded-[24px] overflow-y-auto scrollbar-none border border-transparent focus-within:border-neutral-600/30 transition-colors duration-200">
            {items.map((item, index) => (
              <div 
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`w-full h-[54px] flex items-center justify-between px-4 transition-all duration-200 bg-transparent relative ${
                  index !== items.length - 1 ? "border-b border-neutral-200/50 dark:border-neutral-800/40" : ""
                }`}
              >
                {/* Левая часть: Номер + Заглушка под картинку */}
                <div className="flex items-center space-x-3 flex-1 mr-3">
                  <span className="text-xs font-bold text-neutral-400 dark:text-neutral-600 min-w-[16px] text-center select-none">
                    {index + 1}
                  </span>
                  <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-800/60 rounded-xl flex-shrink-0 select-none animate-pulse" />
                  
                  {/* Строка ввода */}
                  <input
                    type="text"
                    placeholder={index === 0 ? "Введи первую оценку..." : "Название позиции..."}
                    value={item.text}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    onFocus={() => setIsTyping?.(true)}
                    onBlur={() => setIsTyping?.(false)}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text placeholder-neutral-300 dark:placeholder-neutral-600"
                  />
                </div>

                {/* Правая часть: Иконка перетаскивания */}
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 cursor-grab active:cursor-grabbing select-none">
                  <img 
                    src="/icons/drag.png" 
                    alt="Перетащить" 
                    className="w-4 h-4 object-contain opacity-35 dark:opacity-20 block dark:brightness-0 dark:invert"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка добавления нового пункта */}
        {items.length < 10 && (
          <div className="px-1 flex-shrink-0">
            <button
              onClick={handleAddItem}
              className="w-full h-12 bg-neutral-50/50 dark:bg-neutral-950/20 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-[18px] flex items-center justify-center space-x-2 transition-colors duration-200 outline-none active:scale-[0.99]"
            >
              <img 
                src="/icons/add.png" 
                alt="Добавить" 
                className="w-4 h-4 object-contain opacity-40 dark:opacity-30 block dark:brightness-0 dark:invert"
              />
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                Добавить пункт
              </span>
            </button>
          </div>
        )}

      </div>

      {/* ФИКСИРОВАННЫЙ ПОДВАЛ */}
      <div className="px-5 pb-8 pt-9 flex flex-col items-center relative z-40 bg-white dark:bg-neutral-900 flex-shrink-0 select-none">
        <div className="w-full relative flex flex-col items-center">
          
          <div className="absolute -top-7 left-0 right-0 bg-neutral-600 dark:bg-neutral-800 rounded-t-[20px] pt-2 pb-10 text-center pointer-events-none z-10">
            <p className="text-[11px] font-normal text-white dark:text-neutral-200 tracking-wide px-4">
              Твой тир-лист отправится прямо в общую ленту трендов
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

    </div>
  );
}
