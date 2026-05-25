"use client";

import { useEffect } from "react";

export default function LoadingView() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.setHeaderColor("#FC062D");
      webApp.setBackgroundColor("#FC062D");
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#FC062D] w-full h-full select-none">
      <img 
        src="/icons/logo.png" 
        alt="Logo" 
        className="w-24 h-24 object-contain animate-pulse"
      />
    </div>
  );
}
