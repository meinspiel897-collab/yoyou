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

  // Быстрый триггер перехода без эффекта "желейности"
  const handleOnboardingComplete = () => {
    setFade(true); // Моментальный запуск затемнения загрузки
    setTimeout(() => {
      setShowMain(true); // Быстро переключаем экран на MainView
    }, 200); // Быстрый тайминг iOS-вспышки (200мс)
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

      {/* ОВЕРЛЕЙ ДЛЯ МГНОВЕННОЙ СМЕНЫ КАДРА */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none z-[99999]"
        style={{
          opacity: fade ? 1 : 0,
          visibility: fade ? "visible" : "hidden",
          // Изменено на 220мс с кривой мгновенного разгона cubic-bezier(0.215, 0.610, 0.355, 1)
          transition: "opacity 220ms cubic-bezier(0.215, 0.610, 0.355, 1), visibility 220ms cubic-bezier(0.215, 0.610, 0.355, 1)"
        }}
      />
    </div>
  );
}
