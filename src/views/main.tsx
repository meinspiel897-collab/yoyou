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
  const containerRef = useRef<HTMLDivElement>(null);
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
    currentIndex: 0
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.setHeaderColor("#000000");
      webApp.setBackgroundColor("#000000");
    }
  }, []);

  // Инициализация и цикл физики пружины (Spring Physics Engine)
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
          slider.classList.add("liquid-flying");
          state.tsy = 1.22; // Растяжение по вертикали во время полета
          state.tsx = 0.88; // Сужение по горизонтали
        } else if (dist <= 15 && dist > 0.5) {
          slider.classList.remove("liquid-flying");
          state.tsy = 0.95; // Эффект шлепка при приближении
          state.tsx = 1.06; 
        } else {
          state.tsx = 1;
          state.tsy = 1;
          if (vel < 0.2 && Math.abs(state.vsx) < 0.2) {
            state.isMoving = false;
            slider.classList.remove("liquid-flying");
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

  // Следим за изменением табов для пересчета координат целей
  useEffect(() => {
    if (isLoading || isSearching) return;
    
    const targetEl = activeTab === "feed" ? tabFeedRef.current : tabEventsRef.current;
    if (targetEl) {
      const state = physicsState.current;
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
    // Обертка с сочной референс-картинкой для демонстрации "жидкого стекла"
    <div 
      className="flex flex-col w-full h-full bg-cover bg-center overflow-hidden relative"
      style={{ backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkLiZZofuMdxDrT1-l8xUj0r7hEpeStNzrFqFqgayAjeO5YdDEWEJXo_lQ&s=10')` }}
    >
      {/* Затемняющий оверлей для читаемости */}
      <div className="absolute inset-0 bg-black/25 z-0 pointer-events-none" />

      {/* ХЕДЕР */}
      <header className="absolute top-[var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))] left-0 right-0 h-11 flex items-center justify-center z-50 pointer-events-none select-none">
        {isLoading ? (
          <div className="w-24 h-5 bg-white/10 backdrop-blur-md border border-white/5 rounded-md animate-pulse" />
        ) : (
          <div className="flex items-center space-x-2.5 bg-black/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5">
            <img src="/icons/logo.png" alt="Логотип" className="w-5 h-5 object-contain" />
            <h1 className="text-base font-extrabold tracking-tight text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
              ЙОУЙОУ
            </h1>
          </div>
        )}
      </header>
      
      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 w-full pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] flex flex-col overflow-hidden z-10">
        
        {/* ЗОНА УПРАВЛЕНИЯ: РОДИТЕЛЬСКИЙ ФЛЕКС С ДИСТАНЦИЕЙ 20PX ОТ КРАЕВ */}
        <div className="w-[calc(100%-40px)] mx-auto pt-3 box-border">
          {isLoading ? (
            <div className="w-full h-10 bg-white/10 backdrop-blur-md border border-white/5 rounded-full animate-pulse" />
          ) : (
            <div className="w-full h-10 flex items-center relative">
              
              {/* LIQUID CHOOSEBAR */}
              <div 
                ref={containerRef}
                className="h-full bg-neutral-900/60 backdrop-blur-[25px] saturate-[180%] p-1 box-border rounded-full flex relative border border-white/10 shadow-2xl transition-all duration-300 cubic-bezier(0.25, 1, 0.5, 1)"
                style={{
                  width: isSearching ? "0px" : "calc(100% - 50px)",
                  marginRight: isSearching ? "0px" : "10px",
                  opacity: isSearching ? 0 : 1,
                  visibility: isSearching ? "hidden" : "visible",
                  pointerEvents: isSearching ? "none" : "auto",
                }}
              >
                {/* Физическая интерактивная капля */}
                <div 
                  ref={sliderRef}
                  className="absolute top-1 bottom-1 bg-white/15 rounded-full border border-transparent will-change-transform transition-[background-color,border-color] duration-150 ease-out z-10"
                />

                {/* Таб Лента */}
                <button
                  ref={tabFeedRef}
                  onClick={() => handleTabClick("feed")}
                  className={`flex-1 h-full rounded-full text-xs font-bold z-20 transition-colors duration-250 outline-none ${
                    activeTab === "feed" ? "text-white" : "text-white/45"
                  }`}
                >
                  Лента
                </button>

                {/* Таб События */}
                <button
                  ref={tabEventsRef}
                  onClick={() => handleTabClick("events")}
                  className={`flex-1 h-full rounded-full text-xs font-bold z-20 transition-colors duration-250 outline-none ${
                    activeTab === "events" ? "text-white" : "text-white/45"
                  }`}
                >
                  События
                </button>
              </div>

              {/* МОРФИНГ-КНОПКА ПОИСКА (КРУГ -> ПОЛНОЦЕННЫЙ GLASS INPUT НА ВСЮ ШИРИНУ) */}
              <div 
                className="h-full bg-neutral-900/60 backdrop-blur-[25px] saturate-[180%] rounded-full border border-white/10 shadow-2xl transition-all duration-300 cubic-bezier(0.25, 1, 0.5, 1) flex items-center relative overflow-hidden"
                style={{
                  width: isSearching ? "100%" : "40px",
                  padding: isSearching ? "0 14px" : "0px",
                }}
              >
                {isSearching ? (
                  <div className="w-full h-full flex items-center justify-between">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Поиск..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[calc(100%-24px)] h-full bg-transparent border-none outline-none text-xs font-bold text-white placeholder-white/35"
                    />
                    <button 
                      onClick={disableSearch}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 outline-none active:scale-90 transition-transform"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="stroke-white stroke-[1.5]">
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
                      className="w-4 h-4 object-contain opacity-85"
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

      {/* Стили для кастомных эффектов летящей жидкой капли */}
      <style jsx global>{`
        .liquid-flying {
          background-color: transparent !important;
          border-color: rgba(255, 255, 255, 0.28) !important;
          backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
}
