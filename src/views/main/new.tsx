"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Импортируем именно lottie-light-react с отключенным SSR
const Lottie = dynamic(() => import("lottie-light-react"), { ssr: false });

interface NewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubTabType = "rate" | "take" | "tier" | "over";

interface TabConfig {
  id: SubTabType;
  label: string;
  desc: string;
}

export default function NewModal({ isOpen, onClose }: NewModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("rate");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [animationData, setAnimationData] = useState<any>(null);

  const tabs: TabConfig[] = [
    {
      id: "rate",
      label: "Оценка",
      desc: "Оценивай всё, что душа пожелает! Введи название и описание, а наш ИИ сам подгонит сочную обложку. Не зашло — поменяешь в один тап",
    },
    {
      id: "take",
      label: "Тейк",
      desc: "Вбрось свое самое горячее и непопулярное мнение. Посмотрим, что выберет комьюнити — чистую Базу или лютый Кринж",
    },
    {
      id: "tier",
      label: "Тир лист",
      desc: "Создай ультимативный топ вещей. Разложи любимые предметы по местам и покажи всем, как выглядит идеальный рейтинг",
    },
    {
      id: "over",
      label: "Оверрейт",
      desc: "Накипело от хайпа? Закинь сюда вещь, которая лезет из каждого утюга, и выстави ей честный градус переоцененности",
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeSubTab) || tabs[0];
  const activeIndex = tabs.findIndex((t) => t.id === activeSubTab);

  useEffect(() => {
    if (!isOpen) return;
    
    setAnimationData(null);
    fetch(`/icons/${activeSubTab}.json`)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Ошибка загрузки Lottie:", err));
  }, [activeSubTab, isOpen]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-end transition-all duration-300 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div 
        className={`absolute inset-0 bg-black/15 dark:bg-black/30 transition-all duration-300 ${
          isOpen ? "opacity-100 backdrop-blur-[3px]" : "opacity-0 backdrop-blur-0"
        }`} 
        onClick={onClose} 
      />

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

        {/* Контент */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 flex flex-col">
          
          {/* Полноценный темный Таббар */}
          <div className="w-full h-11 bg-neutral-100 dark:bg-neutral-950 p-1 box-border rounded-full flex items-center relative mb-6 flex-shrink-0 select-none">
            <div 
              className="absolute top-1 bottom-1 bg-white dark:bg-neutral-800 rounded-full shadow-sm transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) z-10"
              style={{ 
                left: `calc(${activeIndex * 25}% + 4px)`,
                width: "calc(25% - 8px)" 
              }}
            />

            {tabs.map((tab) => {
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex-1 h-full rounded-full text-xs font-bold transition-colors duration-200 outline-none whitespace-nowrap flex items-center justify-center z-20 ${
                    isActive 
                      ? "text-appleLight-text dark:text-appleDark-text" 
                      : "text-appleLight-text/45 dark:text-appleDark-text/45"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Описание с Lottie-light */}
          <div className="flex items-start space-x-3.5 px-1 mb-6 min-h-[52px] select-none">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              {animationData ? (
                <Lottie 
                  animationData={animationData} 
                  loop={true} 
                  style={{ width: 20, height: 20 }}
                />
              ) : (
                <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
              )}
            </div>
            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 leading-relaxed">
              {currentTab.desc}
            </p>
          </div>

          {/* Форма для Оценки */}
          {activeSubTab === "rate" ? (
            <div className="flex flex-col space-y-4 animate-fadeIn">
              
              {/* Поле: Название */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 pl-[56px] select-none">
                  Имя тут
                </label>
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-11 h-11 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-center flex-shrink-0 select-none">
                    <span className="text-xs text-neutral-300 dark:text-neutral-700">✦</span>
                  </div>

                  <div className="flex-1 h-11 bg-transparent border border-neutral-200 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-full flex items-center px-4 transition-colors duration-200">
                    <input
                      type="text"
                      placeholder="Что угодно"
                      value={title}
                      onChange={(e) => setTitle(e.target.value.slice(0, 20))}
                      maxLength={20}
                      className="flex-1 h-full bg-transparent border-none outline-none text-sm font-semibold text-appleLight-text dark:text-appleDark-text placeholder-neutral-300 dark:placeholder-neutral-600"
                    />
                    <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-600 ml-2 select-none tracking-wide">
                      {title.length}/20
                    </span>
                  </div>
                </div>
              </div>

              {/* Поле: Описание (3 строки с кастомным скроллом) */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 pl-3 select-none">
                  Описание здесь
                </label>
                <div className="w-full min-h-[78px] bg-transparent border border-neutral-200 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-[20px] flex items-start p-3.5 transition-colors duration-200 relative">
                  <textarea
                    placeholder="Что угодно"
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 130))}
                    maxLength={130}
                    rows={3}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-semibold text-appleLight-text dark:text-appleDark-text placeholder-neutral-300 dark:placeholder-neutral-600 resize-none overflow-y-auto h-[48px] pr-14 leading-tight scrollbar-none"
                  />
                  <span className="absolute right-4 bottom-3.5 text-[11px] font-bold text-neutral-400 dark:text-neutral-600 select-none tracking-wide">
                    {description.length}/130
                  </span>
                </div>
              </div>

            </div>
          ) : (
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
