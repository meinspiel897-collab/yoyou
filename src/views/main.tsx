"use client";

import { useEffect, useState, useRef } from "react";
import EmptyState from "@/views/main/empty";
import SearchView from "@/views/main/search";
import SettingsView from "@/views/settings";

interface MainViewProps {
  isLoading?: boolean;
}

type TabType = "feed" | "events" | "trending";

export default function MainView({ isLoading = false }: MainViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const tabsOrder: TabType[] = ["feed", "events", "trending"];

  const tabFeedRef = useRef<HTMLButtonElement>(null);
  const tabEventsRef = useRef<HTMLButtonElement>(null);
  const tabTrendingRef = useRef<HTMLButtonElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentTrackRef = useRef<HTMLDivElement>(null);

  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const isSwiping = useRef(false);
  const currentTranslate = useRef(0);
  const isClickTransition = useRef(false);

  const physicsState = useRef({
    x: 0, tx: 0, vx: 0,
    w: 0, tw: 0, vw: 0,
  });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.MainButton) {
        tg.MainButton.setText("Оценить стиль");
        tg.MainButton.setParams({
          color: "#FC062D",
          text_color: "#FFFFFF",
          is_active: true,
        });

        if (!isSearching && !isSettingsOpen) {
          tg.MainButton.show();
        } else {
          tg.MainButton.hide();
        }

        const handleMainButtonClick = () => {
          if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred("success");
          }
        };

        tg.MainButton.onClick(handleMainButtonClick);

        return () => {
          tg.MainButton.offClick(handleMainButtonClick);
          tg.MainButton.hide();
        };
      }
    }
  }, [isSearching, isSettingsOpen]);

  const updateSliderTarget = (tab: TabType, immediate = false) => {
    let targetButton = tabFeedRef.current;
    if (tab === "events") targetButton = tabEventsRef.current;
    if (tab === "trending") targetButton = tabTrendingRef.current;

    if (!targetButton || !sliderRef.current) return;

    const targetX = targetButton.offsetLeft;
    const targetW = targetButton.offsetWidth;

    physicsState.current.tx = targetX;
    physicsState.current.tw = targetW;

    if (immediate) {
      physicsState.current.x = targetX;
      physicsState.current.w = targetW;
      if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(${targetX}px)`;
        sliderRef.current.style.width = `${targetW}px`;
      }
    }
  };

  useEffect(() => {
    if (isSettingsOpen) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    const triggerSelectionHaptic = () => {
      if (typeof window !== "undefined") {
        const anyWindow = window as any;
        if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
          try {
            anyWindow.Telegram.WebApp.HapticFeedback.selectionChanged();
          } catch (e) {}
        }
      }
    };

    const animatePhysics = () => {
      const state = physicsState.current;
      const k = 0.16;
      const d = 0.68;

      const ax = (state.tx - state.x) * k;
      state.vx = (state.vx + ax) * d;
      state.x += state.vx;

      const aw = (state.tw - state.w) * k;
      state.vw = (state.vw + aw) * d;
      state.w += state.vw;

      if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(${state.x}px)`;
        sliderRef.current.style.width = `${state.w}px`;
      }

      const diffX = Math.abs(state.tx - state.x);
      const diffW = Math.abs(state.tw - state.w);

      if (diffX < 0.05 && diffW < 0.05 && Math.abs(state.vx) < 0.05 && Math.abs(state.vw) < 0.05) {
        state.x = state.tx;
        state.w = state.tw;
        state.vx = 0;
        state.vw = 0;
        if (sliderRef.current) {
          sliderRef.current.style.transform = `translateX(${state.x}px)`;
          sliderRef.current.style.width = `${state.w}px`;
        }
        animationFrameId.current = null;
        return;
      }

      animationFrameId.current = requestAnimationFrame(animatePhysics);
    };

    updateSliderTarget(activeTab, physicsState.current.w === 0);
    triggerSelectionHaptic();

    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(animatePhysics);
    }

    if (!isClickTransition.current && contentTrackRef.current) {
      const index = tabsOrder.indexOf(activeTab);
      const w = window.innerWidth;
      currentTranslate.current = -index * w;
      contentTrackRef.current.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
      contentTrackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
    }
    isClickTransition.current = false;
  }, [activeTab, isSettingsOpen]);

  useEffect(() => {
    const handleResize = () => updateSliderTarget(activeTab, true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSearching || isSettingsOpen || !contentTrackRef.current) return;
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    isSwiping.current = true;
    isClickTransition.current = false;
    contentTrackRef.current.style.transition = "none";
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current || !contentTrackRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      isSwiping.current = false;
      const index = tabsOrder.indexOf(activeTab);
      contentTrackRef.current.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
      contentTrackRef.current.style.transform = `translateX(${-index * window.innerWidth}px)`;
      return;
    }

    if (Math.abs(deltaX) > 5) {
      if (e.cancelable) e.preventDefault();
      const newTranslate = currentTranslate.current + deltaX;
      contentTrackRef.current.style.transform = `translateX(${newTranslate}px)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current || !contentTrackRef.current) return;
    isSwiping.current = false;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaTime = Date.now() - touchStart.current.time;
    const w = window.innerWidth;
    const currentIndex = tabsOrder.indexOf(activeTab);

    let nextIndex = currentIndex;
    const velocity = Math.abs(deltaX) / deltaTime;

    if (Math.abs(deltaX) > w * 0.25 || (velocity > 0.3 && Math.abs(deltaX) > 30)) {
      if (deltaX < 0 && currentIndex < tabsOrder.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (deltaX > 0 && currentIndex > 0) {
        nextIndex = currentIndex - 1;
      }
    }

    currentTranslate.current = -nextIndex * w;
    contentTrackRef.current.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
    contentTrackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;

    if (nextIndex !== currentIndex) {
      setActiveTab(tabsOrder[nextIndex]);
    }
  };

  return (
    <div className="w-full h-full bg-appleLight-bg dark:bg-appleDark-bg text-appleLight-text dark:text-appleDark-text flex flex-col overflow-hidden select-none">
      <main className="flex-1 w-full flex flex-col overflow-hidden relative">
        
        {/* Фиксированная шапка с размытием в стиле Apple */}
        <div className="px-5 pt-3 flex flex-col flex-shrink-0 z-20 bg-appleLight-bg/80 dark:bg-appleDark-bg/80 backdrop-blur-md">
          <div className="flex items-center justify-between h-10 mb-2">
            <h1 className="text-2xl font-black tracking-tight font-manrope">ЙОУЙОУ</h1>
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-8 h-8 rounded-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg flex items-center justify-center active:scale-95 transition-transform outline-none"
            >
              <img 
                src="/icons/settings.png" 
                alt="Настройки" 
                className="w-4 h-4 object-contain brightness-0 dark:brightness-0 dark:invert"
              />
            </button>
          </div>

          {!isSettingsOpen && (
            <div className="flex items-center justify-between gap-3 h-11 relative bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[11px] px-3">
              <div className="flex items-center gap-2 flex-1 h-full">
                <img 
                  src="/icons/search.png" 
                  alt="Лупа" 
                  className="w-4 h-4 object-contain opacity-30 dark:opacity-40"
                />
                <input 
                  ref={inputRef}
                  type="text"
                  placeholder="Поиск трендов и стилей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearching(true)}
                  className="w-full bg-transparent outline-none text-[15px] font-normal text-appleLight-text dark:text-appleDark-text placeholder-appleLight-text/40 dark:placeholder-appleDark-text/45"
                />
              </div>

              <div className="flex items-center flex-shrink-0">
                {isSearching ? (
                  <button 
                    onClick={() => {
                      setIsSearching(false);
                      setSearchQuery("");
                      if (inputRef.current) inputRef.current.blur();
                    }}
                    className="text-[15px] font-medium text-[#FC062D] active:scale-95 transition-transform"
                  >
                    Отмена
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setIsSearching(true);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className="flex items-center justify-center w-7 h-7 bg-black dark:bg-white rounded-full outline-none active:scale-95 transition-transform"
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

        {/* Чузбар / Таб-бар */}
        {!isSettingsOpen && !isSearching && (
          <div className="px-5 h-11 flex items-center flex-shrink-0 border-b border-appleLight-text/5 dark:border-white/5 relative bg-appleLight-bg/80 dark:bg-appleDark-bg/80 backdrop-blur-md z-10">
            <div className="flex gap-6 h-full relative w-full">
              
              {/* Капля подложки с пружинной физикой */}
              <div 
                ref={sliderRef}
                className="absolute bottom-0 h-0.5 bg-[#FC062D] rounded-full pointer-events-none will-change-transform"
                style={{ width: "0px", transform: "translateX(0px)" }}
              />

              <button 
                ref={tabFeedRef}
                onClick={() => { isClickTransition.current = true; setActiveTab("feed"); }}
                className={`h-full text-[15px] font-bold transition-colors duration-200 outline-none ${activeTab === "feed" ? "text-[#FC062D]" : "text-appleLight-text/40 dark:text-appleDark-text/45"}`}
              >
                Лента
              </button>
              
              <button 
                ref={tabEventsRef}
                onClick={() => { isClickTransition.current = true; setActiveTab("events"); }}
                className={`h-full text-[15px] font-bold transition-colors duration-200 outline-none ${activeTab === "events" ? "text-[#FC062D]" : "text-appleLight-text/40 dark:text-appleDark-text/45"}`}
              >
                Ивенты
              </button>
              
              <button 
                ref={tabTrendingRef}
                onClick={() => { isClickTransition.current = true; setActiveTab("trending"); }}
                className={`h-full text-[15px] font-bold transition-colors duration-200 outline-none ${activeTab === "trending" ? "text-[#FC062D]" : "text-appleLight-text/40 dark:text-appleDark-text/45"}`}
              >
                Тренды
              </button>

            </div>
          </div>
        )}

        {/* Контентный трек */}
        <div className="flex-1 w-full overflow-hidden relative mt-1">
          {isSettingsOpen ? (
            <div className="absolute inset-0 overflow-y-auto px-5 pt-4">
              <SettingsView />
            </div>
          ) : isSearching ? (
            <SearchView searchQuery={searchQuery} />
          ) : (
            <div 
              ref={contentTrackRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="absolute inset-0 flex w-[300%] h-full will-change-transform"
              style={{ transform: `translateX(0px)` }}
            >
              <div className="w-screen h-full flex-shrink-0 overflow-y-auto">
                <EmptyState isLoading={isLoading} activeTab="feed" />
              </div>
              <div className="w-screen h-full flex-shrink-0 overflow-y-auto">
                <EmptyState isLoading={isLoading} activeTab="events" />
              </div>
              <div className="w-screen h-full flex-shrink-0 overflow-y-auto">
                <EmptyState isLoading={isLoading} activeTab="trending" />
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
