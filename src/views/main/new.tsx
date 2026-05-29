"use client";

import React from "react";

interface NewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewModal({ isOpen, onClose }: NewModalProps) {
  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-end transition-all duration-[500ms] ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Затемнение фона с легким размытием */}
      <div 
        className={`absolute inset-0 bg-black/15 dark:bg-black/35 transition-all duration-[500ms] ${
          isOpen ? "opacity-100 backdrop-blur-[3px]" : "opacity-0 backdrop-blur-0"
        }`} 
        onClick={onClose} 
      />

      {/* Контейнер модалки — выезжает с честным iOS таймингом кубика */}
      <div 
        className={`relative w-full h-[90%] bg-white dark:bg-neutral-900 rounded-t-[32px] shadow-2xl flex flex-col transition-transform duration-[500ms] cubic-bezier(0.23, 1, 0.32, 1) will-change-transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Крупная круглая кнопка закрытия в стиле Apple (размытый темноватый круг + белый крестик) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black/30 dark:bg-white/10 backdrop-blur-md hover:bg-black/40 dark:hover:bg-white/15 rounded-full flex items-center justify-center transition-all outline-none active:scale-90 z-10"
        >
          {/* Крестик — сделан чуть крупнее и покрашен в чистый белый */}
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="stroke-white stroke-[2]">
            <path d="M1 1L11 11M11 1L1 11" />
          </svg>
        </button>

        {/* Шапка модалки — заголовок теперь жирный */}
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
          <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-[260px] leading-snug">
            Здесь будет форма добавления новых предметов для оценки или создания баттлов! Накатим верстку чуть позже.
          </p>
        </div>
      </div>
    </div>
  );
}
