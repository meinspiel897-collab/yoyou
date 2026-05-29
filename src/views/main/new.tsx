"use client";

import React from "react";

interface NewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewModal({ isOpen, onClose }: NewModalProps) {
  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-end transition-all duration-500 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Затемнение фона с аккуратным размытием */}
      <div 
        className={`absolute inset-0 bg-black/15 dark:bg-black/30 transition-all duration-500 ${
          isOpen ? "opacity-100 backdrop-blur-[3px]" : "opacity-0 backdrop-blur-0"
        }`} 
        onClick={onClose} 
      />

      {/* Контейнер модалки (Замедление на конце увеличенным таймингом 550ms) */}
      <div 
        className={`relative w-full h-[90%] bg-white dark:bg-neutral-900 rounded-t-[32px] shadow-2xl flex flex-col transition-transform duration-[550ms] cubic-bezier(0.15, 1, 0.2, 1) will-change-transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Крупная кнопка закрытия с белым крестиком (75% размера) на контрастной подложке */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-neutral-900/50 dark:bg-neutral-800 hover:bg-neutral-900/60 dark:hover:bg-neutral-700 rounded-full flex items-center justify-center transition-all outline-none active:scale-90 z-10"
        >
          <svg 
            width="26" 
            height="26" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="stroke-white stroke-[2.2] stroke-linecap-round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Шапка модалки с жирным шрифтом */}
        <div className="relative w-full h-16 flex items-center justify-center px-4 flex-shrink-0">
          <h2 className="text-base font-bold text-appleLight-text dark:text-appleDark-text tracking-tight">
            Что-то новенькое
          </h2>
        </div>

        {/* Контентная часть */}
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
