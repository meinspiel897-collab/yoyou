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
      
      {/* Шапка с новой .png иконкой */}
      <header className="absolute top-[var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))] left-0 right-0 h-11 flex items-center justify-center z-50 pointer-events-none select-none">
        <div className="flex items-center space-x-2.5">
          <img src="/icons/settings.png" alt="Настройки" className="w-5 h-5 object-contain" />
          <h1 className="text-base font-extrabold tracking-tight text-appleLight-text dark:text-appleDark-text" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Настройки
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] flex flex-col overflow-y-auto select-none px-5 box-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Карточка профиля с кастомным арт-фоном */}
        <div className="mt-6 flex flex-col items-center w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] p-6 box-border shadow-sm border border-appleLight-text/[0.02] dark:border-white/[0.02] relative overflow-hidden">
          
          {/* ЭФФЕКТЫ НА ФОНЕ */}
          {/* 1. Большой круговой радиальный градиент, затухающий к краям плашки */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(252,6,45,0.18)_0%,rgba(252,6,45,0.05)_45%,transparent_75%)] pointer-events-none z-0" />
          
          {/* 2. Разлетающиеся под наклоном акцентные логотипы (чем ближе к центру — тем прозрачнее) */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-80 mix-blend-screen dark:mix-blend-normal">
            {/* Топовый правый сектор (дальше от центра -> плотнее, прозрачность 0.5) */}
            <img 
              src="/icons/logo.png" 
              alt="" 
              className="absolute top-[12%] right-[15%] w-7 h-7 object-contain opacity-50 rotate-[14deg] filter grayscale contrast-200 sepia hue-rotate-[320deg] saturate-[5]" 
            />
            {/* Средний правый сектор (ближе к центру -> прозрачность 0.35) */}
            <img 
              src="/icons/logo.png" 
              alt="" 
              className="absolute top-[42%] right-[22%] w-6 h-6 object-contain opacity-35 rotate-[-12deg] filter grayscale contrast-200 sepia hue-rotate-[320deg] saturate-[5]" 
            />
            {/* Нижний правый сектор (далеко -> прозрачность 0.45) */}
            <img 
              src="/icons/logo.png" 
              alt="" 
              className="absolute bottom-[14%] right-[18%] w-6.5 h-6.5 object-contain opacity-45 rotate-[22deg] filter grayscale contrast-200 sepia hue-rotate-[320deg] saturate-[5]" 
            />
            
            {/* Топовый левый сектор (среднее расстояние -> прозрачность 0.4) */}
            <img 
              src="/icons/logo.png" 
              alt="" 
              className="absolute top-[18%] left-[16%] w-6.5 h-6.5 object-contain opacity-40 rotate-[-18deg] filter grayscale contrast-200 sepia hue-rotate-[320deg] saturate-[5]" 
            />
            {/* Близкий левый сектор (совсем близко к центру -> прозрачность 0.2) */}
            <img 
              src="/icons/logo.png" 
              alt="" 
              className="absolute top-[52%] left-[24%] w-5.5 h-5.5 object-contain opacity-20 rotate-[8deg] filter grayscale contrast-200 sepia hue-rotate-[320deg] saturate-[5]" 
            />
            {/* Нижний левый сектор (далеко -> прозрачность 0.5) */}
            <img 
              src="/icons/logo.png" 
              alt="" 
              className="absolute bottom-[12%] left-[14%] w-7 h-7 object-contain opacity-50 rotate-[-25deg] filter grayscale contrast-200 sepia hue-rotate-[320deg] saturate-[5]" 
            />
          </div>

          {/* КОНТЕНТ ПРОФИЛЯ */}
          <div className="relative z-10 flex flex-col items-center">
            {user?.photo_url ? (
              <img 
                src={user.photo_url} 
                alt="Аватар" 
                className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-neutral-800 shadow-md relative z-10"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FC062D] to-orange-500 flex items-center justify-center text-white text-2xl font-black shadow-md relative z-10">
                {getInitials()}
              </div>
            )}
            
            <h2 className="mt-4 text-lg font-bold text-appleLight-text dark:text-appleDark-text tracking-tight drop-shadow-sm">
              {user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "Пользователь ЙОУ"}
            </h2>
            
            <p className="mt-1 text-xs font-semibold text-appleLight-text/50 dark:text-appleDark-text/50 backdrop-blur-[1px] px-2 py-0.5 rounded-md">
              {user?.username ? `@${user.username}` : "@username"}
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
