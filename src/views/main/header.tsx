"use client";

import React from "react";

type TabType = "trending" | "events" | "favorites";

interface HeaderProps {
  isLoading: boolean;
  activeTab: TabType;
  isSearching: boolean;
  searchQuery: string;
  activeTag: string | null;
  sliderRef: React.RefObject<HTMLDivElement>;
  tabTrendingRef: React.RefObject<HTMLButtonElement>;
  tabEventsRef: React.RefObject<HTMLButtonElement>;
  tabFavoritesRef: React.RefObject<HTMLButtonElement>;
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
  tabFavoritesRef,
  inputRef,
  handleTabClick,
  enableSearch,
  disableSearch,
  handleInputChange,
  handleInputKeyDown,
  onAddClick,
}: HeaderProps) {
  
  // Условие, когда кнопка добавления должна скрыться
  const shouldHideAdd = isSearching || activeTab === "trending";

  return (
    <>
      {/* Нативный логотип */}
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

      {/* Панель управления: Табы, Поиск, Добавить */}
      <div className="w-[calc(100%-40px)] mx-auto pt-3 box-border">
        {isLoading ? (
          <div className="w-full h-11 bg-neutral-300 dark:bg-neutral-800 rounded-full animate-pulse" />
        ) : (
          <div className="w-full h-11 relative flex items-center">
            
            {/* Чузбар (Вкладки) — ширина динамически меняется со 104px до 54px */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg p-1 box-border rounded-full flex items-center overflow-x-auto transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1) [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{
                width: shouldHideAdd ? "calc(100% - 54px)" : "calc(100% - 104px)",
                opacity: isSearching ? 0 : 1,
                transform: isSearching ? "scale(0.97)" : "scale(1)",
                visibility: isSearching ? "hidden" : "visible",
                pointerEvents: isSearching ? "none" : "auto",
              }}
            >
              <div 
                ref={sliderRef}
                className="absolute top-1 bottom-1 bg-white/95 dark:bg-neutral-700/90 rounded-full border border-transparent shadow-sm will-change-transform z-10"
              />

              <button
                ref={tabTrendingRef}
                onClick={() => handleTabClick("trending")}
                className={`flex-1 px-2.5 h-full rounded-full text-xs font-semibold z-20 transition-colors duration-250 outline-none whitespace-nowrap flex-shrink-0 flex items-center justify-center ${
                  activeTab === "trending" ? "text-appleLight-text dark:text-appleDark-text" : "text-appleLight-text/45 dark:text-appleDark-text/45"
                }`}
              >
                В тренде
              </button>

              <button
                ref={tabEventsRef}
                onClick={() => handleTabClick("events")}
                className={`flex-1 px-2.5 h-full rounded-full text-xs font-semibold z-20 transition-colors duration-250 outline-none whitespace-nowrap flex-shrink-0 flex items-center justify-center ${
                  activeTab === "events" ? "text-appleLight-text dark:text-appleDark-text" : "text-appleLight-text/45 dark:text-appleDark-text/45"
                }`}
              >
                Ивенты
              </button>

              <button
                ref={tabFavoritesRef}
                onClick={() => handleTabClick("favorites")}
                className={`flex-1 px-2.5 h-full rounded-full text-xs font-semibold z-20 transition-colors duration-250 outline-none whitespace-nowrap flex-shrink-0 flex items-center justify-center ${
                  activeTab === "favorites" ? "text-appleLight-text dark:text-appleDark-text" : "text-appleLight-text/45 dark:text-appleDark-text/45"
                }`}
              >
                Избранное
              </button>
            </div>

            {/* Кнопка «Добавить» — плавно исчезает/сужается на вкладке трендов */}
            <button
              onClick={onAddClick}
              className="absolute right-[52px] top-0 bottom-0 w-11 h-11 bg-[#FC062D] rounded-full flex items-center justify-center outline-none active:scale-95 transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1) z-20"
              style={{
                opacity: shouldHideAdd ? 0 : 1,
                transform: shouldHideAdd ? "scale(0.7)" : "scale(1)",
                visibility: shouldHideAdd ? "hidden" : "visible",
                pointerEvents: shouldHideAdd ? "none" : "auto",
              }}
            >
              <img 
                src="/icons/add.png" 
                alt="Добавить" 
                className="w-5 h-5 object-contain brightness-0 invert"
              />
            </button>

            {/* Блок поиска */}
            <div 
              className="absolute right-0 top-0 bottom-0 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-full transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1) flex items-center overflow-hidden z-30"
              style={{
                width: isSearching ? "100%" : "44px",
                padding: isSearching ? "0 6px 0 14px" : "0px",
              }}
            >
              {isSearching ? (
                <div className="w-full h-full flex items-center justify-between space-x-2">
                  <div className="flex items-center flex-1 h-full space-x-2 overflow-hidden">
                    <img 
                      src="/icons/search.png" 
                      alt="Поиск" 
                      className="w-4 h-4 object-contain brightness-0 invert opacity-35 flex-shrink-0"
                    />
                    <div className="flex items-center flex-1 h-full space-x-1.5 overflow-hidden">
                      {activeTag && (
                        <div className="h-7 px-3 rounded-full bg-[#FC062D]/30 flex items-center justify-center flex-shrink-0 select-none">
                          <span className="text-xs font-medium text-[#FC062D] tracking-wide whitespace-nowrap">
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
                        className="flex-1 h-full bg-transparent border-none outline-none text-base font-normal text-appleLight-text dark:text-appleDark-text placeholder-appleLight-text/35 dark:placeholder-appleDark-text/35 placeholder:text-sm placeholder:font-normal"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={disableSearch}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-appleLight-text/10 dark:bg-white/10 outline-none active:scale-90 transition-transform flex-shrink-0"
                  >
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none" className="stroke-appleLight-text dark:stroke-appleDark-text stroke-[1.5]">
                      <path d="M1 1L9 9M9 1L1 9" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={enableSearch}
                  className="w-full h-full flex items-center justify-center rounded-full outline-none active:scale-95 transition-transform"
                >
                  <img 
                    src="/icons/search.png" 
                    alt="Поиск" 
                    className="w-5 h-5 object-contain brightness-0 invert"
                  />
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </>
  );
}
