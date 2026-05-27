"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Уменьшенный нативный свитчер в стиле Apple (58x28px)
const AppleSwitch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => (
  <button 
    onClick={onToggle} 
    className={`relative w-[58px] h-[28px] rounded-[14px] transition-colors duration-300 flex items-center px-[3px] ${
      isOn ? "bg-[#FC062D]" : "bg-[#39393d]"
    }`}
  >
    <motion.div 
      animate={{ x: isOn ? 24 : 0 }} 
      transition={{ type: "spring", stiffness: 500, damping: 30 }} 
      className="h-[22px] w-[22px] bg-white rounded-full shadow-md"
    />
  </button>
);

export default function SettingsView() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Состояния настроек
  const [animations, setAnimations] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  // Кастомный выбор стиля интерфейса ЙОУЙОУ
  const [currentStyle, setCurrentStyle] = useState("🫪 Зумерский");
  const [isStyleOpen, setIsStyleOpen] = useState(false);

  // Вызов вибрации (Haptic Feedback) с проверкой глобального тумблера
  const triggerHaptic = (type: "light" | "medium" | "selection") => {
    if (!vibration) return; // Если вибрация выключена юзером — игнорим
    if (typeof window !== "undefined") {
      const tgWebApp = (window as any).Telegram?.WebApp;
      if (tgWebApp?.HapticFeedback) {
        try {
          if (type === "selection") {
            tgWebApp.HapticFeedback.selectionChanged();
          } else {
            tgWebApp.HapticFeedback.impactOccurred(type);
          }
        } catch (e) {
          console.error("Haptic error:", e);
        }
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tgWebApp = (window as any).Telegram?.WebApp;
      
      // Имитируем небольшую загрузку (800мс), чтобы пользователь заценил сочный скелетон
      const timer = setTimeout(() => {
        if (tgWebApp?.initDataUnsafe?.user) {
          setUser(tgWebApp.initDataUnsafe.user);
        } else {
          // Локальный мок на случай тестов в обычном браузере вне Telegram
          setUser({
            first_name: "Йоу",
            last_name: "Инкогнито",
            username: "yoyou_creators",
            photo_url: null,
          });
        }
        setIsLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, []);

  const toggleSwitch = (setter: React.Dispatch<React.SetStateAction<boolean>>, currentValue: boolean) => {
    triggerHaptic("selection");
    setter(!currentValue);
  };

  return (
    <div className="w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300 px-5 pt-4 box-border overflow-y-auto select-none">
      <div className="flex flex-col space-y-6 w-full pb-10">
        
        {/* ЗАГОЛОВОК ЭКРАНА */}
        <h1 className="text-3xl font-extrabold tracking-tight text-appleLight-text dark:text-appleDark-text font-manrope">
          Настройки
        </h1>

        {/* ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ (РЕАЛЬНЫЕ ДАННЫЕ ИЛИ СКЕЛЕТОН) */}
        {isLoading ? (
          <div className="w-full p-4 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg/40 rounded-[28px] flex items-center animate-pulse box-border">
            {/* Круглый скелетон аватарки */}
            <div className="w-14 h-14 bg-neutral-300 dark:bg-neutral-800 rounded-full flex-shrink-0" />
            {/* Скелетоны строчек текста */}
            <div className="flex-1 ml-4 flex flex-col space-y-2">
              <div className="w-1/2 h-4 bg-neutral-300 dark:bg-neutral-800 rounded-sm" />
              <div className="w-1/3 h-3 bg-neutral-300 dark:bg-neutral-800 rounded-sm opacity-60" />
            </div>
          </div>
        ) : (
          <div className="w-full p-4 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] flex items-center box-border shadow-sm">
            {user?.photo_url ? (
              <img 
                src={user.photo_url} 
                alt="Avatar" 
                className="w-14 h-14 rounded-full object-cover border border-neutral-200 dark:border-neutral-800"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FC062D] to-[#ff415e] flex items-center justify-center text-white font-black text-xl font-manrope shadow-md shadow-red-500/20">
                {user?.first_name ? user.first_name[0].toUpperCase() : "Й"}
              </div>
            )}
            <div className="flex-1 ml-4 flex flex-col justify-center overflow-hidden">
              <span className="text-base font-bold text-appleLight-text dark:text-appleDark-text truncate">
                {user?.first_name} {user?.last_name || ""}
              </span>
              <span className="text-xs font-medium text-appleLight-text/40 dark:text-appleDark-text/45 truncate mt-0.5">
                {user?.username ? `@${user.username}` : "@без_юзернейма"}
              </span>
            </div>
          </div>
        )}

        {/* БЛОК СИСТЕМНЫХ НАСТРОЕК */}
        <div className="w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] overflow-hidden flex flex-col shadow-sm">
          {/* Кастомные анимации */}
          <div className="flex items-center justify-between px-5 h-[54px] border-b border-appleLight-text/5 dark:border-white/5 box-border">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Анимации интерфейса</span>
            <AppleSwitch isOn={animations} onToggle={() => toggleSwitch(setAnimations, animations)} />
          </div>

          {/* Виброотклик */}
          <div className="flex items-center justify-between px-5 h-[54px] border-b border-appleLight-text/5 dark:border-white/5 box-border">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Тактильный отклик (Haptic)</span>
            <AppleSwitch isOn={vibration} onToggle={() => toggleSwitch(setVibration, vibration)} />
          </div>

          {/* Уведомления */}
          <div className="flex items-center justify-between px-5 h-[54px] box-border">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Уведомления от ЙОУЙОУ</span>
            <AppleSwitch isOn={notifications} onToggle={() => toggleSwitch(setNotifications, notifications)} />
          </div>
        </div>

        {/* СТИЛЬ ИНТЕРФЕЙСА (Дропдаун) */}
        <div className="w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] overflow-hidden flex flex-col shadow-sm relative">
          <div 
            onClick={() => {
              triggerHaptic("selection");
              setIsStyleOpen(!isStyleOpen);
            }}
            className="flex items-center justify-between px-5 h-[54px] active:bg-appleLight-text/5 dark:active:bg-white/5 transition-colors cursor-pointer box-border"
          >
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Стиль приложения</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-normal text-[#FC062D]">{currentStyle}</span>
              <svg 
                className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isStyleOpen ? "rotate-180" : ""}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {isStyleOpen && (
            <div className="w-full border-t border-appleLight-text/5 dark:border-white/5 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg flex flex-col py-1 animate-fadeIn">
              {["🫪 Зумерский", "🏴‍☠️ Нефорский", "🪐 Минимализм"].map((styleOption) => (
                <div
                  key={styleOption}
                  onClick={() => {
                    triggerHaptic("light");
                    setCurrentStyle(styleOption);
                    setIsStyleOpen(false);
                  }}
                  className={`px-5 h-[44px] flex items-center justify-between text-sm cursor-pointer active:bg-appleLight-text/5 dark:active:bg-white/5 transition-colors ${
                    currentStyle === styleOption ? "text-[#FC062D] font-bold" : "text-appleLight-text dark:text-appleDark-text"
                  }`}
                >
                  <span>{styleOption}</span>
                  {currentStyle === styleOption && (
                    <svg className="w-4 h-4 text-[#FC062D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ИНФОРМАЦИОННЫЙ БЛОК */}
        <div className="w-full bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[28px] overflow-hidden flex flex-col shadow-sm">
          <div className="flex items-center justify-between px-5 h-[54px] border-b border-appleLight-text/5 dark:border-white/5">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Язык</span>
            <span className="text-sm font-normal text-appleLight-text/40 dark:text-appleDark-text/45">Русский</span>
          </div>
          <div className="flex items-center justify-between px-5 h-[54px]">
            <span className="text-sm font-medium text-appleLight-text dark:text-appleDark-text">Версия аппки</span>
            <span className="text-sm font-normal text-appleLight-text/40 dark:text-appleDark-text/45">1.0.0 (Beta)</span>
          </div>
        </div>

        {/* АВТОРСТВО */}
        <div className="mt-4 w-full flex justify-center text-center opacity-30 select-text">
          <span className="text-xs font-normal tracking-tight text-appleLight-text dark:text-appleDark-text">
            Сие творение создано с любовью для ЙОУЙОУ
          </span>
        </div>

      </div>
    </div>
  );
}
