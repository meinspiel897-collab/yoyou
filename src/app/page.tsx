"use client";

import { useState, useEffect } from "react";
import LoadingView from "@/views/loading";
import MainView from "@/views/main";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasLoaded = sessionStorage.getItem("yoyou_loaded");
      
      const enterFullscreen = () => {
        if (window.Telegram?.WebApp) {
          try {
            window.Telegram.WebApp.requestFullscreen();
          } catch (e) {}
        }
      };

      if (hasLoaded) {
        setIsLoading(false);
        setTimeout(enterFullscreen, 100);
      } else {
        const timer = setTimeout(() => {
          sessionStorage.setItem("yoyou_loaded", "true");
          setIsLoading(false);
          setTimeout(enterFullscreen, 50);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  return isLoading ? <LoadingView /> : <MainView />;
}
