"use client";

import { useState, useEffect } from "react";
import LoadingView from "@/views/loading";
import MainView from "@/views/main";

export default function Home() {
  const [showMain, setShowMain] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasLoaded = sessionStorage.getItem("yoyou_fully_loaded");
      if (hasLoaded) {
        setShowMain(true);
      }
    }
  }, []);

  useEffect(() => {
    if (showMain && typeof window !== "undefined") {
      // Сохраняем ссылку локально для TypeScript
      const tgWebApp = (window as any).Telegram?.WebApp;
      
      if (tgWebApp?.requestFullscreen) {
        setTimeout(() => {
          try {
            tgWebApp.requestFullscreen();
          } catch (e) {}
        }, 50);
      }
    }
  }, [showMain]);

  // Триггер плавного перехода
  const handleOnboardingComplete = () => {
    setFade(true); // Включаем затемнение
    setTimeout(() => {
      setShowMain(true); // Переключаем экран
      // Затемнение уберется автоматически, так как MainView отрендерится "чистым"
    }, 600); // Тайминг CSS-перехода
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {/* ЭКРАН ЗАГРУЗКИ / ИНТЕРАКТИВА */}
      {!showMain && (
        <LoadingView onComplete={handleOnboardingComplete} />
      )}

      {/* ОСНОВНОЙ ЭКРАН ПРИЛОЖЕНИЯ */}
      {showMain && (
        <MainView />
      )}

      {/* ОВЕРЛЕЙ ДЛЯ ПЛАВНОГО ЗАТЕМНЕНИЯ (iOS style transition) */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none z-[99999]"
        style={{
          opacity: fade ? 1 : 0,
          visibility: fade ? "visible" : "hidden",
          transition: "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), visibility 600ms cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      />
    </div>
  );
}
