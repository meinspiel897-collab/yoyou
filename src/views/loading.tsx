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

  // Управление нативной кнопкой "Назад" в Telegram
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

  // Управление цветами темы Telegram
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      if (stage === "pure-loading" || stage === "final-loading") {
        webApp.setHeaderColor("#FC062D");
        webApp.setBackgroundColor("#FC062D");
      } else {
        const theme = webApp.colorScheme || "dark";
        const bgColor = theme === "dark" ? "#000000" : "#FFFFFF";
        webApp.setHeaderColor("#FC062D");
        webApp.setBackgroundColor(bgColor);
      }
    }
  }, [stage]);

  // Эффект первой загрузки
  useEffect(() => {
    if (stage === "pure-loading") {
      const timer = setTimeout(() => {
        setStage("style-select");
      }, 2500); // Чуть быстрее для iOS-ощущения
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
      // Переход после загрузки БЕЗ задержки, мгновенно
      sessionStorage.setItem("yoyou_fully_loaded", "true");
      onComplete();
    }
  };

  const isFullRed = stage === "pure-loading" || stage === "final-loading";

  // Динамические стили для логотипа в зависимости от стейджа
  const getLogoStyles = () => {
    if (isFullRed) {
      return {
        width: "52px",
        height: "52px",
        transform: "translate(0, 0)", // Центр в Flexbox контейнере
      };
    } else {
      // Сдвиг влево на 50% контейнера '340px' (то есть -170px) + отступ 24px (внутренний px-6)
      // И поднятие наверх для вписывания в шапку 130px
      return {
        width: "48px",
        height: "48px",
        transform: "translate(-146px, calc(-50vh + 65px))", 
      };
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-appleLight-bg dark:bg-appleDark-bg overflow-hidden relative select-none">
      
      {/* КРАСНОЕ ПРОСТРАНСТВО (ШАПКА / ЭКРАН ЗАГРУЗКИ) */}
      <div 
        className="w-full bg-[#FC062D] relative flex flex-col px-6 box-border z-[99] overflow-hidden justify-center items-center"
        style={{
          height: isFullRed ? "100%" : "20%",
          minHeight: isFullRed ? "100%" : "130px",
          // Быстрая и плавная iOS-кривая для изменения размера контейнера
          transition: "height 550ms cubic-bezier(0.19, 1, 0.22, 1), min-height 550ms cubic-bezier(0.19, 1, 0.22, 1)"
        }}
      >
        {/* ФОНОВЫЙ ПУЛЬСИРУЮЩИЙ СЛОЙ ДЛЯ ЭФФЕКТА ГЛАЗОК */}
        <div 
          className="absolute inset-0 bg-[#FC062D] transition-opacity duration-500 ease-in-out pointer-events-none"
          style={{
            opacity: isFullRed ? 1 : 0,
            animation: isFullRed ? "ios-pulse 2s infinite ease-in-out" : "none" // Пульсация быстрее
          }}
        />

        {/* ЕДИНЫЙ ЛОГОТИП С ДИНАМИЧЕСКИМ ПОЗИЦИОНИРОВАНИЕМ ПО ДИАГОНАЛИ */}
        <img 
          src="/icons/logo.png" 
          alt="Logo" 
          className="object-contain shrink-0 absolute z-10"
          style={{
            ...getLogoStyles(),
            // Быстрая и плавная iOS-кривая для перемещения лого по диагонали (transform) и изменения размера
            transition: "transform 550ms cubic-bezier(0.19, 1, 0.22, 1), width 550ms cubic-bezier(0.19, 1, 0.22, 1), height 550ms cubic-bezier(0.19, 1, 0.22, 1)"
          }}
        />

        {/* Блок с текстом вопросов (виден только на шагах выбора) */}
        {/* Контейнер для текста теперь центрирует текст */}
        <div 
          className="w-full max-w-[340px] mx-auto flex items-center justify-center relative z-10"
          style={{
            display: isFullRed ? "none" : "flex",
            opacity: isFullRed ? 0 : 1,
            visibility: isFullRed ? "hidden" : "visible",
            // Текст появляется быстро, но с легкой задержкой после начала движения лого
            transition: "opacity 300ms ease 150ms, visibility 300ms ease 150ms"
          }}
        >
          {/* Фейковый отступ, чтобы текст не наезжал на лого слева, но сам текст центрировался по X */}
          <div className="w-[48px] h-[48px] shrink-0 mr-4" />
          
          <div className="h-12 relative overflow-hidden flex-1">
            <div 
              className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center"
              style={{
                transform: stage === "style-select" ? "translateY(0)" : "translateY(-120%)",
                opacity: stage === "style-select" ? 1 : 0,
                // Текст выезжает быстро по iOS-кривой
                transition: "all 450ms cubic-bezier(0.19, 1, 0.22, 1)"
              }}
            >
              <h2 className="text-white text-base font-bold leading-tight tracking-tight text-center">
                Выбери стиль, который тебе больше всего нравится
              </h2>
            </div>
            <div 
              className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center"
              style={{
                transform: stage === "anim-select" ? "translateY(0)" : "translateY(120%)",
                opacity: stage === "anim-select" ? 1 : 0,
                transition: "all 450ms cubic-bezier(0.19, 1, 0.22, 1)"
              }}
            >
              <h2 className="text-white text-base font-bold leading-tight tracking-tight text-center">
                Включим анимации?
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* НИЖНЯЯ ЧАСТЬ С КОНТЕНТОМ И КНОПКАМИ */}
      {!isFullRed && (
        // Контент появляется быстро, без эффекта translateY
        <div className="flex-1 w-full bg-appleLight-bg dark:bg-appleDark-bg flex flex-col justify-between pt-2 pb-10 px-6 box-border animate-[ios-fade-in_350ms_ease-out_150ms_forward]">
          
          <div className="w-full max-w-[340px] mx-auto flex flex-col justify-center relative overflow-hidden flex-1">
            
            {/* ЭТАП 1: ВЫБОР СТИЛЯ */}
            <div 
              className="w-full flex flex-col space-y-4 absolute inset-x-0"
              style={{
                transform: stage === "style-select" ? "translateY(0)" : "translateY(130%)",
                opacity: stage === "style-select" ? 1 : 0,
                pointerEvents: stage === "style-select" ? "auto" : "none",
                transition: "all 550ms cubic-bezier(0.19, 1, 0.22, 1)"
              }}
            >
              {[
                { id: "zoomer", emoji: "🫪", name: "Зумерский", desc: "оч популярный вариант, классный вайб" },
                { id: "official", emoji: "👔", name: "Официальный", desc: "ох уж эти миллениалы" },
                { id: "nefor", emoji: "🕷️", name: "Нефорский", desc: "ее, шаришь за это? а я нет, но постараюсь сделать вид, что тоже в теме, бро!" }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectStyle(item.id)}
                  // Убрано scale при нажатии
                  className={`w-full p-5 flex items-center justify-between border rounded-[24px] transition-colors duration-300 ${
                    selectedStyle === item.id 
                      ? "border-[#FC062D]" 
                      : "border-appleLight-border/75 dark:border-appleDark-border/75 opacity-80" 
                  }`}
                  style={{
                    borderWidth: "1px",
                    borderColor: selectedStyle === item.id ? "#FC062D" : undefined
                  }}
                >
                  <div className="flex items-start space-x-3.5 pr-2">
                    <span className="text-2xl pt-0.5">{item.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-appleLight-text dark:text-appleDark-text leading-none">{item.name}</span>
                      <span className="text-xs font-medium text-appleLight-text/75 dark:text-appleDark-text/75 mt-1.5 leading-tight">{item.desc}</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-200 ${selectedStyle === item.id ? "border-[#FC062D] bg-[#FC062D]" : "border-appleLight-border/75 dark:border-appleDark-border/75"}`}>
                    {selectedStyle === item.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>

            {/* ЭТАП 2: ВЫБОР АНИМАЦИИ */}
            <div 
              className="w-full flex flex-col space-y-4 absolute inset-x-0"
              style={{
                transform: stage === "anim-select" ? "translateY(0)" : "translateY(-130%)",
                opacity: stage === "anim-select" ? 1 : 0,
                pointerEvents: stage === "anim-select" ? "auto" : "none",
                transition: "all 550ms cubic-bezier(0.19, 1, 0.22, 1)"
              }}
            >
              {[
                { id: "yes", emoji: "✅", name: "Кнш включим", desc: "Куда же без них, верно?" },
                { id: "no", emoji: "😱", name: "НИ В КОЕМ СЛУЧАЕ!", desc: "эти вечно движущиеся штуки ТАК пугают…" },
                { id: "whatever", emoji: "🙄", name: "ватевер", desc: "сделаем как задумано дизайнером, он же старался" }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectAnim(item.id)}
                  // Убрано scale при нажатии
                  className={`w-full p-5 flex items-center justify-between border rounded-[24px] transition-colors duration-300 ${
                    selectedAnim === item.id 
                      ? "border-[#FC062D]" 
                      : "border-appleLight-border/75 dark:border-appleDark-border/75 opacity-80"
                  }`}
                  style={{
                    borderWidth: "1px",
                    borderColor: selectedAnim === item.id ? "#FC062D" : undefined
                  }}
                >
                  <div className="flex items-start space-x-3.5 pr-2">
                    <span className="text-2xl pt-0.5">{item.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-appleLight-text dark:text-appleDark-text leading-none">{item.name}</span>
                      <span className="text-xs font-medium text-appleLight-text/75 dark:text-appleDark-text/75 mt-1.5 leading-tight">{item.desc}</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-200 ${selectedAnim === item.id ? "border-[#FC062D] bg-[#FC062D]" : "border-appleLight-border/75 dark:border-appleDark-border/75"}`}>
                    {selectedAnim === item.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Кнопка внизу */}
          <div className="w-full max-w-[340px] mx-auto mt-4">
            {stage === "style-select" ? (
              <button
                onClick={handleNextStep}
                disabled={!selectedStyle}
                className={`w-full h-14 rounded-full font-bold text-sm transition-all duration-300 outline-none ${selectedStyle ? "bg-[#FC062D] text-white active:scale-[0.97]" : "bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg text-appleLight-text/30 dark:text-appleDark-text/30"}`}
              >
                Продолжить
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!selectedAnim}
                className={`w-full h-14 rounded-full font-bold text-sm transition-all duration-300 outline-none ${selectedAnim ? "bg-[#FC062D] text-white active:scale-[0.97]" : "bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg text-appleLight-text/30 dark:text-appleDark-text/30"}`}
              >
                Завершить
              </button>
            )}
          </div>
        </div>
      )}

      {/* Профессиональные iOS анимации */}
      <style jsx global>{`
        @keyframes ios-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes ios-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
