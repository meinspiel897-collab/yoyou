"use client";

import React, { useState, useEffect, useRef } from "react";
import RateView from "./rate";
import TakeView from "./take";

interface NewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubTabType = "rate" | "take";

interface TabConfig {
  id: SubTabType;
  label: string;
}

export default function NewModal({ isOpen, onClose }: NewModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("rate");
  const [dimensions, setDimensions] = useState({ top: "10vh", height: "90vh" });
  const [isTyping, setIsTyping] = useState(false);
  
  const [rateTitle, setRateTitle] = useState("");
  const [rateDescription, setRateDescription] = useState("");
  
  const [takeTitle, setTakeTitle] = useState("");
  const [takeDescription, setTakeDescription] = useState("");

  const [animationData, setAnimationData] = useState<any>(null);

  // Только две базовые категории
  const tabs: TabConfig[] = [
    { id: "rate", label: "Оценка" },
    { id: "take", label: "Тейк" },
  ];

  const subTabOrder: SubTabType[] = ["rate", "take"];
  const activeIndex = subTabOrder.indexOf(activeSubTab);

  const sliderRef = useRef<HTMLDivElement>(null);
  const contentTrackRef = useRef<HTMLDivElement>(null);
  const tabsRefs = useRef<{ [key in SubTabType]: HTMLButtonElement | null }>({
    rate: null,
    take: null,
  });

  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const isSwiping = useRef(false);
  const currentTranslate = useRef(0);
  const isClickTransition = useRef(false);

  const triggerHaptic = (style: "light" | "medium" | "heavy") => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try {
          anyWindow.Telegram.WebApp.HapticFeedback.impactOccurred(style);
        } catch (e) {}
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const h = window.innerHeight;
      setDimensions({
        top: `${h * 0.1}px`,
        height: `${h * 0.9}px`
      });
    }
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTyping) return;
    if (e.touches[0].clientX > window.innerWidth - 30) return;

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
    if (isTyping || !touchStart.current.time) return;

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
      
      const width = window.innerWidth;
      let translate = -activeIndex * width + deltaX;

      if ((activeIndex === 0 && deltaX > 0) || (activeIndex === subTabOrder.length - 1 && deltaX < 0)) {
        translate = -activeIndex * width + deltaX * 0.35; 
      }

      currentTranslate.current = translate;
      contentTrackRef.current.style.transform = `translateX(${translate}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (isTyping || !isSwiping.current) return;
    isSwiping.current = false;

    const width = window.innerWidth;
    const movedX = currentTranslate.current + (activeIndex * width);
    const duration = Date.now() - touchStart.current.time;

    let targetIdx = activeIndex;

    if (Math.abs(movedX) > width * 0.35 || (duration < 250 && Math.abs(movedX) > 40)) {
      if (movedX > 0 && activeIndex > 0) {
        targetIdx = activeIndex - 1;
      } else if (movedX < 0 && activeIndex < subTabOrder.length - 1) {
        targetIdx = activeIndex + 1;
      }
    }

    if (contentTrackRef.current) {
      contentTrackRef.current.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)";
      contentTrackRef.current.style.transform = `translateX(${-targetIdx * width}px)`;
    }

    if (targetIdx !== activeIndex) {
      triggerHaptic("light");
      setActiveSubTab(subTabOrder[targetIdx]);
    }
    touchStart.current.time = 0;
  };

  const handleTabClick = (id: SubTabType) => {
    if (id === activeSubTab) return;
    triggerHaptic("light");
    isClickTransition.current = true;
    
    if (contentTrackRef.current) {
      contentTrackRef.current.style.transition = "none";
      const targetIdx = subTabOrder.indexOf(id);
      contentTrackRef.current.style.transform = `translateX(${-targetIdx * window.innerWidth}px)`;
    }
    setActiveSubTab(id);
  };

  useEffect(() => {
    if (contentTrackRef.current) {
      const currentIdx = subTabOrder.indexOf(activeSubTab);
      
      if (isClickTransition.current) {
        isClickTransition.current = false;
        return;
      }

      contentTrackRef.current.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)";
      contentTrackRef.current.style.transform = `translateX(${-currentIdx * window.innerWidth}px)`;
    }
  }, [activeSubTab]);

  const activeSubTabRef = useRef<SubTabType>(activeSubTab);
  useEffect(() => {
    activeSubTabRef.current = activeSubTab;
  }, [activeSubTab]);

  const physicsState = useRef({
    x: 0, tx: 0, vx: 0,
    w: 0, tw: 0, vw: 0,
    sx: 1, tsx: 1, vsx: 0,
    sy: 1, tsy: 1, vsy: 0,
    isMoving: false,
  });

  useEffect(() => {
    if (!isOpen) return;

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

      if (state.isMoving) {
        const currentTabKey = activeSubTabRef.current;
        const targetEl = tabsRefs.current[currentTabKey];
        
        if (targetEl) {
          state.tx = targetEl.offsetLeft;
          state.tw = targetEl.offsetWidth;
        }
      }

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
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const targetEl = tabsRefs.current[activeSubTab];
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
  }, [activeSubTab, isOpen]);

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
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div 
        className={`absolute inset-0 bg-black/15 dark:bg-black/30 transition-all duration-300 ${
          isOpen ? "opacity-100 backdrop-blur-[3px]" : "opacity-0 backdrop-blur-0"
        }`} 
        onClick={onClose} />

      <div 
        className={`absolute left-0 right-0 bg-white dark:bg-neutral-900 rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 cubic-bezier(0.15, 1, 0.2, 1) will-change-transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ 
          top: dimensions.top, 
          height: dimensions.height
        }}
      >
        {/* Шапка модалки */}
        <div className="relative w-full h-16 flex items-center justify-center px-4 flex-shrink-0 select-none">
          <h2 className="text-base font-bold text-appleLight-text dark:text-appleDark-text tracking-tight">
            Что-то новенькое
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

        {/* Навигационный таббар (на 2 вкладки) */}
        <div className="px-5 flex-shrink-0">
          <div className="w-full h-11 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg p-1 box-border rounded-full flex items-center relative mb-5 select-none">
            <div 
              ref={sliderRef}
              className="absolute top-1 bottom-1 bg-white/95 dark:bg-neutral-700/90 rounded-full border border-transparent shadow-sm will-change-transform z-10"
            />

            {tabs.map((tab) => {
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => { tabsRefs.current[tab.id] = el; }}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex-1 h-full rounded-full text-xs font-medium outline-none whitespace-nowrap flex items-center justify-center z-20 transition-colors duration-300 ${
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
        </div>

        {/* Свайп-зона трека (200% под 2 таба) */}
        <div className="flex-1 w-full overflow-hidden relative">
          <div 
            ref={contentTrackRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="absolute inset-0 flex w-[200%] h-full will-change-transform"
            style={{ transform: `translateX(0px)` }}
          >
            {/* Секция: Оценка */}
            <div className="w-[50%] h-full flex flex-col overflow-hidden">
              <RateView 
                title={rateTitle}
                setTitle={setRateTitle}
                description={rateDescription}
                setDescription={setRateDescription}
                animationData={activeSubTab === "rate" ? animationData : null}
                setIsTyping={setIsTyping}
              />
            </div>

            {/* Секция: Тейк */}
            <div className="w-[50%] h-full flex flex-col overflow-hidden">
              <TakeView 
                title={takeTitle}
                setTitle={setTakeTitle}
                description={takeDescription}
                setDescription={setTakeDescription}
                animationData={activeSubTab === "take" ? animationData : null}
                setIsTyping={setIsTyping}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
