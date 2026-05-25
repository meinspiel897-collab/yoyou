"use client";

import { useState, useEffect } from "react";

interface LoadingViewProps {
  onComplete: () => void;
}

type Stage = "pure-loading" | "style-select" | "anim-select" | "final-loading";

export default function LoadingView({ onComplete }: LoadingViewProps) {
  const [stage, setStage] = useState<Stage>("pure-loading");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedAnim, setSelectedAnim] = useState<string | null>(null);

  const triggerHaptic = (style: "light" | "medium" | "heavy" | "rigid" | "soft") => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try {
          anyWindow.Telegram.WebApp.HapticFeedback.impactOccurred(style);
        } catch (e) {}
      }
    }
  };

  // Нативная кнопка "Назад"
  useEffect(() => {
    if (typeof window !== "undefined") {
      const webApp = (window as any).Telegram?.WebApp;
      if (webApp?.BackButton) {
        const backButton = webApp.BackButton;
        if (stage === "anim-select") {
          backButton.show();
          const handleBack = () => {
            triggerHaptic("light");
            setStage("style-select");
          };
          backButton.onClick(handleBack);
          return () => {
            backButton.offClick(handleBack);
            backButton.hide();
          };
        } else {
          backButton.hide();
        }
      }
    }
  }, [stage]);

  // Цвета темы Telegram
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      if (stage === "pure-loading" || stage === "final-loading") {
        webApp.setHeaderColor("#FC062D");
        webApp.setBackgroundColor("#FC062D");
      } else {
        const theme = webApp.colorScheme || "dark";
        const bgColor = theme === "dark" ? "#0A0A0C" : "#F4F4F7";
        webApp.setHeaderColor("#FC062D");
        webApp.setBackgroundColor(bgColor);
      }
    }
  }, [stage]);

  // Первая загрузка
  useEffect(() => {
    if (stage === "pure-loading") {
      const timer = setTimeout(() => {
        setStage("style-select");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleSelectStyle = (id: string) => {
    triggerHaptic("light");
    setSelectedStyle(id);
  };

  const handleSelectAnim = (id: string) => {
    triggerHaptic("light");
    setSelectedAnim(id);
  };

  const handleNextStep = () => {
    triggerHaptic("medium");
    setStage("anim-select");
  };

  const handleFinish = () => {
    if (selectedAnim) {
      setStage("final-loading");
      setTimeout(() => {
        sessionStorage.setItem("yoyou_fully_loaded", "true");
        onComplete();
      }, 3000);
    }
  };

  const isFullRed = stage === "pure-loading" || stage === "final-loading";

  return (
    <div className="w-full h-full flex flex-col bg-[#F4F4F7] dark:bg-[#0A0A0C] overflow-hidden relative select-none font-sans antialiased">
      
      {/* КРАСНОЕ ПРОСТРАНСТВО (МЯГКИЙ IOS-СФЕРИЧЕСКИЙ БЭКГРАУНД) */}
      <div 
        className="w-full bg-[#FC062D] relative flex box-border z-[99] overflow-hidden justify-center items-center"
        style={{
          height: isFullRed ? "100%" : "22%",
          minHeight: isFullRed ? "100%" : "140px",
          borderRadius: isFullRed ? "0px" : "0px 0px 32px 32px", // Элегантное скругление снизу в сжатом режиме
          boxShadow: isFullRed ? "none" : "0 10px 30px rgba(252, 6, 45, 0.15)",
          transition: "all 500ms cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Пульсация на загрузке */}
        <div 
          className="absolute inset-0 bg-[#FC062D] transition-opacity duration-300 ease-in-out pointer-events-none"
          style={{
            opacity: isFullRed ? 1 : 0,
            animation: isFullRed ? "ios-pulse 2.5s infinite ease-in-out" : "none"
          }}
        />

        {/* СВЯЗКА ЛОГО + ТЕКСТ: ИДЕАЛЬНЫЙ АБСОЛЮТНЫЙ ЦЕНТР */}
        <div className="w-full max-w-[342px] px-4 h-14 relative flex items-center justify-center">
          
          {/* Контейнер сборки: если экран полный — он сжат до размера лого, если нет — расширяется */}
          <div 
            className="flex items-center transition-all duration-[500ms] cubic-bezier(0.16, 1, 0.3, 1) relative"
            style={{
              width: isFullRed ? "54px" : "100%",
              justifyContent: isFullRed ? "center" : "flex-start"
            }}
          >
            {/* ЕДИНЫЙ ЛОГОТИП ГЛАЗОК */}
            <div
              className="transition-all duration-[500ms] cubic-bezier(0.16, 1, 0.3, 1) z-20 shrink-0"
              style={{
                width: isFullRed ? "54px" : "44px",
                height: isFullRed ? "54px" : "44px",
                transform: isFullRed ? "scale(1.1)" : "scale(1)"
              }}
            >
              <img src="/icons/logo.png" alt="Logo" className="w-full h-full object-contain block" />
            </div>
            
            {/* Блок с текстом вопросов */}
            <div 
              className="relative overflow-hidden flex-1"
              style={{
                height: "44px",
                marginLeft: isFullRed ? "0px" : "14px",
                opacity: isFullRed ? 0 : 1,
                visibility: isFullRed ? "hidden" : "visible",
                transition: "opacity 150ms ease, visibility 150ms ease"
              }}
            >
              <div 
                className="absolute inset-y-0 left-0 right-0 flex items-center"
                style={{
                  transform: stage === "style-select" ? "translateY(0)" : "translateY(-130%)",
                  opacity: stage === "style-select" ? 1 : 0,
                  transition: "all 450ms cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              >
                <h2 className="text-white text-[15px] font-bold leading-tight tracking-tight text-left">
                  Выбери стиль, который тебе больше всего нравится
                </h2>
              </div>
              <div 
                className="absolute inset-y-0 left-0 right-0 flex items-center"
                style={{
                  transform: stage === "anim-select" ? "translateY(0)" : "translateY(130%)",
                  opacity: stage === "anim-select" ? 1 : 0,
                  transition: "all 450ms cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              >
                <h2 className="text-white text-[15px] font-bold leading-tight tracking-tight text-left">
                  Хочешь включить анимации?
                </h2>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* НИЖНЯЯ ЧАСТЬ С КОНТЕНТОМ И КНОПКАМИ */}
      {!isFullRed && (
        <div className="flex-1 w-full flex flex-col justify-between pt-6 pb-10 px-6 box-border">
          
          {/* КОНТЕНТ СЛАЙДЕРОВ */}
          <div className="w-full max-w-[342px] mx-auto flex flex-col justify-center relative overflow-hidden flex-1">
            
            {/* ЭТАП 1: ВЫБОР СТИЛЯ */}
            <div 
              className="w-full flex flex-col space-y-3.5 absolute inset-x-0"
              style={{
                transform: stage === "style-select" ? "translateY(0)" : "translateY(140%)",
                opacity: stage === "style-select" ? 1 : 0,
                pointerEvents: stage === "style-select" ? "auto" : "none",
                transition: "all 550ms cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {[
                { id: "zoomer", emoji: "🫪", name: "Зумерский", desc: "оч популярный вариант, классный вайб" },
                { id: "official", emoji: "👔", name: "Официальный", desc: "ох уж эти миллениалы" },
                { id: "nefor", emoji: "🕷️", name: "Нефорский", desc: "ее, шаришь за это? я нет, но сделаю вид, что в теме!" }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectStyle(item.id)}
                  className={`w-full p-4.5 flex items-center justify-between border rounded-[22px] backdrop-blur-md transition-all duration-200 ${
                    selectedStyle === item.id 
                      ? "border-[#FC062D] bg-white dark:bg-white/[0.06] shadow-sm" 
                      : "border-black/[0.04] dark:border-white/[0.04] bg-white/60 dark:bg-white/[0.03]" 
                  }`}
                  style={{ borderWidth: "1px" }}
                >
                  <div className="flex items-start space-x-4 pr-2">
                    <span className="text-2xl pt-0.5 filter drop-shadow-sm">{item.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-black dark:text-white leading-none tracking-tight">{item.name}</span>
                      <span className="text-[11.5px] font-medium text-black/50 dark:text-white/40 mt-1.5 leading-snug">{item.desc}</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${selectedStyle === item.id ? "border-[#FC062D] bg-[#FC062D]" : "border-black/10 dark:border-white/10"}`}>
                    {selectedStyle === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>

            {/* ЭТАП 2: ВЫБОР АНИМАЦИИ */}
            <div 
              className="w-full flex flex-col space-y-3.5 absolute inset-x-0"
              style={{
                transform: stage === "anim-select" ? "translateY(0)" : "translateY(-140%)",
                opacity: stage === "anim-select" ? 1 : 0,
                pointerEvents: stage === "anim-select" ? "auto" : "none",
                transition: "all 550ms cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {[
                { id: "yes", emoji: "✅", name: "Кнш включим", desc: "Куда же без них, верно?" },
                { id: "no", emoji: "😱", name: "НИ В КОЕМ СЛУЧАЕ!", desc: "эти вечно движущиеся штуки пугают…" },
                { id: "whatever", emoji: "🙄", name: "ватевер", desc: "сделаем как задумано дизайнером, он старался" }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectAnim(item.id)}
                  className={`w-full p-4.5 flex items-center justify-between border rounded-[22px] backdrop-blur-md transition-all duration-200 ${
                    selectedAnim === item.id 
                      ? "border-[#FC062D]" 
                      : "border-black/[0.04] dark:border-white/[0.04] bg-white/60 dark:bg-white/[0.03]"
                  }`}
                  style={{ borderWidth: "1px" }}
                >
                  <div className="flex items-start space-x-4 pr-2">
                    <span className="text-2xl pt-0.5 filter drop-shadow-sm">{item.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-black dark:text-white leading-none tracking-tight">{item.name}</span>
                      <span className="text-[11.5px] font-medium text-black/50 dark:text-white/40 mt-1.5 leading-snug">{item.desc}</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${selectedAnim === item.id ? "border-[#FC062D] bg-[#FC062D]" : "border-black/10 dark:border-white/10"}`}>
                    {selectedAnim === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* НИЖНЯЯ СТАТИЧЕСКАЯ ЗОНА: НЕ ЛЕТАЕТ И НЕ ДВИГАЕТСЯ */}
          <div className="w-full max-w-[342px] mx-auto flex flex-col items-center">
            
            {/* ТЕКСТ-ПОДСКАЗКА: РОВНО ПОЦЕНТРЕ МЕЖДУ СЛАЙДЕРОМ И КНОПКОЙ */}
            <div className="w-full flex items-start space-x-2 px-1 py-5 opacity-70">
              <img src="/icons/info.png" alt="Info" className="w-3.5 h-3.5 object-contain shrink-0 mt-0.5 dark:invert dark:opacity-80" />
              <span className="text-[11px] font-medium text-black/60 dark:text-white/50 leading-tight">
                Ты всегда сможешь поменять свой выбор в настройках, йоу
              </span>
            </div>

            {/* КНОПКА ДЕЙСТВИЯ */}
            {stage === "style-select" ? (
              <button
                onClick={handleNextStep}
                disabled={!selectedStyle}
                className={`w-full h-14 rounded-full font-bold text-[14px] tracking-tight transition-all duration-300 outline-none shadow-md ${selectedStyle ? "bg-[#FC062D] text-white active:scale-[0.97] shadow-red-500/10" : "bg-black/[0.04] dark:bg-white/[0.04] text-black/25 dark:text-white/25 shadow-none"}`}
              >
                Продолжить
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!selectedAnim}
                className={`w-full h-14 rounded-full font-bold text-[14px] tracking-tight transition-all duration-300 outline-none shadow-md ${selectedAnim ? "bg-[#FC062D] text-white active:scale-[0.97] shadow-red-500/10" : "bg-black/[0.04] dark:bg-white/[0.04] text-black/25 dark:text-white/25 shadow-none"}`}
              >
                Завершить
              </button>
            )}
          </div>
          
        </div>
      )}

      {/* Анимация пульсации */}
      <style jsx global>{`
        @keyframes ios-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.78; }
        }
      `}</style>
    </div>
  );
}
