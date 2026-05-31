"use client";

import React, { useState } from "react";

interface NewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubTabType = "rate" | "take" | "tier" | "over";

interface TabConfig {
  id: SubTabType;
  label: string;
  icon: string;
  desc: string;
}

export default function NewModal({ isOpen, onClose }: NewModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("rate");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Конфиг табов и сочных описаний в стиле ЙОУЙОУ
  const tabs: TabConfig[] = [
    {
      id: "rate",
      label: "Оценка",
      icon: "/icons/rate.png",
      desc: "Оценивай всё, что душа пожелает! Введи название и описание, а наш ИИ сам подгонит сочную обложку. Не зашло — поменяешь в один тап.",
    },
    {
      id: "take",
      label: "Тейк",
      icon: "/icons/take.png",
      desc: "Вбрось свое самое горячее и непопулярное мнение. Посмотрим, что выберет комьюнити — чистую Базу или лютый Кринж.",
    },
    {
      id: "tier",
      label: "Тир лист",
      icon: "/icons/tear.png",
      desc: "Создай ультимативный топ вещей. Разложи любимые предметы по местам и покажи всем, как выглядит идеальный рейтинг.",
    },
    {
      id: "over",
      label: "Оверрейт",
      icon: "/icons/over.png",
      desc: "Накипело от хайпа? Закинь сюда вещь, которая лезет из каждого утюга, и выстави ей честный градус переоцененности.",
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeSubTab) || tabs[0];

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

      {/* Окно модалки */}
      <div 
        className={`relative w-full h-[90%] bg-white dark:bg-neutral-900 rounded-t-[32px] shadow-2xl flex flex-col transition-transform duration-300 cubic-bezier(0.15, 1, 0.2, 1) will-change-transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Шапка модалки */}
        <div className="relative w-full h-16 flex items-center justify-center px-4 flex-shrink-0">
          <h2 className="text-base font-bold text-appleLight-text dark:text-appleDark-text tracking-tight">
            Что создаем?
          </h2>

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

        {/* Контентная зона */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 flex flex-col">
          
          {/* Внутренний Таббар (Высота ровно h-11, без лишних кнопок) */}
          <div className="w-full h-11 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg p-1 box-border rounded-full flex items-center relative mb-5 flex-shrink-0">
            {tabs.map((tab) => {
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex-1 h-full rounded-full text-xs font-bold transition-all duration-200 outline-none whitespace-nowrap flex items-center justify-center z-10 ${
                    isActive 
                      ? "bg-white dark:bg-neutral-700 text-appleLight-text dark:text-appleDark-text shadow-sm scale-[1.02]" 
                      : "text-appleLight-text/45 dark:text-appleDark-text/45"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Блок динамического описания */}
          <div className="flex items-start space-x-3.5 px-1 mb-6 min-h-[60px] select-none">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
              <img 
                src={currentTab.icon} 
                alt={currentTab.label} 
                className="w-5 h-5 object-contain dark:brightness-0 dark:invert opacity-70"
              />
            </div>
            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 leading-relaxed pt-0.5">
              {currentTab.desc}
            </p>
          </div>

          {/* Форма ввода (Пока работает только для Обычной Оценки) */}
          {activeSubTab === "rate" ? (
            <div className="flex flex-col space-y-3.5 animate-fadeIn">
              
              {/* Строка Название (Google Style) */}
              <div className="relative w-full h-11 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-full overflow-hidden transition-all focus-within:ring-1 focus-within:ring-[#FC062D]/30">
                <input
                  type="text"
                  id="rate-title"
                  placeholder="Введи название тут"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="peer w-full h-full bg-transparent pt-3.5 pb-0.5 px-4 text-sm font-semibold text-appleLight-text dark:text-appleDark-text outline-none placeholder-neutral-400 dark:placeholder-neutral-500/80 placeholder:text-xs placeholder:font-medium focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-200"
                />
                <label
                  htmlFor="rate-title"
                  className="absolute left-4 top-1 text-[9px] font-bold text-[#FC062D] tracking-wide pointer-events-none transition-all duration-200 opacity-0 -translate-y-1 peer-focus:opacity-100 peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:opacity-100 peer-[:not(:placeholder-shown)]:translate-y-0"
                >
                  Название
                </label>
              </div>

              {/* Строка Описание (Google Style) */}
              <div className="relative w-full h-11 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-full overflow-hidden transition-all focus-within:ring-1 focus-within:ring-[#FC062D]/30">
                <input
                  type="text"
                  id="rate-desc"
                  placeholder="А описание тут"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="peer w-full h-full bg-transparent pt-3.5 pb-0.5 px-4 text-sm font-semibold text-appleLight-text dark:text-appleDark-text outline-none placeholder-neutral-400 dark:placeholder-neutral-500/80 placeholder:text-xs placeholder:font-medium focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-200"
                />
                <label
                  htmlFor="rate-desc"
                  className="absolute left-4 top-1 text-[9px] font-bold text-[#FC062D] tracking-wide pointer-events-none transition-all duration-200 opacity-0 -translate-y-1 peer-focus:opacity-100 peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:opacity-100 peer-[:not(:placeholder-shown)]:translate-y-0"
                >
                  Описание
                </label>
              </div>

            </div>
          ) : (
            /* Заглушка для остальных вкладок, пока они пустые */
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center select-none animate-fadeIn">
              <span className="text-xl mb-2">🛠️</span>
              <p className="text-xs font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                В разработке
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
