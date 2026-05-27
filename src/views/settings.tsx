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

  // Функция генерации 3-х четких концентрических окружностей
  const renderCircularIcons = () => {
    const orbits = [
      { radius: 75, size: 19, maxOpacity: 0.28 },  // 1-й круг: аккуратный отступ от авы
      { radius: 135, size: 17, maxOpacity: 0.12 }, // 2-й круг: далеко, с ощутимым расстоянием
      { radius: 195, size: 14, maxOpacity: 0.02 }, // 3-й круг: на грани видимости, почти исчез
    ];

    const ICONS_PER_ORBIT = 9;

    return orbits.flatMap((orbit, orbitIdx) => {
      const icons = [];

      for (let i = 0; i < ICONS_PER_ORBIT; i++) {
        // Строгое деление на 9 без каких-либо смещений между кругами
        const angle = (i * 360) / ICONS_PER_ORBIT;
        const radians = (angle * Math.PI) / 180;

        const x = Math.cos(radians) * orbit.radius;
        const y = Math.sin(radians) * orbit.radius;

        icons.push(
          <img
            key={`icon-${orbitIdx}-${i}`}
            src="/icons/logo.png"
            alt=""
            className="absolute left-1/2 top-1/2 object-contain pointer-events-none select-none filter grayscale brightness-50 contrast-120"
            style={{
              width: `${orbit.size}px`,
              height: `${orbit.size}px`,
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`, // Идеально ровное положение
              opacity: orbit.maxOpacity,
            }}
          />
        );
      }
      return icons;
    });
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
        <div className="mt-6 flex flex-col items-center w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] p-8 box-border relative overflow-hidden min-h-[250px] justify-center shadow-sm border border-appleLight-text/[0.02] dark:border-white/[0.02]">
          
          {/* Контент */}
          <div className="relative z-10 flex flex-col items-center w-full">
            
            {/* Контейнер аватарки с концентрическим узором вокруг */}
            <div className="relative w-24 h-24 flex items-center justify-center select-none">
              
              {/* Геометрический узор из 3-х кругов */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {renderCircularIcons()}
              </div>

              {/* Аватарка */}
              {user?.photo_url ? (
                <img 
                  src={user.photo_url} 
                  alt="Аватар" 
                  className="w-24 h-24 rounded-full object-cover border border-white/5 shadow-xl relative z-10"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#75df77] flex items-center justify-center text-white text-4xl font-normal shadow-lg relative z-10">
                  {getInitials()}
                </div>
              )}
            </div>
            
            {/* Имя */}
            <h2 className="mt-5 text-2xl font-semibold text-appleLight-text dark:text-appleDark-text tracking-tight relative z-10">
              {user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "админ"}
            </h2>
            
            {/* Подпись / Юзернейм */}
            <p className="mt-1.5 text-sm font-medium text-appleLight-text/40 dark:text-appleDark-text/45 tracking-wide relative z-10">
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
