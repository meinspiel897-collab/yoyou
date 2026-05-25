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
      setTimeout(() => {
        try {
          const tg = (window as any).Telegram?.WebApp;
          if (tg && typeof tg.requestFullscreen === "function") {
            tg.requestFullscreen();
          }
        } catch (e) {
          console.error("Failed to go fullscreen:", e);
        }
      }, 50);
    }
  }, [showMain]);

  if (showMain) return <MainView />;
  return <LoadingView onComplete={() => setShowMain(true)} />;
}
