"use client";

import React from "react";

type TabType = "trending" | "events";

interface HeaderProps {
  isLoading: boolean;
  activeTab: TabType;
  isSearching: boolean;
  searchQuery: string;
  activeTag: string | null;
  sliderRef: React.RefObject<HTMLDivElement>;
  tabTrendingRef: React.RefObject<HTMLButtonElement>;
  tabEventsRef: React.RefObject<HTMLButtonElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  handleTabClick: (tab: TabType) => void;
  enableSearch: () => void;
  disableSearch: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddClick: () => void;
}

export default function Header({
  isLoading,
  activeTab,
  isSearching,
  searchQuery,
  activeTag,
  sliderRef,
  tabTrendingRef,
  tabEventsRef,
  inputRef,
  handleTabClick,
  enableSearch,
  disableSearch,
  handleInputChange,
  handleInputKeyDown,
  onAddClick,
}: HeaderProps) {
  
  const shouldHideAdd = activeTab === "events";

  return (
    <>
      <header className="absolute top-[var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))] left-0 right-0 h-11 flex items-center justify-center z-50 pointer-events-none select-none">
        {isLoading ? (
          <div className="w-24 h-5 bg-neutral-300 dark:bg-neutral-800 rounded-md animate-pulse" />
        ) : (
          <div className="flex items-center space-x-2.5">
            <img src="/icons/logo.png" alt="Логотип" className="w-5 h-5 object-contain" />
            <h1 className="text-base font-extrabold tracking-tight text-appleLight-text dark:text-appleDark-text" style={{ fontFamily: "'Manrope', sans-serif" }}>
              ЙОУЙОУ
            </h1>
          </div>
        )}
      </header>

      <div className="w-[calc(100%-40px)] mx-auto pt-3 box-border h-[56px] relative overflow-hidden">
        {isLoading ? (
          <div className="w-full h-11 bg-neutral-300 dark:bg-neutral-800 rounded-full animate-pulse" />
        ) : (
          <div className="w-full h-11 relative">
            
            <div 
              className={`absolute inset-0 flex items-center justify-between transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform ${
                isSearching 
                  ? "-translate-y-full opacity-0 pointer-events-none" 
                  : "translate-y-0 opacity-100 pointer-events-auto"
              }`}
            >
              <div 
                className="h-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg p-1 box-border rounded-full flex items-center transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
                style={{ width: shouldHideAdd ? "100%" : "calc(100% - 50px)" }}
              >
                <div 
                  ref={sliderRef}
                  className="absolute top-1 bottom-1 bg-white/95 dark:bg-neutral-700/90 rounded-full border border-transparent shadow-sm will-change-transform z-10"
                />

                <button
                  ref={tabTrendingRef}
                  onClick={() => handleTabClick("trending")}
                  className={`flex-1 px-1 h-full rounded-full text-sm font-medium z-20 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) outline-none whitespace-nowrap flex items-center justify-center ${
                    activeTab === "trending" ? "text-appleLight-text dark:text-appleDark-text" : "text-appleLight-text/45 dark:text-appleDark-text/45"
                  }`}
                >
                  В тренде
                </button>

                <button
                  ref={tabEventsRef}
                  onClick={() => handleTabClick("events")}
                  className={`flex-1 px-1 h-full rounded-full text-sm font-medium z-20 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) outline-none whitespace-nowrap flex items-center justify-center ${
                    activeTab === "events" ? "text-appleLight-text dark:text-appleDark-text" : "text-appleLight-text/45 dark:text-appleDark-text/45"
                  }`}
                >
                  Ивенты
                </button>

                <button
                  onClick={enableSearch}
                  className="w-9 h-9 ml-1.5 bg-white dark:bg-neutral-700 shadow-sm rounded-full flex items-center justify-center outline-none active:scale-95 transition-transform z-20 flex-shrink-0"
                >
                  <img 
                    src="/icons/search.png" 
                    alt="Поиск" 
                    className="w-[24px] h-[24px] object-contain dark:brightness-0 dark:invert"
                  />
                </button>
              </div>

              <button
                onClick={onAddClick}
                className={`h-11 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-full flex items-center justify-center outline-none active:scale-95 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform flex-shrink-0 ${
                  shouldHideAdd 
                    ? "w-0 opacity-0 scale-0 pointer-events-none" 
                    : "w-11 opacity-100 scale-100 pointer-events-auto"
                }`}
              >
                <img 
                  src="/icons/add.png" 
                  alt="Добавить" 
                  className="w-[30px] h-[30px] object-contain dark:brightness-0 dark:invert"
                />
              </button>
            </div>

            <div 
              className={`absolute inset-0 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-full pl-4 pr-1.5 flex items-center justify-between space-x-2 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform z-30 ${
                isSearching 
                  ? "translate-y-0 opacity-100 pointer-events-auto" 
                  : "translate-y-full opacity-0 pointer-events-none"
              }`}
            >
              <div className="flex items-center flex-1 h-full space-x-2 overflow-hidden">
                <img 
                  src="/icons/search.png" 
                  alt="Поиск" 
                  className="w-5 h-5 object-contain brightness-0 invert opacity-35 flex-shrink-0"
                />
                <div className="flex items-center flex-1 h-full space-x-1.5 overflow-hidden">
                  {activeTag && (
                    <div className="h-7 px-3 rounded-full bg-[#FC062D]/30 flex items-center justify-center flex-shrink-0 select-none">
                      <span className="text-xs font-bold text-[#FC062D] tracking-wide whitespace-nowrap">
                        от: {activeTag}
                      </span>
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={activeTag ? "" : "Ищи что угодно"}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    className="flex-1 h-full bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text placeholder-appleLight-text/35 dark:placeholder-appleDark-text/35 placeholder:text-sm placeholder:font-normal"
                  />
                </div>
              </div>
              
              <button 
                onClick={disableSearch}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-appleLight-text/10 dark:bg-white/10 outline-none active:scale-90 transition-transform flex-shrink-0"
              >
                <img 
                  src="/icons/cross.png" 
                  alt="Очистить" 
                  className="w-[22px] h-[22px] object-contain dark:brightness-0 dark:invert opacity-60"
                />
              </button>
            </div>

          </div>
        )}
      </div>
    </>
  );
}
