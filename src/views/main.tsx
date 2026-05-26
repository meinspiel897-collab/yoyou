"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import EmptyState from "@/views/main/empty";

interface MainViewProps {
  isLoading?: boolean;
}

type TabType = "feed" | "events";

export default function MainView({ isLoading = false }: MainViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const tabFeedRef = useRef<HTMLButtonElement>(null);
  const tabEventsRef = useRef<HTMLButtonElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Полностью сохраненный оригинальный цикл физики твоего чузбара
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

  useEffect(() => {
    if (isLoading || isSearching) return;
    
    const targetEl = activeTab === "feed" ? tabFeedRef.current : tabEventsRef.current;
    if (targetEl) {
      const state = physicsState.current;
      state.x = targetEl.offsetLeft;
      state.w = targetEl.offsetWidth;
      state.tx = targetEl.offsetLeft;
      state.tw = targetEl.offsetWidth;
      state.isMoving = false;
    }
  }, [activeTab, isLoading, isSearching]);

  const triggerHaptic = (type: "light" | "medium" = "light") => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try {
          if (type === "medium") {
            anyWindow.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
          } else {
            anyWindow.Telegram.WebApp.HapticFeedback.selectionChanged();
          }
        } catch (e) {}
      }
    }
  };

  const handleTabClick = (tab: TabType) => {
    if (tab !== activeTab) {
      triggerHaptic("light");
      setActiveTab(tab);
    }
  };

  const toggleSearchMode = () => {
    triggerHaptic("medium");
    if (isSearching) {
      setIsSearching(false);
      setSearchQuery("");
    } else {
      setIsSearching(true);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  };

  // Плавное линейное замедление к концу траектории (как в примере, но без пружины)
  const textVariants = {
    transition: { duration: 0.25, ease: "easeOut" }
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
        
        {/* КОРНЕВОЙ КОНТЕЙНЕР С РОДНЫМИ КЛАССАМИ И ОТСТУПАМИ */}
        <div className="w-[calc(100%-40px)] mx-auto pt-3 box-border">
          {isLoading ? (
            <div className="w-full h-11 bg-neutral-300 dark:bg-neutral-800 rounded-full animate-pulse" />
          ) : (
            <div className="w-full h-11 flex items-center gap-2 relative select-none">
              
              {/* ГЛАВНЫЙ БЛОК: ЧУЗБАР / СТРОКА ВВОДА */}
              <motion.div
                layout
                transition={textVariants.transition}
                style={{ order: isSearching ? 1 : -1 }}
                className="flex-1 h-11 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-full flex items-center pr-1 pl-1 relative z-10 overflow-hidden"
              >
                {/* 1. Блок оригинального Чузбара */}
                <div 
                  className="absolute inset-0 p-1 flex relative transition-opacity duration-200"
                  style={{
                    opacity: isSearching ? 0 : 1,
                    pointerEvents: isSearching ? "none" : "auto",
                  }}
                >
                  <div 
                    ref={sliderRef}
                    className="absolute top-1 bottom-1 bg-white dark:bg-neutral-800 rounded-full border border-transparent shadow-sm will-change-transform z-10"
                  />

                  <button
                    ref={tabFeedRef}
                    onClick={() => handleTabClick("feed")}
                    className={`flex-1 h-full rounded-full text-xs font-bold z-20 transition-colors duration-200 outline-none ${
                      activeTab === "feed" ? "text-appleLight-text dark:text-appleDark-text" : "text-appleLight-text/45 dark:text-appleDark-text/45"
                    }`}
                  >
                    Лента
                  </button>

                  <button
                    ref={tabEventsRef}
                    onClick={() => handleTabClick("events")}
                    className={`flex-1 h-full rounded-full text-xs font-bold z-20 transition-colors duration-200 outline-none ${
                      activeTab === "events" ? "text-appleLight-text dark:text-appleDark-text" : "text-appleLight-text/45 dark:text-appleDark-text/45"
                    }`}
                  >
                    События
                  </button>
                </div>

                {/* 2. Блок Строки Поиска */}
                <div 
                  className="absolute inset-0 px-4 flex items-center justify-between transition-opacity duration-200"
                  style={{
                    opacity: isSearching ? 1 : 0,
                    pointerEvents: isSearching ? "auto" : "none",
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Найти что-нибудь..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-full bg-transparent border-none outline-none text-[14px] font-medium text-appleLight-text dark:text-appleDark-text placeholder-appleLight-text/25 dark:placeholder-appleDark-text/25"
                  />
                </div>
              </motion.div>

              {/* КРУГЛАЯ КНОПКА (Всегда статичная, иконка белая, меняется только order) */}
              <motion.button
                layout
                whileTap={{ scale: 0.95 }}
                transition={textVariants.transition}
                onClick={toggleSearchMode}
                style={{ order: isSearching ? -1 : 1 }}
                className="h-11 w-11 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-full flex items-center justify-center shrink-0 z-20 overflow-hidden outline-none"
              >
                <img 
                  src="/icons/search.png" 
                  alt="Поиск" 
                  className="w-4 h-4 object-contain brightness-0 invert" 
                />
              </motion.button>

            </div>
          )}
        </div>

        {/* КОНТЕНТНАЯ ЗОНА */}
        <div className="flex-1 w-full">
          <EmptyState isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
