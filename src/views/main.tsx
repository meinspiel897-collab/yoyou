"use client";

import { useEffect, useState, useRef } from "react";
import EmptyState from "@/views/main/empty";

interface MainViewProps {
  isLoading?: boolean;
}

type TabType = "feed" | "events";

export default function MainView({ isLoading = false }: MainViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Рефы для точного расчета физики капли
  const tabFeedRef = useRef<HTMLButtonElement>(null);
  const tabEventsRef = useRef<HTMLButtonElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Внутреннее состояние физического движка капли
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

  // Цикл физики пружины капли (Spring Physics Engine)
  useEffect(() => {
    if (isLoading || isSearching) return;

    const PHYSICS = {
      pos: { k: 380, d: 38, m: 1 },    
      scale: { k: 420, d: 24, m: 1 }   
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
          slider.style.borderColor = document.documentElement.classList.contains("dark") 
            ? "rgba(255, 255, 255, 0.2)" 
            : "rgba(0, 0, 0, 0.12)";
          state.tsy = 1.22; 
          state.tsx = 0.88; 
        } else if (dist <= 15 && dist > 0.5) {
          slider.style.backgroundColor = "";
          slider.style.borderColor = "transparent";
          state.tsy = 0.95; 
          state.tsx = 1.06; 
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

  // Стабильный расчет геометрии табов без микро-задержек
  useEffect(() => {
    if (isLoading || isSearching) return;
    
    const targetEl = activeTab === "feed" ? tabFeedRef.current : tabEventsRef.current;
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

  const enableSearch = () => {
    triggerHaptic();
    setIsSearching(true);
    setTimeout(() => inputRef.current?.focus(), 250);
  };

  const disableSearch = () => {
    triggerHaptic();
    setIsSearching(false);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300">
      
      {/* ХЕДЕР */}
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
      
      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 w-full pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] flex flex-col overflow-hidden">
        
        {/* ОРГАНЫ УПРАВЛЕНИЯ: ВЫВЕРЕННЫЕ 20PX ОТ КРАЕВ ЭКРАНА */}
        <div className="w-[calc(100%-40px)] mx-auto pt-3 box-border">
          {isLoading ? (
            <div className="w-full h-11 bg-neutral-300 dark:bg-neutral-800 rounded-full animate-pulse" />
          ) : (
            <div className="w-full h-11 flex items-center relative select-none">
              
              {/* ЖИДКИЙ ЧУЗБАР (ВЫСОТА H-11, УМЕНЬШАЕТСЯ И ИСЧЕЗАЕТ БЕЗ СМЯТИЯ КНОПОК) */}
              <div 
                className="h-11 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg p-1 box-border rounded-full flex relative will-change-transform"
                style={{
                  width: "calc(100% - 54px)", // Сохраняет ширину, чтобы не ломать пузырь
                  opacity: isSearching ? 0 : 1,
                  transform: isSearching ? "scale(0.88) translateX(-15px)" : "scale(1) translateX(0px)",
                  transition: "opacity 0.25s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  pointerEvents: isSearching ? "none" : "auto",
                }}
              >
                {/* Интерактивный ползунок-капля */}
                <div 
                  ref={sliderRef}
                  className="absolute top-1 bottom-1 bg-white dark:bg-neutral-800 rounded-full border border-transparent shadow-sm will-change-transform z-10"
                />

                <button
                  ref={tabFeedRef}
                  onClick={() => handleTabClick("feed")}
                  className={`flex-1 h-full rounded-full text-xs font-bold z-20 transition-colors duration-250 outline-none ${
                    activeTab === "feed" ? "text-appleLight-text dark:text-appleDark-text" : "text-appleLight-text/45 dark:text-appleDark-text/45"
                  }`}
                >
                  Лента
                </button>

                <button
                  ref={tabEventsRef}
                  onClick={() => handleTabClick("events")}
                  className={`flex-1 h-full rounded-full text-xs font-bold z-20 transition-colors duration-250 outline-none ${
                    activeTab === "events" ? "text-appleLight-text dark:text-appleDark-text" : "text-appleLight-text/45 dark:text-appleDark-text/45"
                  }`}
                >
                  События
                </button>
              </div>

              {/* СТРОКА ПОИСКА С ПРУЖИННЫМ ЭФФЕКТОМ (ВЫРАСТАЕТ ИЗ КРУГА НА ВСЮ ШИРИНУ) */}
              <div 
                className="absolute right-0 h-11 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-full flex items-center overflow-hidden will-change-[width]"
                style={{
                  width: isSearching ? "100%" : "44px",
                  padding: isSearching ? "0 14px" : "0px",
                  // Кубический безье обеспечивает ту самую премиальную пружину при раскрытии
                  transition: "width 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), padding 0.2s ease",
                }}
              >
                {isSearching ? (
                  <div className="w-full h-full flex items-center justify-between animate-fadeIn">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Поиск..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[calc(100%-24px)] h-full bg-transparent border-none outline-none text-xs font-bold text-appleLight-text dark:text-appleDark-text placeholder-appleLight-text/35 dark:placeholder-appleDark-text/35 animate-fadeIn"
                    />
                    <button 
                      onClick={disableSearch}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-appleLight-text/10 dark:bg-white/10 outline-none active:scale-90 transition-transform"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="stroke-appleLight-text dark:stroke-appleDark-text stroke-[1.5]">
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
                      className="w-4 h-4 object-contain opacity-70 dark:opacity-90"
                    />
                  </button>
                )}
              </div>

            </div>
          )}
        </div>

        {/* НИЖНЯЯ ПАНЕЛЬ С КОНТЕНТОМ */}
        <div className="flex-1 w-full">
          <EmptyState isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
