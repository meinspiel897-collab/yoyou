"use client";

import { useState, useEffect } from "react";
import LoadingView from "@/views/loading";
import OnboardingView from "@/views/onboarding";
import MainView from "@/views/main";

export default function Home() {
  const [appState, setAppState] = useState<"loading" | "onboarding" | "loading-final" | "main">("loading");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasLoaded = sessionStorage.getItem("yoyou_fully_loaded");
      
      const triggerFullscreen = () => {
        if (window.Telegram?.WebApp) {
          try {
            window.Telegram.WebApp.requestFullscreen();
          } catch (e) {}
        }
      };

      if (hasLoaded) {
        setAppState("main");
        setTimeout(triggerFullscreen, 50);
      } else {
        const timer = setTimeout(() => {
          setAppState("onboarding");
          setTimeout(triggerFullscreen, 50);
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleOnboardingComplete = () => {
    setAppState("loading-final");
    setTimeout(() => {
      sessionStorage.setItem("yoyou_fully_loaded", "true");
      setAppState("main");
    }, 2000);
  };

  if (appState === "loading") return <LoadingView />;
  if (appState === "onboarding") return <OnboardingView onComplete={handleOnboardingComplete} />;
  if (appState === "loading-final") return <LoadingView />;
  return <MainView />;
}
