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
      // Сохраняем ссылку локально, чтобы TypeScript не терял сужение типов внутри таймаута
      const tgWebApp = (window as any).Telegram?.WebApp;
      
      if (tgWebApp?.requestFullscreen) {
        setTimeout(() => {
          try {
            tgWebApp.requestFullscreen();
          } catch (e) {
            console.error("Failed to open fullscreen:", e);
          }
        }, 50);
      }
    }
  }, [showMain]);

  if (showMain) return <MainView />;
  return <LoadingView onComplete={() => setShowMain(true)} />;
}
