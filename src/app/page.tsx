"use client";

import { useState, useEffect } from "react";
import LoadingView from "@/views/loading";
import MainView from "@/views/main";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        try {
          window.Telegram.WebApp.requestFullscreen();
        } catch (e) {}
      }
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <LoadingView /> : <MainView />;
}
