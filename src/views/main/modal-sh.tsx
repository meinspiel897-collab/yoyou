"use client";

import React from "react";
import { AVAILABLE_SHIELDS, RenderShield, ShieldType } from "./shields";

interface ModalShProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShield?: (type: ShieldType) => void;
}

export default function ModalSh({ isOpen, onClose, onSelectShield }: ModalShProps) {
  return (
    <div className={`fixed inset-0 z-[60] transition-all duration-300 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Задний размытый фон в стиле iOS */}
      <div className={`absolute inset-0 bg-black/20 dark:bg-black/40 transition-all duration-300 ${isOpen ? "opacity-100 backdrop-blur-md" : "opacity-0 backdrop-blur-0"}`} onClick={onClose} />

      <div className={`absolute left-4 right-4 bottom-4 h-[55vh] bg-neutral-50 dark:bg-neutral-900/95 backdrop-blur-xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden transition-transform duration-350 cubic-bezier(0.15, 1, 0.2, 1) will-change-transform ${isOpen ? "translate-y-0" : "translate-y-[calc(100%+30px)]"}`}>
        
        {/* Индикатор смахивания (iOS Handle) */}
        <div className="w-full flex justify-center pt-3 select-none flex-shrink-0">
          <div className="w-9 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full opacity-60" />
        </div>

        {/* Хедер галереи виджетов */}
        <div className="relative w-full h-12 flex items-center justify-between px-6 flex-shrink-0 select-none">
          <h2 className="text-[13px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Галерея виджетов
          </h2>
          <button onClick={onClose} className="w-7 h-7 bg-neutral-200/60 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full flex items-center justify-center transition-all outline-none active:scale-90">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">✕</span>
          </button>
        </div>

        {/* Сетка в стиле интерактивных IOS Виджетов */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 scrollbar-none">
          <div className="grid grid-cols-2 gap-4">
            {AVAILABLE_SHIELDS.map((shield) => (
              <div
                key={shield.id}
                onClick={() => {
                  if (onSelectShield) onSelectShield(shield.id);
                  onClose();
                }}
                className="group relative flex flex-col items-center justify-between p-4 bg-white dark:bg-neutral-800/50 rounded-[24px] border border-neutral-100 dark:border-neutral-800/30 shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-200 cursor-pointer h-32"
              >
                {/* Центрированный интерактивный элемент */}
                <div className="flex-1 flex items-center justify-center w-full transform group-hover:scale-105 transition-transform duration-200 pointer-events-none">
                  <RenderShield type={shield.id} />
                </div>
                
                {/* Подпись под виджетом */}
                <span className="text-[11px] font-normal text-neutral-400 dark:text-neutral-500 tracking-tight text-center mt-2 select-none">
                  {shield.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
