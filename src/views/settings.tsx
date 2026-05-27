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
        
        {/* Блок профиля с кастомным паттерном и радиальным свечением */}
        <div 
          className="mt-6 flex flex-col items-center w-full rounded-[28px] p-8 box-border relative overflow-hidden min-h-[240px] justify-center"
          style={{
            // Основной фон плашки в цвет темы, чтобы сливался, как на скрине
            backgroundColor: "var(--tg-theme-bg-color, #1c1c1e)",
          }}
        >
          {/* ТЕКСТУРА: Идеальная диагональная сетка из ракет (SVG inline) */}
          <div 
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg transform='rotate(-45 30 30)'%3E%3Cpath d='M30,15 C33,15 35,18 35,22 C35,23 34.5,25 34,26 L36,31 L32,30 L30,34 L28,30 L24,31 L26,26 C25.5,25 25,23 25,22 C25,18 27,15 30,15 Z' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "44px 44px",
            }}
          />

          {/* СВЕЧЕНИЕ: Мягкий акцентный радиальный градиент в центре */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(252,6,45,0.12)_0%,rgba(252,6,45,0.02)_50%,transparent_80%)] pointer-events-none z-0" />

          {/* КОНТЕНТ (над паттерном) */}
          <div className="relative z-10 flex flex-col items-center w-full">
            
            {/* Аватарка (Зеленая по дефолту, прямо как на скрине админа) */}
            {user?.photo_url ? (
              <img 
                src={user.photo_url} 
                alt="Аватар" 
                className="w-24 h-24 rounded-full object-cover border-2 border-white/10 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#75df77] flex items-center justify-center text-white text-4xl font-normal shadow-lg select-none">
                {getInitials()}
              </div>
            )}
            
            {/* Имя пользователя / Админ */}
            <h2 className="mt-5 text-2xl font-semibold text-appleLight-text dark:text-appleDark-text tracking-tight flex items-center justify-center gap-1.5">
              {user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "админ"}
              <span className="text-xl font-light opacity-40">·</span>
              <span className="text-xl font-normal opacity-90">1 level</span>
            </h2>
            
            {/* Баланс / Подзаголовок */}
            <p className="mt-2 text-sm font-medium text-appleLight-text/40 dark:text-appleDark-text/45 tracking-wide">
              {user?.username ? `@${user.username}` : "0 / 10 TON"}
            </p>
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
