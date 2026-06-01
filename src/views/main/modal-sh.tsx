"use client";

import React from "react";

interface ModalShProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalSh({ isOpen, onClose }: ModalShProps) {
  return (
    <div 
      className={`fixed inset-0 z-[60] transition-all duration-300 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div 
        className={`absolute inset-0 bg-black/10 dark:bg-black/25 transition-all duration-300 ${
          isOpen ? "opacity-100 backdrop-blur-[1px]" : "opacity-0 backdrop-blur-0"
        }`} 
        onClick={onClose} 
      />

      <div 
        className={`absolute left-[15px] right-[15px] bottom-[15px] h-[22vh] bg-white dark:bg-neutral-900 rounded-[28px] shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 cubic-bezier(0.15, 1, 0.2, 1) will-change-transform ${
          isOpen ? "translate-y-0" : "translate-y-[calc(100%+30px)]"
        }`}
      >
        {/* Шапка без нижней линии */}
        <div className="relative w-full h-14 flex items-center justify-center px-4 flex-shrink-0 select-none">
          <h2 className="text-sm font-bold text-appleLight-text dark:text-appleDark-text tracking-tight">
            Выбери шилд
          </h2>

          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full flex items-center justify-center transition-all outline-none active:scale-90 z-10"
          >
            <img 
              src="/icons/cross.png" 
              alt="Закрыть" 
              className="w-3 h-3 object-contain block dark:brightness-0 dark:invert"
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center select-none">
          <span className="text-xs text-neutral-400 dark:text-neutral-600 italic">
            Тут будет выбор шилдов...
          </span>
        </div>
      </div>
    </div>
  );
}
