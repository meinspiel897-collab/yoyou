"use client";

import React, { useState, useEffect } from "react";

export interface Shield {
  id: string;
  name: string;
  icon: string;
}

interface ShieldSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (shield: Shield) => void;
  currentShield: Shield | null;
  shields: Shield[];
}

export default function ShieldSelectionModal({
  isOpen,
  onClose,
  onSelect,
  currentShield,
  shields = [],
}: ShieldSelectionModalProps) {
  const [dimensions, setDimensions] = useState({ top: "10vh", height: "90vh" });

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

  // Фиксация размеров против прыжков клавиатуры (как в new.tsx)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const h = window.innerHeight;
      setDimensions({
        top: `${h * 0.1}px`,
        height: `${h * 0.9}px`
      });
    }
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Задний блюр из оригинального стиля new.tsx */}
      <div 
        className={`absolute inset-0 bg-black/15 dark:bg-black/30 transition-all duration-300 ${
          isOpen ? "opacity-100 backdrop-blur-[3px]" : "opacity-0 backdrop-blur-0"
        }`} 
        onClick={onClose} 
      />

      {/* Контейнер модалки */}
      <div 
        className={`absolute left-0 right-0 bg-white dark:bg-neutral-900 rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 cubic-bezier(0.15, 1, 0.2, 1) will-change-transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ 
          top: dimensions.top, 
          height: dimensions.height
        }}
      >
        {/* Шапка модалки */}
        <div className="relative w-full h-16 flex items-center justify-center px-4 flex-shrink-0 select-none">
          <h2 className="text-base font-bold text-appleLight-text dark:text-appleDark-text tracking-tight">
            Выбери шилд
          </h2>

          {/* Родной крестик в круге */}
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full flex items-center justify-center transition-all outline-none active:scale-90 z-10 flex-shrink-0"
          >
            <img 
              src="/icons/cross.png" 
              alt="Закрыть" 
              className="w-[14px] h-[14px] object-contain block dark:brightness-0 dark:invert"
            />
          </button>
        </div>

        {/* Сетка с объектами (Шилды) */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 scrollbar-none">
          <div className="grid grid-cols-2 gap-3 pt-1">
            {shields.map((shield) => {
              const isSelected = currentShield?.id === shield.id;
              return (
                <button
                  key={shield.id}
                  onClick={() => {
                    triggerHaptic("light");
                    onSelect(shield);
                    onClose();
                  }}
                  className={`relative flex flex-col items-center justify-center p-5 rounded-[24px] transition-all duration-150 active:scale-[0.97] outline-none group border ${
                    isSelected 
                      ? "bg-appleLight-secondaryBg dark:bg-neutral-800 border-transparent text-appleLight-text dark:text-appleDark-text" 
                      : "bg-transparent border-neutral-200 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {/* Иконка шилда */}
                  <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 bg-neutral-50 dark:bg-neutral-800/80 shadow-sm ${
                    isSelected ? "ring-2 ring-[#FC062D] ring-offset-2 dark:ring-offset-neutral-900" : ""
                  }`}>
                    <span className="text-xl select-none">{shield.icon}</span>
                  </div>

                  {/* Название */}
                  <span className="text-xs font-semibold tracking-wide text-center px-1">
                    {shield.name}
                  </span>

                  {/* Аккуратная точка выбранного элемента */}
                  {isSelected && (
                    <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-[#FC062D]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
