"use client";

import { useState, useEffect } from "react";
import LoadingView from "@/views/loading";
import MainView from "@/views/main";

export default function Home() {
  const [showMain, setShowMain] = useState(false);

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

  // Мгновенное переключение без задержек и оверлеев
  const handleOnboardingComplete = () => {
    setShowMain(true);
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
    </div>
  );
}
