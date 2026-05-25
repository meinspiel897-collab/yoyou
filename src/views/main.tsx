"use client";

import { useEffect } from "react";

export default function MainView() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      const theme = webApp.colorScheme || "dark";
      const bgColor = theme === "dark" ? "#000000" : "#FFFFFF";
      const textColor = theme === "dark" ? "#FFFFFF" : "#000000";
      
      webApp.setHeaderColor(bgColor);
      webApp.setBackgroundColor(bgColor);
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300">
      <header className="flex items-center justify-center w-full h-14 pt-[env(safe-area-inset-top)] bg-transparent">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold tracking-tight select-none">
            ЙОУЙОУ
          </h1>
          <img 
            src="/icons/logo.png" 
            alt="Logo" 
            className="w-6 h-6 object-contain"
          />
        </div>
      </header>
      
      <main className="flex-1 w-full overflow-hidden">
      </main>
    </div>
  );
}
