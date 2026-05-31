"use client";

import React, { useState, useEffect, useRef } from "react";
import RateView from "./rate";
import TakeView from "./take";

interface NewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubTabType = "rate" | "take" | "tier" | "over";

interface TabConfig {
  id: SubTabType;
  label: string;
}

export default function NewModal({ isOpen, onClose }: NewModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("rate");
  const [modalHeight, setModalHeight] = useState<string>("90%");
  const [useAnimation, setUseAnimation] = useState<boolean>(true);
  
  // Раздельные стейты для сохранения контента при свайпах
  const [rateTitle, setRateTitle] = useState("");
  const [rateDescription, setRateDescription] = useState("");
  
  const [takeTitle, setTakeTitle] = useState("");
  const [takeDescription, setTakeDescription] = useState("");

  const [animationData, setAnimationData] = useState<any>(null);

  const tabs: TabConfig[] = [
    { id: "rate", label: "Оценка" },
    { id: "take", label: "Тейк" },
    { id: "tier", label: "Тир лист" },
    { id: "over", label: "Оверрейт" },
  ];

  const subTabOrder: SubTabType[] = ["rate", "take", "tier", "over"];
  const activeIndex = subTabOrder.indexOf(activeSubTab);

  const sliderRef = useRef<HTMLDivElement>(null);
  const tabsRefs = useRef<{ [key in SubTabType]: HTMLButtonElement | null }>({
    rate: null,
    take: null,
    tier: null,
    over: null,
  });

  // Тактильный отклик Telegram
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

  // Фиксируем высоту при монтировании, чтобы клавиатура не поднимала кнопку
  useEffect(() => {
    if (typeof window !== "undefined") {
      setModalHeight(`${window.innerHeight * 0.9}px`);
    }
  }, []);

  // Логика свайпов (Touch tracking)
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isHorizontalSwipe = useRef<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Защита от скроллбара: если тапают у правого края экрана — игнорируем свайп табов
    if (e.touches[0].clientX > window.innerWidth - 20) return;

    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === 0) return;

    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    if (!isHorizontalSwipe.current && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isHorizontalSwipe.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isHorizontalSwipe.current) {
      touchStartX.current = 0;
      return;
    }
    
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const swipeThreshold = 60;

    if (deltaX < -swipeThreshold && activeIndex < subTabOrder.length - 1) {
      triggerHaptic("light");
      setUseAnimation(true); // Включаем анимацию для жеста свайпа
      setActiveSubTab(subTabOrder[activeIndex + 1]);
    } else if (deltaX > swipeThreshold && activeIndex > 0) {
      triggerHaptic("light");
      setUseAnimation(true); // Включаем анимацию для жеста свайпа
      setActiveSubTab(subTabOrder[activeIndex - 1]);
    }
    touchStartX.current = 0;
  };

  const handleTabClick = (id: SubTabType) => {
    triggerHaptic("light");
    setUseAnimation(false); // Выключаем анимацию при клике по таббару
    setActiveSubTab(id);
  };

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

  // Цикл анимации пружины для капли-бегунка
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

  // Загрузка анимаций Lottie
  useEffect(() => {
    if (!isOpen) return;
    
    setAnimationData(null);
    const targetJson = activeSubTab === "tier" ? "tear" : activeSubTab;

    fetch(`/icons/${targetJson}.json`)
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
      {/* Задний блюр */}
      <div 
        className={`absolute inset-0 bg-black/15 dark:bg-black/30 transition-all duration-300 ${
          isOpen ? "opacity-100 backdrop-blur-[3px]" : "opacity-0 backdrop-blur-0"
        }`} 
        onClick={onClose} 
      />

      {/* Контейнер модального окна */}
      <div 
        className={`relative w-full bg-white dark:bg-neutral-900 rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 cubic-bezier(0.15, 1, 0.2, 1) will-change-transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: modalHeight }}
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

        {/* Навигационный таббар */}
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

        {/* Свайп-контейнер контента */}
        <div 
          className="flex-1 w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className={`flex w-[400%] h-full will-change-transform ${
              useAnimation ? "transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)" : ""
            }`}
            style={{ transform: `translateX(-${activeIndex * 25}%)` }}
          >
            {/* Секция: Оценка */}
            <div className="w-[25%] h-full flex flex-col overflow-hidden">
              <RateView 
                title={rateTitle}
                setTitle={setRateTitle}
                description={rateDescription}
                setDescription={setRateDescription}
                animationData={activeSubTab === "rate" ? animationData : null}
              />
            </div>

            {/* Секция: Тейк */}
            <div className="w-[25%] h-full flex flex-col overflow-hidden">
              <TakeView 
                title={takeTitle}
                setTitle={setTakeTitle}
                description={takeDescription}
                setDescription={setTakeDescription}
                animationData={activeSubTab === "take" ? animationData : null}
              />
            </div>

            {/* Секция: Тир лист */}
            <div className="w-[25%] h-full flex flex-col items-center justify-center text-center select-none">
              <span className="text-xl mb-2">🛠️</span>
              <p className="text-xs font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                В разработке
              </p>
            </div>

            {/* Секция: Оверрейт */}
            <div className="w-[25%] h-full flex flex-col items-center justify-center text-center select-none">
              <span className="text-xl mb-2">🛠️</span>
              <p className="text-xs font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                В разработке
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
