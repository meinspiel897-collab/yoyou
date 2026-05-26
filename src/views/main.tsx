"use client";

import { useEffect, useState, useRef } from "react";
import EmptyState from "@/views/main/empty";
import SearchView from "@/views/main/search";

interface MainViewProps {
  isLoading?: boolean;
}

type TabType = "feed" | "events" | "trending";

export default function MainView({ isLoading = false }: MainViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Список табов в правильном порядке для навигации жестами
  const tabsOrder: TabType[] = ["feed", "events", "trending"];

  const tabFeedRef = useRef<HTMLButtonElement>(null);
  const tabEventsRef = useRef<HTMLButtonElement>(null);
  const tabTrendingRef = useRef<HTMLButtonElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Координаты для отслеживания свайпа
  const touchStartX = useRef<number | null>(null);

  const physicsState = useRef({
    x: 0, tx: 0, vx: 0,
    w: 0, tw: 0, vw: 0,
    sx: 1, tsx: 1, vsx: 0,
    sy: 1, tsy: 1, vsy: 0,
    isMoving: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      const theme = webApp.colorScheme || "dark";
      const bgColor = theme === "dark" ? "#000000" : "#FFFFFF";
      
      webApp.setHeaderColor(bgColor);
      webApp.setBackgroundColor(bgColor);
    }
  }, []);

  useEffect(() => {
    if (isLoading || isSearching) return;

    // Подкрутили жесткость (k), чтобы анимация возвращалась быстрее при свайпах
    const PHYSICS = {
      pos: { k: 320, d: 28, m: 1 },    
      scale: { k: 340, d: 24, m: 1 }   
    };

    function spring(current: number, target: number, velocity: number, config: { k: number, d: number, m: number }) {
      const force = -config.k * (current - target);
      const damping = -config.d * velocity;
      const acceleration = (force + damping) / config.m;
      velocity += acceleration * 0.016;
      current += velocity * 0.016;
      return [current, velocity];
    }

    let rafId: number;

    const updatePhysics = () => {
      const state = physicsState.current;
      const slider = sliderRef.current;
      if (!slider) return;

      const dist = Math.abs(state.x - state.tx);
      const vel = Math.abs(state.vx);

      if (state.isMoving) {
        if (dist > 15) { 
          slider.style.backgroundColor = "transparent";
          slider.style.borderColor = typeof window !== "undefined" && document.documentElement.classList.contains("dark") 
            ? "rgba(255, 255, 255, 0.35)" 
            : "rgba(0, 0, 0, 0.18)";
          state.tsy = 1.15; 
          state.tsx = 0.92; 
        } else if (dist <= 15 && dist > 0.5) {
          slider.style.backgroundColor = "";
          slider.style.borderColor = "transparent";
          state.tsy = 0.97; 
          state.tsx = 1.03; 
        } else {
          state.tsx = 1;
          state.tsy = 1;
          if (vel < 0.2 && Math.abs(state.vsx) < 0.2) {
            state.isMoving = false;
            slider.style.backgroundColor = "";
            slider.style.borderColor = "transparent";
          }
        }
      }

      [state.x, state.vx] = spring(state.x, state.tx, state.vx, PHYSICS.pos);
      [state.w, state.vw] = spring(state.w, state.tw, state.vw, PHYSICS.pos);
      [state.sx, state.vsx] = spring(state.sx, state.tsx, state.vsx, PHYSICS.scale);
      [state.sy, state.vsy] = spring(state.sy, state.tsy, state.vsy, PHYSICS.scale);

      slider.style.left = `${state.x}px`;
      slider.style.width = `${state.w}px`;
      slider.style.transform = `scale(${state.sx}, ${state.sy})`;

      rafId = requestAnimationFrame(updatePhysics);
    };

    rafId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(rafId);
  }, [isLoading, isSearching]);

  useEffect(() => {
    if (isLoading || isSearching) return;
    
    const getTargetEl = () => {
      if (activeTab === "feed") return tabFeedRef.current;
      if (activeTab === "events") return tabEventsRef.current;
      return tabTrendingRef.current;
    };

    const targetEl = getTargetEl();
    if (targetEl) {
      const state = physicsState.current;
      
      if (state.w === 0) {
        state.x = targetEl.offsetLeft;
        state.w = targetEl.offsetWidth;
      }
      
      state.tx = targetEl.offsetLeft;
      state.tw = targetEl.offsetWidth;
      state.isMoving = true;
    }
  }, [activeTab, isLoading, isSearching]);

  const triggerHaptic = () => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try {
          anyWindow.Telegram.WebApp.HapticFeedback.selectionChanged();
        } catch (e) {}
      }
    }
  };

  const handleTabClick = (tab: TabType) => {
    if (tab !== activeTab) {
      triggerHaptic();
      setActiveTab(tab);
    }
  };

  // ЛОГИКА СВАЙПОВ
  const handleTouchStart = (e: React.TouchEvent) => {
    // Не свайпаем, если открыт поиск
    if (isSearching) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || isSearching) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    touchStartX.current = null; // Сбрасываем

    const minSwipeDistance = 60;  // Сильно, но не слишком (порог срабатывания)
    const maxSwipeDistance = 240; // Ограничение сверху, чтобы случайные длинные жесты не ломали навигацию

    const absDiffX = Math.abs(diffX);

    if (absDiffX >= minSwipeDistance && absDiffX <= maxSwipeDistance) {
      const currentIdx = tabsOrder.indexOf(activeTab);

      if (diffX > 0) {
        // Свайп влево -> идем к следующему табу (вправо)
        if (currentIdx < tabsOrder.length - 1) {
          handleTabClick(tabsOrder[currentIdx + 1]);
        }
      } else {
        // Свайп вправо -> идем к предыдущему табу (влево)
        if (currentIdx > 0) {
          handleTabClick(tabsOrder[currentIdx - 1]);
        }
      }
    }
  };

  const enableSearch = () => {
    triggerHaptic();
    setIsSearching(true);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const disableSearch = () => {
    triggerHaptic();
    setIsSearching(false);
    setSearchQuery("");
    setActiveTag(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!activeTag) {
      const match = value.match(/^@([^\s]+)\s$/);
      if (match) {
        triggerHaptic();
        setActiveTag(match[1]);
        setSearchQuery("");
        return;
      }
    }

    setSearchQuery(value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && searchQuery === "" && activeTag) {
      triggerHaptic();
      setActiveTag(null);
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300">
      
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
      
      {/* Добавили touch-обработчики на всю область контента */}
      <main 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 w-full pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] flex flex-col overflow-hidden select-none"
      >
        
        <div className="w-[calc(100%-40px)] mx-auto pt-3 box-border">
          {isLoading ? (
            <div className="w-full h-11 bg-neutral-300 dark:bg-neutral-800 rounded-full animate-pulse" />
          ) : (
            <div className="w-full h-11 relative flex items-center">
              
              <div 
                className="absolute left-0 top-0 bottom-0 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg p-1 box-border rounded-full flex items-center overflow-x-auto transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1) [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{
                  width: "calc(100% - 54px)",
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
                  ref={tabFeedRef}
                  onClick={() => handleTabClick("feed")}
                  className={`flex-1 px-3 h-full rounded-full text-xs font-bold z-20 transition-colors duration-250 outline-none whitespace-nowrap flex-shrink-0 flex items-center justify-center ${
                    activeTab === "feed" ? "text-appleLight-text dark:text-appleDark-text" : "text-appleLight-text/45 dark:text-appleDark-text/45"
                  }`}
                >
                  Лента
                </button>

                <button
                  ref={tabEventsRef}
                  onClick={() => handleTabClick("events")}
                  className={`flex-1 px-3 h-full rounded-full text-xs font-bold z-20 transition-colors duration-250 outline-none whitespace-nowrap flex-shrink-0 flex items-center justify-center ${
                    activeTab === "events" ? "text-appleLight-text dark:text-appleDark-text" : "text-appleLight-text/45 dark:text-appleDark-text/45"
                  }`}
                >
                  События
                </button>

                <button
                  ref={tabTrendingRef}
                  onClick={() => handleTabClick("trending")}
                  className={`flex-1 pl-3 pr-2.5 h-full rounded-full text-xs font-bold z-20 transition-colors duration-250 outline-none whitespace-nowrap flex-shrink-0 flex items-center justify-center space-x-1 ${
                    activeTab === "trending" ? "text-appleLight-text dark:text-appleDark-text" : "text-appleLight-text/45 dark:text-appleDark-text/45"
                  }`}
                >
                  <span>В тренде</span>
                  
                  <span 
                    className="px-1.5 py-0.5 text-[8.5px] font-black uppercase bg-[#FC062D] text-white rounded-[5px] tracking-wider leading-none flex items-center justify-center"
                    style={{ fontFamily: "ui-rounded, 'SF Pro Rounded', 'Montserrat', system-ui, sans-serif" }}
                  >
                    New
                  </span>
                </button>
              </div>

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
                          placeholder={activeTag ? "" : "Поиск..."}
                          value={searchQuery}
                          onChange={handleInputChange}
                          onKeyDown={handleInputKeyDown}
                          className="flex-1 h-full bg-transparent border-none outline-none text-base font-normal text-appleLight-text dark:text-appleDark-text placeholder-appleLight-text/35 dark:placeholder-appleDark-text/35 placeholder:text-xs placeholder:font-normal"
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

        <div className="flex-1 w-full">
          {isSearching ? (
            <SearchView searchQuery={searchQuery} />
          ) : (
            <EmptyState isLoading={isLoading} activeTab={activeTab} />
          )}
        </div>
      </main>
    </div>
  );
}
