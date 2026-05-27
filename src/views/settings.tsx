"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AppleSwitch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => (
  <button 
    onClick={onToggle} 
    className={`relative w-[58px] h-[28px] rounded-[14px] transition-colors duration-300 flex items-center px-[3px] ${
      isOn ? "bg-[#FC062D]" : "bg-[#39393d]"
    }`}
  >
    <motion.div 
      animate={{ x: isOn ? 17 : 0 }} 
      transition={{ type: "spring", stiffness: 500, damping: 35 }} 
      className="h-[22px] w-[35px] bg-white rounded-[10px] shadow-sm"
    />
  </button>
);

export default function SettingsView() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [animations, setAnimations] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  const [currentStyle, setCurrentStyle] = useState("🫪 Зумерский");
  const [isStyleOpen, setIsStyleOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      const tgWebApp = anyWindow.Telegram?.WebApp;
      
      const timer = setTimeout(() => {
        const tgUser = tgWebApp?.initDataUnsafe?.user;
        if (tgUser) {
          setUser({
            ...tgUser,
            stats: { ratings: 24, posts: 7, rewards: 3 }
          });
        } else {
          setUser({
            first_name: "Йоу",
            last_name: "Юзер",
            username: "yoyou_fan",
            photo_url: null,
            stats: { ratings: 12, posts: 3, rewards: 1 }
          });
        }
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
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
    <div className="flex flex-col w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300 overflow-hidden">
      
      <header className="absolute top-[var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))] left-0 right-0 h-11 flex items-center justify-center z-50 pointer-events-none select-none">
        <div className="flex items-center space-x-2.5">
          <img src="/icons/settings.png" alt="Настройки" className="w-5 h-5 object-contain" />
          <h1 className="text-base font-extrabold tracking-tight text-appleLight-text dark:text-appleDark-text" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Настройки
          </h1>
        </div>
      </header>

      <div className="pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] px-5 flex flex-col select-none flex-shrink-0 w-full box-border">
        
        <div className="mt-6 flex flex-col w-full relative">
          <div className="w-full h-28 bg-[#FC062D] rounded-[28px] relative flex items-center">
            <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
              <img 
                src="/icons/logo.png" 
                alt="" 
                className="absolute -left-0 -top-4 w-36 h-36 object-contain opacity-20 invert brightness-0 rotate-[-16deg]"
              />
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center z-10">
              {isLoading ? (
                <div className="w-24 h-24 rounded-full bg-neutral-300 dark:bg-neutral-800 border-4 border-appleLight-bg dark:border-appleDark-bg animate-pulse" />
              ) : user?.photo_url ? (
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

          <div className="mt-14 flex flex-col items-center w-full text-center">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-2 w-full animate-pulse">
                <div className="w-32 h-5 bg-neutral-300 dark:bg-neutral-800 rounded-sm" />
                <div className="w-20 h-3.5 bg-neutral-300 dark:bg-neutral-800 rounded-sm opacity-60" />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-appleLight-text dark:text-appleDark-text tracking-tight">
                  {user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "админ"}
                </h2>
                <p className="mt-0.5 text-sm font-medium text-appleLight-text/40 dark:text-appleDark-text/45 tracking-wide">
                  {user?.username ? `@${user.username}` : "@username"}
                </p>
              </>
            )}
          </div>

          <div className="mt-5 w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] py-3.5 flex justify-around items-center shadow-sm transition-colors duration-300">
            <div className="flex flex-col items-center justify-center flex-1">
              {isLoading ? (
                <div className="w-6 h-5 bg-neutral-300 dark:bg-neutral-800 rounded-sm animate-pulse" />
              ) : (
                <span className="text-lg font-extrabold text-appleLight-text dark:text-appleDark-text">
                  {user?.stats?.ratings ?? 0}
                </span>
              )}
              <span className="text-[10px] font-bold text-appleLight-text/40 dark:text-appleDark-text/45 uppercase tracking-wider mt-0.5">Оценки</span>
            </div>
            <div className="h-6 w-[1px] bg-appleLight-text/10 dark:bg-white/10" />
            <div className="flex flex-col items-center justify-center flex-1">
              {isLoading ? (
                <div className="w-6 h-5 bg-neutral-300 dark:bg-neutral-800 rounded-sm animate-pulse" />
              ) : (
                <span className="text-lg font-extrabold text-appleLight-text dark:text-appleDark-text">
                  {user?.stats?.posts ?? 0}
                </span>
              )}
              <span className="text-[10px] font-bold text-appleLight-text/40 dark:text-appleDark-text/45 uppercase tracking-wider mt-0.5">Посты</span>
            </div>
            <div className="h-6 w-[1px] bg-appleLight-text/10 dark:bg-white/10" />
            <div className="flex flex-col items-center justify-center flex-1">
              {isLoading ? (
                <div className="w-6 h-5 bg-neutral-300 dark:bg-neutral-800 rounded-sm animate-pulse" />
              ) : (
                <span className="text-lg font-extrabold text-appleLight-text dark:text-appleDark-text">
                  {user?.stats?.rewards ?? 0}
                </span>
              )}
              <span className="text-[10px] font-bold text-appleLight-text/40 dark:text-appleDark-text/45 uppercase tracking-wider mt-0.5">Награды</span>
            </div>
          </div>
        </div>

      </div>

      <main className="flex-1 w-full overflow-y-auto select-none px-5 pb-16 mt-4 box-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        
        <div className="w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] overflow-hidden flex flex-col shadow-sm">
          
          <div 
            onClick={() => setIsStyleOpen(!isStyleOpen)}
            className="flex items-center justify-between px-5 h-[54px] active:bg-appleLight-text/5 dark:active:bg-white/5 transition-colors cursor-pointer select-none"
          >
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Стиль приложения</span>
            <span className="text-sm font-normal text-appleLight-text/40 dark:text-appleDark-text/45">{currentStyle}</span>
          </div>

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
                  transition: { height: { duration: 0.2, ease: "easeInOut" }, opacity: { duration: 0.1 } }
                }}
                className="overflow-hidden"
              >
                <div className="mx-3 mb-3 p-1.5 bg-appleLight-text/[0.04] dark:bg-white/[0.04] rounded-[24px] flex flex-col gap-1 box-border">
                  {["🫪 Зумерский", "👔 Официальный", "🕷️ Нефорский"].map((style) => (
                    <button
                      key={style}
                      onClick={() => { setCurrentStyle(style); setIsStyleOpen(false); }}
                      className="relative w-full h-10 px-4 flex items-center rounded-full transition-all active:scale-[0.99] text-left"
                    >
                      {currentStyle === style && (
                        <motion.div 
                          layoutId="activeStyleBg"
                          className="absolute inset-0 bg-appleLight-text/5 dark:bg-white/5 rounded-full"
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

          <div className="flex items-center justify-between px-5 h-[54px]">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Анимации</span>
            <AppleSwitch isOn={animations} onToggle={() => setAnimations(!animations)} />
          </div>
        </div>

        <div className="mt-4 w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] overflow-hidden flex flex-col shadow-sm">
          <div className="flex items-center justify-between px-5 h-[54px]">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Уведомления</span>
            <AppleSwitch isOn={notifications} onToggle={() => setNotifications(!notifications)} />
          </div>
          <div className="flex items-center justify-between px-5 h-[54px]">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Вибрация</span>
            <AppleSwitch isOn={vibration} onToggle={handleVibrationToggle} />
          </div>
        </div>

        <div className="mt-4 w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] overflow-hidden flex flex-col shadow-sm">
          <div className="flex items-center justify-between px-5 h-[54px] active:bg-appleLight-text/5 dark:active:bg-white/5 transition-colors cursor-pointer">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Язык</span>
            <span className="text-sm font-normal text-appleLight-text/40 dark:text-appleDark-text/45">Русский</span>
          </div>
          <div className="flex items-center justify-between px-5 h-[54px]">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Версия</span>
            <span className="text-sm font-normal text-appleLight-text/40 dark:text-appleDark-text/45">1.0.0</span>
          </div>
        </div>

        <div className="mt-8 w-full flex justify-center text-center opacity-25 select-text">
          <span className="text-xs font-normal tracking-tight text-appleLight-text dark:text-appleDark-text">
            Сие творение создано{" "}
            <a 
              href="https://t.me/temkazavr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-medium underline cursor-pointer transition-all text-appleLight-text dark:text-white"
            >
              @temkazavr
            </a>
          </span>
        </div>

      </main>
    </div>
  );
}
