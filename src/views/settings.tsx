"use client";

import { useEffect, useState } from "react";

export default function SettingsView() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      const tgUser = anyWindow.Telegram?.WebApp?.initDataUnsafe?.user;
      if (tgUser) {
        setUser(tgUser);
      }
    }
  }, []);

  const getInitials = () => {
    if (!user) return "Ю";
    const first = user.first_name?.charAt(0) || "";
    const last = user.last_name?.charAt(0) || "";
    return (first + last).toUpperCase() || "Ю";
  };

  return (
    <div className="flex flex-col w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300">
      
      <header className="absolute top-[var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))] left-0 right-0 h-11 flex items-center justify-center z-50 pointer-events-none select-none">
        <div className="flex items-center space-x-2.5">
          <img src="/icons/settings.svg" alt="Настройки" className="w-5 h-5 object-contain" />
          <h1 className="text-base font-extrabold tracking-tight text-appleLight-text dark:text-appleDark-text" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Настройки
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] flex flex-col overflow-y-auto select-none px-5 box-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        
        <div className="mt-6 flex flex-col items-center w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] p-6 box-border shadow-sm border border-appleLight-text/[0.02] dark:border-white/[0.02]">
          {user?.photo_url ? (
            <img 
              src={user.photo_url} 
              alt="Аватар" 
              className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-neutral-800 shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FC062D] to-orange-500 flex items-center justify-center text-white text-2xl font-black shadow-md">
              {getInitials()}
            </div>
          )}
          
          <h2 className="mt-4 text-lg font-bold text-appleLight-text dark:text-appleDark-text tracking-tight">
            {user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "Пользователь ЙОУ"}
          </h2>
          
          <p className="mt-1 text-xs font-semibold text-appleLight-text/45 dark:text-appleDark-text/45">
            {user?.username ? `@${user.username}` : "@username"}
          </p>
        </div>

        <div className="mt-6 w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] overflow-hidden flex flex-col shadow-sm border border-appleLight-text/[0.02] dark:border-white/[0.02]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-appleLight-text/5 dark:border-white/5 active:bg-appleLight-text/5 dark:active:bg-white/5 transition-colors cursor-pointer">
            <span className="text-sm font-bold text-appleLight-text dark:text-appleDark-text">Уведомления</span>
            <span className="text-xs text-appleLight-text/35 dark:text-appleDark-text/35 font-semibold">Вкл.</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-appleLight-text/5 dark:border-white/5 active:bg-appleLight-text/5 dark:active:bg-white/5 transition-colors cursor-pointer">
            <span className="text-sm font-bold text-appleLight-text dark:text-appleDark-text">Язык</span>
            <span className="text-xs text-appleLight-text/35 dark:text-appleDark-text/35 font-semibold">Русский</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4 active:bg-appleLight-text/5 dark:active:bg-white/5 transition-colors cursor-pointer">
            <span className="text-sm font-bold text-appleLight-text dark:text-appleDark-text">Версия</span>
            <span className="text-xs text-appleLight-text/35 dark:text-appleDark-text/35 font-semibold">1.0.0</span>
          </div>
        </div>

      </main>
    </div>
  );
}
