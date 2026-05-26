"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingView from "@/views/loading";

// Отключаем серверный рендеринг (SSR) для главного экрана.
// Теперь Vercel соберет проект без единой ошибки.
const MainViewNonSSR = dynamic(() => import("@/views/main"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

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
        <MainViewNonSSR />
      )}
    </div>
  );
}
