"use client";

import { useEffect, useState, useRef } from "react";
import EmptyState from "@/views/main/empty";
import SearchView from "@/views/main/search";
import SettingsView from "@/views/settings";
import Header from "@/views/main/header";

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
    sx: 1, tsx: 1, vsx: 0,
    sy: 1, tsy: 1, vsy: 0,
    isMoving: false,
  });

  // Фикс капли: сбрасываем параметры физики при открытии/закрытии настроек, чтобы пересчитать ширину новых DOM-элементов
  useEffect(() => {
    if (isSettingsOpen) {
      physicsState.current.w = 0;
      physicsState.current.x = 0;
    }
  }, [isSettingsOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      const webApp = anyWindow.Telegram?.WebApp;
      if (webApp) {
        const theme = webApp.colorScheme || "dark";
        const bgColor = theme === "dark" ? "#000000" : "#FFFFFF";
        
        webApp.setHeaderColor(bgColor);
        webApp.setBackgroundColor(bgColor);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      const tg = anyWindow.Telegram?.WebApp;
      
      if (tg?.SettingsButton) {
        const handleSettingsClick = () => {
          setIsSettingsOpen(true);
        };
        
        tg.SettingsButton.onClick(handleSettingsClick);
        tg.SettingsButton.show();
        
        return () => {
          tg.SettingsButton.offClick(handleSettingsClick);
          tg.SettingsButton.hide();
        };
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      const tg = anyWindow.Telegram?.WebApp;
      
      if (tg?.BackButton) {
        const handleBackClick = () => {
          setIsSettingsOpen(false);
        };
        
        if (isSettingsOpen) {
          tg.BackButton.onClick(handleBackClick);
          tg.BackButton.show();
        } else {
          tg.BackButton.hide();
          tg.BackButton.offClick(handleBackClick);
        }
        
        return () => {
          tg.BackButton.offClick(handleBackClick);
        };
      }
    }
  }, [isSettingsOpen]);

  useEffect(() => {
    if (isLoading || isSearching || isSettingsOpen) return;

    const PHYSICS = {
      pos: { k: 340, d: 28, m: 1 },    
      scale: { k: 360, d: 24, m: 1 }   
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
  }, [isLoading, isSearching, isSettingsOpen]);

  useEffect(() => {
    if (isLoading || isSearching || isSettingsOpen) return;
    
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
  }, [activeTab, isLoading, isSearching, isSettingsOpen]);

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
      isClickTransition.current = true;
      
      if (contentTrackRef.current) {
        contentTrackRef.current.style.transition = "none";
        const targetIdx = tabsOrder.indexOf(tab);
        contentTrackRef.current.style.transform = `translateX(${-targetIdx * window.innerWidth}px)`;
      }
      
      setActiveTab(tab);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSearching) return;
    
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    isSwiping.current = false;
    isClickTransition.current = false;
    
    if (contentTrackRef.current) {
      contentTrackRef.current.style.transition = "none";
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isSearching || !touchStart.current.time) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;

    if (!isSwiping.current) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        isSwiping.current = true;
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        touchStart.current.time = 0;
        return;
      }
    }

    if (isSwiping.current && contentTrackRef.current) {
      e.preventDefault();
      
      const currentIdx = tabsOrder.indexOf(activeTab);
      const width = window.innerWidth;
      let translate = -currentIdx * width + deltaX;

      if ((currentIdx === 0 && deltaX > 0) || (currentIdx === tabsOrder.length - 1 && deltaX < 0)) {
        translate = -currentIdx * width + deltaX * 0.35; 
      }

      currentTranslate.current = translate;
      contentTrackRef.current.style.transform = `translateX(${translate}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (isSearching || !isSwiping.current) return;
    isSwiping.current = false;

    const width = window.innerWidth;
    const currentIdx = tabsOrder.indexOf(activeTab);
    const movedX = currentTranslate.current + (currentIdx * width);
    const duration = Date.now() - touchStart.current.time;

    let targetIdx = currentIdx;

    if (Math.abs(movedX) > width * 0.35 || (duration < 250 && Math.abs(movedX) > 40)) {
      if (movedX > 0 && currentIdx > 0) {
        targetIdx = currentIdx - 1;
      } else if (movedX < 0 && currentIdx < tabsOrder.length - 1) {
        targetIdx = currentIdx + 1;
      }
    }

    if (contentTrackRef.current) {
      contentTrackRef.current.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)";
      contentTrackRef.current.style.transform = `translateX(${-targetIdx * width}px)`;
    }

    if (targetIdx !== currentIdx) {
      triggerHaptic();
      setActiveTab(tabsOrder[targetIdx]);
    }
  };

  useEffect(() => {
    if (contentTrackRef.current && !isSearching) {
      const currentIdx = tabsOrder.indexOf(activeTab);
      
      if (isClickTransition.current) {
        isClickTransition.current = false;
        return;
      }

      contentTrackRef.current.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)";
      contentTrackRef.current.style.transform = `translateX(${-currentIdx * window.innerWidth}px)`;
    }
  }, [activeTab, isSearching]);

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

  if (isSettingsOpen) {
    return <SettingsView />;
  }

  return (
    <div className="flex flex-col w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300">
      
      <main className="flex-1 w-full pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] flex flex-col overflow-hidden select-none">
        
        {/* Вынесенный компонент шапки (Логотип, Поиск и Таббар) */}
        <Header
          isLoading={isLoading}
          activeTab={activeTab}
          isSearching={isSearching}
          searchQuery={searchQuery}
          activeTag={activeTag}
          sliderRef={sliderRef}
          tabFeedRef={tabFeedRef}
          tabEventsRef={tabEventsRef}
          tabTrendingRef={tabTrendingRef}
          inputRef={inputRef}
          handleTabClick={handleTabClick}
          enableSearch={enableSearch}
          disableSearch={disableSearch}
          handleInputChange={handleInputChange}
          handleInputKeyDown={handleInputKeyDown}
        />

        {/* Скролл-трек контента */}
        <div className="flex-1 w-full overflow-hidden relative mt-1">
          {isSearching ? (
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
