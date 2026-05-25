"use client";

import { useEffect } from "react";

export default function MainView() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      const theme = webApp.colorScheme || "dark";
      const bgColor = theme === "dark" ? "#000000" : "#FFFFFF";
      
      webApp.setHeaderColor(bgColor);
      webApp.setBackgroundColor(bgColor);
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300">
      <header className="flex items-center justify-center w-full pt-[env(safe-area-inset-top)] bg-transparent select-none">
        <div className="flex items-center justify-center gap-1.5 h-12 w-full">
          <img 
            src="/icons/logo.png" 
            alt="Logo" 
            className="w-5 h-5 object-contain"
          />
          <h1 className="text-xl font-extrabold tracking-tight">
            ЙОУЙОУ
          </h1>
        </div>
      </header>
      
      <main className="flex-1 w-full overflow-hidden">
      </main>
    </div>
  );
}
