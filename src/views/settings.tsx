"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Твой оригинальный свитчер со скругленной прямоугольной плашкой, уменьшенный до 48x28px
const AppleSwitch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => (
  <button 
    onClick={onToggle} 
    className={`relative w-[48px] h-[28px] rounded-[14px] transition-colors duration-300 flex items-center px-[3px] ${
      isOn ? "bg-[#FC062D]" : "bg-[#39393d]"
    }`}
  >
    <motion.div 
      animate={{ x: isOn ? 12 : 0 }} 
      transition={{ type: "spring", stiffness: 500, damping: 35 }} 
      className="h-[22px] w-[30px] bg-white rounded-[10px] shadow-sm"
    />
  </button>
);

export default function SettingsView() {
  const [user, setUser] = useState<any>(null);
  
  // Состояния тумблеров
  const [animations, setAnimations] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  // Выбор стиля
  const [currentStyle, setCurrentStyle] = useState("🫪 Зумерский");
  const [isStyleOpen, setIsStyleOpen] = useState(false);

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

  const handleVibrationToggle = () => {
    const nextState = !vibration;
    setVibration(nextState);
    
    const tg = (window as any).Telegram?.WebApp;
    if (nextState && tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred("light");
    }
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

      {/* Контейнер с невидимым скроллбаром и увеличенным pb-24, чтобы ничего не застревало внизу */}
      <main className="flex-1 w-full pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] flex flex-col overflow-y-auto select-none px-5 pb-24 box-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Блок профиля */}
        <div className="mt-6 flex flex-col w-full relative select-none flex-shrink-0">
          
          {/* Верхняя акцентная плашка */}
          <div className="w-full h-28 bg-[#FC062D] rounded-[28px] relative flex items-center">
            <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
              <img 
                src="/icons/logo.png" 
                alt="" 
                className="absolute -left-0 -top-4 w-36 h-36 object-contain opacity-20 invert brightness-0 rotate-[-16deg]"
              />
            </div>

            {/* Аватарка */}
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

          {/* Блок с именем */}
          <div className="mt-14 flex flex-col items-center w-full text-center">
            <h2 className="text-xl font-bold text-appleLight-text dark:text-appleDark-text tracking-tight">
              {user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "админ"}
            </h2>
            <p className="mt-0.5 text-sm font-medium text-appleLight-text/40 dark:text-appleDark-text/45 tracking-wide">
              {user?.username ? `@${user.username}` : "@username"}
            </p>
          </div>

          {/* Статистика */}
          <div className="mt-5 w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] py-3.5 flex justify-around items-center shadow-sm transition-colors duration-300">
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="text-lg font-extrabold text-appleLight-text dark:text-appleDark-text">0</span>
              <span className="text-[10px] font-bold text-appleLight-text/40 dark:text-appleDark-text/45 uppercase tracking-wider mt-0.5">Оценки</span>
            </div>
            <div className="h-6 w-[1px] bg-appleLight-text/10 dark:bg-white/10" />
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="text-lg font-extrabold text-appleLight-text dark:text-appleDark-text">0</span>
              <span className="text-[10px] font-bold text-appleLight-text/40 dark:text-appleDark-text/45 uppercase tracking-wider mt-0.5">Посты</span>
            </div>
            <div className="h-6 w-[1px] bg-appleLight-text/10 dark:bg-white/10" />
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="text-lg font-extrabold text-appleLight-text dark:text-appleDark-text">0</span>
              <span className="text-[10px] font-bold text-appleLight-text/40 dark:text-appleDark-text/45 uppercase tracking-wider mt-0.5">Награды</span>
            </div>
          </div>

        </div>

        {/* ================= БЛОКИ НАСТРОЕК ================= */}

        {/* БЛОК 1: Кастомизация */}
        <div className="mt-6 w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] overflow-hidden flex flex-col shadow-sm flex-shrink-0">
          
          {/* Кнопка выбора стиля (Чистый шрифт, без шевронов) */}
          <div 
            onClick={() => setIsStyleOpen(!isStyleOpen)}
            className="flex items-center justify-between px-5 h-[54px] active:bg-appleLight-text/5 dark:active:bg-white/5 transition-colors cursor-pointer select-none"
          >
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Стиль приложения</span>
            <span className="text-sm font-normal text-appleLight-text/40 dark:text-appleDark-text/45">{currentStyle}</span>
          </div>

          {/* Плавный выпадающий список в выделенной подсвеченной плашке */}
          <AnimatePresence initial={false}>
            {isStyleOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: "auto", 
                  opacity: 1,
                  transition: { height: { type: "spring", stiffness: 450, damping: 40 }, opacity: { duration: 0.15 } }
                }}
                exit={{ 
                  height: 0, 
                  opacity: 0,
                  transition: { height: { duration: 0.25, ease: "easeInOut" }, opacity: { duration: 0.1 } }
                }}
                className="overflow-hidden"
              >
                {/* Подсвеченный внутренний блок с круглыми углами */}
                <div className="mx-3 mb-3 p-1.5 bg-appleLight-text/[0.03] dark:bg-white/[0.03] rounded-2xl flex flex-col gap-0.5 box-border">
                  {["🫪 Зумерский", "👔 Официальный", "🕷️ Нефорский"].map((style) => (
                    <button
                      key={style}
                      onClick={() => { setCurrentStyle(style); setIsStyleOpen(false); }}
                      className="relative w-full h-10 px-4 flex items-center rounded-xl transition-all active:scale-[0.99] text-left"
                    >
                      {currentStyle === style && (
                        <motion.div 
                          layoutId="activeStyleBg"
                          className="absolute inset-0 bg-appleLight-text/5 dark:bg-white/5 rounded-xl"
                        />
                      )}
                      <span className={`relative z-10 text-sm ${currentStyle === style ? "font-medium text-appleLight-text dark:text-white" : "font-normal text-appleLight-text/30 dark:text-white/20"}`}>
                        {style}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Анимации */}
          <div className="flex items-center justify-between px-5 h-[54px]">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Анимации</span>
            <AppleSwitch isOn={animations} onToggle={() => setAnimations(!animations)} />
          </div>
        </div>

        {/* БЛОК 2: Взаимодействие */}
        <div className="mt-4 w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] overflow-hidden flex flex-col shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between px-5 h-[54px]">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Уведомления</span>
            <AppleSwitch isOn={notifications} onToggle={() => setNotifications(!notifications)} />
          </div>
          <div className="flex items-center justify-between px-5 h-[54px]">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Вибрация (Haptic)</span>
            <AppleSwitch isOn={vibration} onToggle={handleVibrationToggle} />
          </div>
        </div>

        {/* БЛОК 3: Система */}
        <div className="mt-4 w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] overflow-hidden flex flex-col shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between px-5 h-[54px] active:bg-appleLight-text/5 dark:active:bg-white/5 transition-colors cursor-pointer">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Язык</span>
            <span className="text-sm font-normal text-appleLight-text/40 dark:text-appleDark-text/45">Русский</span>
          </div>
          <div className="flex items-center justify-between px-5 h-[54px]">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Версия</span>
            <span className="text-sm font-normal text-appleLight-text/40 dark:text-appleDark-text/45">1.0.0</span>
          </div>
        </div>

      </main>
    </div>
  );
}
