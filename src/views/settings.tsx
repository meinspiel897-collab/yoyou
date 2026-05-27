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
    if (!user) return "A";
    const first = user.first_name?.charAt(0) || "";
    const last = user.last_name?.charAt(0) || "";
    return (first + last).toUpperCase() || "A";
  };

  return (
    <div className="flex flex-col w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300">
      
      {/* Шапка */}
      <header className="absolute top-[var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))] left-0 right-0 h-11 flex items-center justify-center z-50 pointer-events-none select-none">
        <div className="flex items-center space-x-2.5">
          <img src="/icons/settings.png" alt="Настройки" className="w-5 h-5 object-contain" />
          <h1 className="text-base font-extrabold tracking-tight text-appleLight-text dark:text-appleDark-text" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Настройки
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] flex flex-col overflow-y-auto select-none px-5 box-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Блок профиля */}
        <div className="mt-6 flex flex-col w-full relative select-none">
          
          {/* Верхняя акцентная плашка */}
          <div className="w-full h-28 bg-[#FC062D] rounded-[28px] relative flex items-center">
            
            {/* Контейнер маски для логотипа, чтобы он аккуратно обрезался внутри баннера */}
            <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
              <img 
                src="/icons/logo.png" 
                alt="" 
                className="absolute -left-8 -top-6 w-40 h-40 object-contain opacity-20 invert brightness-0 rotate-[-16deg]"
              />
            </div>

            {/* Круг аватарки: Строго по центру оси X, наполовину утоплен вниз */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center z-10">
              {user?.photo_url ? (
                <img 
                  src={user.photo_url} 
                  alt="Аватар" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-appleLight-bg dark:border-appleDark-bg shadow-md transition-colors duration-300"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#75df77] flex items-center justify-center text-white text-4xl font-normal border-4 border-appleLight-bg dark:border-appleDark-bg shadow-md transition-colors duration-300">
                  {getInitials()}
                </div>
              )}
            </div>

          </div>

          {/* Блок с именем и юзернеймом по центру на основном фоне */}
          <div className="mt-14 flex flex-col items-center w-full text-center">
            <h2 className="text-xl font-bold text-appleLight-text dark:text-appleDark-text tracking-tight">
              {user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "админ"}
            </h2>
            
            <p className="mt-0.5 text-sm font-medium text-appleLight-text/40 dark:text-appleDark-text/45 tracking-wide">
              {user?.username ? `@${user.username}` : "@username"}
            </p>
          </div>

          {/* Объединенная единая плашка статистики (Компактная, без внешних контуров) */}
          <div className="mt-5 w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] py-3.5 flex justify-around items-center shadow-sm transition-colors duration-300">
            
            {/* Оценки */}
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="text-lg font-extrabold text-appleLight-text dark:text-appleDark-text">0</span>
              <span className="text-[10px] font-bold text-appleLight-text/40 dark:text-appleDark-text/45 uppercase tracking-wider mt-0.5">Оценки</span>
            </div>

            {/* Мягкий внутренний разделитель */}
            <div className="h-6 w-[1px] bg-appleLight-text/10 dark:bg-white/10" />

            {/* Посты */}
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="text-lg font-extrabold text-appleLight-text dark:text-appleDark-text">0</span>
              <span className="text-[10px] font-bold text-appleLight-text/40 dark:text-appleDark-text/45 uppercase tracking-wider mt-0.5">Посты</span>
            </div>

            {/* Мягкий внутренний разделитель */}
            <div className="h-6 w-[1px] bg-appleLight-text/10 dark:bg-white/10" />

            {/* Награды */}
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="text-lg font-extrabold text-appleLight-text dark:text-appleDark-text">0</span>
              <span className="text-[10px] font-bold text-appleLight-text/40 dark:text-appleDark-text/45 uppercase tracking-wider mt-0.5">Награды</span>
            </div>

          </div>

        </div>

        {/* Меню настроек */}
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
