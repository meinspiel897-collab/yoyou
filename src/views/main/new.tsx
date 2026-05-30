"use client";

import React from "react";

interface NewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewModal({ isOpen, onClose }: NewModalProps) {
  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-end transition-all duration-300 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Задний блюр-фон */}
      <div 
        className={`absolute inset-0 bg-black/15 dark:bg-black/30 transition-all duration-300 ${
          isOpen ? "opacity-100 backdrop-blur-[3px]" : "opacity-0 backdrop-blur-0"
        }`} 
        onClick={onClose} 
      />

      {/* Само окно модалки */}
      <div 
        className={`relative w-full h-[90%] bg-white dark:bg-neutral-900 rounded-t-[32px] shadow-2xl flex flex-col transition-transform duration-300 cubic-bezier(0.15, 1, 0.2, 1) will-change-transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Шапка модалки */}
        <div className="relative w-full h-16 flex items-center justify-center px-4 flex-shrink-0 border-b border-neutral-100 dark:border-neutral-800/50">
          <h2 className="text-base font-bold text-appleLight-text dark:text-appleDark-text tracking-tight">
            What's new
          </h2>

          {/* Кнопка Закрыть модалку: кнопка 44px -> иконка жестко 26px (60%) */}
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full flex items-center justify-center transition-all outline-none active:scale-90 z-10 flex-shrink-0"
          >
            <img 
              src="/icons/cross.png" 
              alt="Закрыть" 
              className="w-[26px] h-[26px] object-contain block dark:brightness-0 dark:invert"
            />
          </button>
        </div>

        {/* Контент модалки */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center select-none">
          <div className="w-16 h-16 bg-[#FC062D]/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-lg font-bold text-appleLight-text dark:text-appleDark-text mb-1">
            Создание контента
          </h3>
          <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500 max-w-[260px] leading-snug">
            Здесь будет форма добавления новых предметов для оценки или создания баттлов! Накатим верстку чуть позже.
          </p>
        </div>
      </div>
    </div>
  );
}
