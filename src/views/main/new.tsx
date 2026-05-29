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
      {/* Затемнение заднего фона с легким, аккуратным размытием */}
      <div 
        className={`absolute inset-0 bg-black/10 dark:bg-black/20 transition-all duration-300 ${
          isOpen ? "opacity-100 backdrop-blur-[2px]" : "opacity-0 backdrop-blur-0"
        }`} 
        onClick={onClose} 
      />

      {/* Контейнер модалки (Высота 90%, без изменения opacity — чистое выезжание) */}
      <div 
        className={`relative w-full h-[90%] bg-white dark:bg-neutral-900 rounded-t-[32px] shadow-2xl flex flex-col transition-transform duration-400 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Крупный крестик в идеальном правом верхнем углу модалки */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full flex items-center justify-center transition-all outline-none active:scale-90 z-10"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="stroke-neutral-500 dark:stroke-neutral-400 stroke-[1.8]">
            <path d="M1 1L11 11M11 1L1 11" />
          </svg>
        </button>

        {/* Шапка модалки без разделителей и со стандартным нежирным шрифтом */}
        <div className="relative w-full h-16 flex items-center justify-center px-4 flex-shrink-0">
          <h2 className="text-base font-normal text-appleLight-text dark:text-appleDark-text">
            Что-то новенькое
          </h2>
        </div>

        {/* Контентная часть */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center select-none">
          <div className="w-16 h-16 bg-[#FC062D]/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-lg font-normal text-appleLight-text dark:text-appleDark-text mb-1">
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
