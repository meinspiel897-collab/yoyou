"use client";

import React from "react";

interface NewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewModal({ isOpen, onClose }: NewModalProps) {
  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-end transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Затемнение заднего фона для закрытия модалки по тапу вне формы */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" onClick={onClose} />

      {/* Контейнер модалки (Высота 85%, скругление сверху) */}
      <div 
        className={`relative w-full h-[85%] bg-white dark:bg-neutral-900 rounded-t-[24px] shadow-2xl flex flex-col transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Маленький хэндл-индикатор сверху (кастомный Apple-вайб) */}
        <div className="w-9 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />

        {/* Шапка модалки */}
        <div className="relative w-full h-12 flex items-center justify-center px-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
          <h2 className="text-base font-bold text-appleLight-text dark:text-appleDark-text" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Что-то новенькое
          </h2>
          
          {/* Круглая кнопка закрытия с крестиком */}
          <button 
            onClick={onClose}
            className="absolute right-4 w-7 h-7 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors outline-none active:scale-90"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="stroke-neutral-500 dark:stroke-neutral-400 stroke-[1.5]">
              <path d="M1 1L9 9M9 1L1 9" />
            </svg>
          </button>
        </div>

        {/* Контентная часть заглушки */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center select-none">
          <div className="w-16 h-16 bg-[#FC062D]/10 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-lg font-extrabold text-appleLight-text dark:text-appleDark-text mb-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Создание контента
          </h3>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-[260px]">
            Здесь будет форма добавления новых предметов для оценки или создания баттлов! Накатим верстку чуть позже.
          </p>
        </div>
      </div>
    </div>
  );
}
