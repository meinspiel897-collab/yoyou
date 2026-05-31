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
  
  // Состояние для анимации свайпа удаления
  const [activeSwipeId, setActiveSwipeId] = useState<string | null>(null);
  const [swipeX, setSwipeX] = useState<number>(0);
  const rowTouchStart = useRef({ x: 0, y: 0 });

  // Реф для Drag and Drop
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

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleInputChange = (id: string, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, text: value.slice(0, 40) } : item));
  };

  // --- МЕХАНИКА SWIPE TO DELETE (ИЗОЛИРОВАННАЯ) ---
  const handleRowTouchStart = (e: React.TouchEvent, id: string) => {
    rowTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setActiveSwipeId(id);
    setIsTyping?.(true); // Замораживаем свайпы главного трека модалки
  };

  const handleRowTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - rowTouchStart.current.x;
    const deltaY = e.touches[0].clientY - rowTouchStart.current.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Это горизонтальный свайп - рубим всплытие к родительскому треку!
      e.stopPropagation();
      if (deltaX > 0) {
        setSwipeX(deltaX);
      }
    }
  };

  const handleRowTouchEnd = (id: string) => {
    setIsTyping?.(false);
    if (swipeX > 90) {
      triggerHaptic("medium");
      handleDeleteItem(id);
    }
    setActiveSwipeId(null);
    setSwipeX(0);
  };

  // --- МЕХАНИКА DRAG & DROP ---
  const handleDragStart = (index: number) => {
    dragItemIndex.current = index;
    setIsTyping?.(true);
  };

  const handleDragEnter = (index: number) => {
    if (dragItemIndex.current === null || dragItemIndex.current === index) return;
    
    const newItems = [...items];
    const draggedItem = newItems[dragItemIndex.current];
    
    newItems.splice(dragItemIndex.current, 1);
    newItems.splice(index, 0, draggedItem);
    
    dragItemIndex.current = index;
    setItems(newItems);
  };

  const handleDragEnd = () => {
    dragItemIndex.current = null;
    setIsTyping?.(false);
    triggerHaptic("light");
  };

  const handleMainButtonClick = () => {
    if (items.length === 0 || !items[0].text.trim()) return;
    triggerHaptic("medium");
  };

  const isFormValid = items.length > 0 && items[0].text.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      
      {/* ОСНОВНОЙ КОНТЕНТ */}
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
            Собери свой личный топ! Добавляй позиции, распределяй места и двигай их как хочешь. Главное - аргументируй, почему топ-1 именно он 🫪
          </p>
        </div>

        {/* Заголовок блока */}
        <div className="flex flex-col space-y-1.5 flex-1 overflow-hidden">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none px-1 flex-shrink-0">
            Позиции в рейтинге
          </label>
          
          {/* МОНОЛИТНЫЙ ЖЕСТКИЙ БЛОК (Не деформируется, цвет в цвет как подсказка) */}
          <div className="w-full h-[270px] flex flex-col bg-neutral-600 dark:bg-neutral-800 rounded-[24px] overflow-y-auto scrollbar-none relative">
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center select-none">
                <p className="text-xs font-medium text-white/30 dark:text-neutral-500">Список пуст</p>
              </div>
            ) : (
              items.map((item, index) => {
                const isSwipingThis = activeSwipeId === item.id;
                return (
                  <div 
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onTouchStart={(e) => handleRowTouchStart(e, item.id)}
                    onTouchMove={handleRowTouchMove}
                    onTouchEnd={() => handleRowTouchEnd(item.id)}
                    style={{
                      transform: isSwipingThis ? `translateX(${swipeX}px)` : "none",
                      opacity: isSwipingThis ? Math.max(0.2, 1 - swipeX / 160) : 1,
                      transition: isSwipingThis ? "none" : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease",
                    }}
                    className={`w-full h-[54px] flex items-center justify-between px-4 bg-transparent flex-shrink-0 relative ${
                      index !== items.length - 1 ? "border-b border-white/10 dark:border-neutral-700/50" : ""
                    }`}
                  >
                    {/* Левая часть: Номер + Заглушка под картинку */}
                    <div className="flex items-center space-x-3 flex-1 mr-3">
                      <span className="text-xs font-bold text-white/40 dark:text-neutral-400/50 min-w-[16px] text-center select-none">
                        {index + 1}
                      </span>
                      <div className="w-8 h-8 bg-white/10 dark:bg-neutral-700/50 rounded-xl flex-shrink-0 select-none" />
                      
                      {/* Строка ввода */}
                      <input
                        type="text"
                        placeholder={index === 0 ? "Введи первую оценку..." : "Название позиции..."}
                        value={item.text}
                        onChange={(e) => handleInputChange(item.id, e.target.value)}
                        onFocus={() => setIsTyping?.(true)}
                        onBlur={() => setIsTyping?.(false)}
                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-white placeholder-white/30"
                      />
                    </div>

                    {/* Правая часть: Иконка перетаскивания */}
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 cursor-grab active:cursor-grabbing select-none">
                      <img 
                        src="/icons/drag.png" 
                        alt="Перетащить" 
                        className="w-4 h-4 object-contain brightness-0 invert opacity-40 block"
                      />
                    </div>
                  </div>
                );
              })
            )}
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
          
          {/* Плашка */}
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
