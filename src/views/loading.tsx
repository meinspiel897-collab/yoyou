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

  // Увеличенные тайминги загрузки
  useEffect(() => {
    if (stage === "pure-loading") {
      const hapticTimer = setTimeout(() => {
        triggerHaptic("light");
      }, 2750); // Вибрация чуть раньше конца первой загрузки

      const timer = setTimeout(() => {
        setStage("style-select");
      }, 3000); // Первая загрузка теперь 3 секунды
      return () => {
        clearTimeout(hapticTimer);
        clearTimeout(timer);
      };
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
      if (typeof window !== "undefined") {
        const anyWindow = window as any;
        if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
          try {
            anyWindow.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
          } catch (e) {}
        }
      }
      setStage("final-loading");
      setTimeout(() => {
        sessionStorage.setItem("yoyou_fully_loaded", "true");
        onComplete();
      }, 3000); // Финальная загрузка тоже теперь 3 секунды для солидности
    }
  };

  const isFullRed = stage === "pure-loading" || stage === "final-loading";

  return (
    <div className="w-full h-full flex flex-col bg-appleLight-bg dark:bg-appleDark-bg overflow-hidden relative select-none">
      
      {/* КРАСНОЕ ПРОСТРАНСТВО (ШАПКА / ЭКРАН ЗАГРУЗКИ) */}
      <div 
        className="w-full bg-[#FC062D] relative flex items-center px-6 box-border z-[99] overflow-hidden"
        style={{
          height: isFullRed ? "100%" : "20%",
          minHeight: isFullRed ? "100%" : "130px",
          transition: "all 650ms cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      >
        {/* Паттерн из знаков вопроса (убирается/скрывается в фуллскрине маской) */}
        {!isFullRed && (
          <div 
            className="absolute inset-0 opacity-100 pointer-events-none mix-blend-screen"
            style={{
              backgroundImage: "url('/icons/question.png')",
              backgroundSize: "24px 24px",
              backgroundRepeat: "repeat",
              // Радиальная маска: в центре прозрачность выше (opacity меньше), по краям — плотнее
              maskImage: "radial-gradient(circle, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.23) 70%)",
              WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.23) 70%)",
            }}
          />
        )}

        {/* Контейнер для выравнивания контента */}
        <div 
          className="w-full max-w-[340px] mx-auto flex items-center relative z-10"
          style={{
            justifyContent: isFullRed ? "center" : "flex-start",
            transition: "all 650ms cubic-bezier(0.25, 1, 0.5, 1)"
          }}
        >
          {/* ЛОГОТИП: ОН ОДИН, ОН НЕ ИСЧЕЗАЕТ, А ЕЗДИТ И МЕНЯЕТ РАЗМЕР */}
          <img 
            src="/icons/logo.png" 
            alt="Logo" 
            className="object-contain shrink-0"
            style={{
              width: isFullRed ? "96px" : "48px",
              height: isFullRed ? "96px" : "48px",
              // Хитрая трансформация смещения: если экран полный — лого строго по центру, если шапка — сдвига влево нет
              transform: isFullRed ? "translateX(0)" : "translateX(0)", 
              transition: "all 650ms cubic-bezier(0.25, 1, 0.5, 1)"
            }}
          />
          
          {/* Блок с текстом вопросов — появляется только на этапах выбора */}
          <div 
            className="flex-1 h-12 relative overflow-hidden"
            style={{
              marginLeft: isFullRed ? "0px" : "16px",
              opacity: isFullRed ? 0 : 1,
              visibility: isFullRed ? "hidden" : "visible",
              transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)"
            }}
          >
            <div 
              className="absolute inset-0 flex items-center"
              style={{
                transform: stage === "style-select" ? "translateX(0)" : "translateX(-105%)",
                opacity: stage === "style-select" ? 1 : 0,
                transition: "all 500ms cubic-bezier(0.25, 1, 0.5, 1)"
              }}
            >
              <h2 className="text-white text-base font-bold leading-tight tracking-tight">
                Выбери стиль, который тебе больше всего нравится
              </h2>
            </div>
            <div 
              className="absolute inset-0 flex items-center"
              style={{
                transform: stage === "anim-select" ? "translateX(0)" : "translateX(105%)",
                opacity: stage === "anim-select" ? 1 : 0,
                transition: "all 500ms cubic-bezier(0.25, 1, 0.5, 1)"
              }}
            >
              <h2 className="text-white text-base font-bold leading-tight tracking-tight">
                Включим анимации?
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* НИЖНЯЯ ЧАСТЬ С КОНТЕНТОМ И КНОПКАМИ */}
      {!isFullRed && (
        <div className="flex-1 w-full bg-appleLight-bg dark:bg-appleDark-bg flex flex-col justify-between pt-2 pb-10 px-6 box-border">
          
          {/* Крупные отцентрованные блоки */}
          <div className="w-full max-w-[340px] mx-auto flex flex-col justify-center relative overflow-hidden flex-1">
            
            {/* ЭТАП 1: ВЫБОР СТИЛЯ */}
            <div 
              className="w-full flex flex-col space-y-4 absolute inset-x-0"
              style={{
                transform: stage === "style-select" ? "translateX(0)" : "translateX(-110%)",
                opacity: stage === "style-select" ? 1 : 0,
                pointerEvents: stage === "style-select" ? "auto" : "none",
                transition: "all 550ms cubic-bezier(0.25, 1, 0.5, 1)"
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
                  className={`w-full p-5 flex items-center justify-between border rounded-[24px] transition-all duration-300 active:scale-[0.99] ${
                    selectedStyle === item.id 
                      ? "border-[#FC062D]" 
                      : "border-appleLight-border/75 dark:border-appleDark-border/75 opacity-75" 
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
                transform: stage === "anim-select" ? "translateX(0)" : "translateX(110%)",
                opacity: stage === "anim-select" ? 1 : 0,
                pointerEvents: stage === "anim-select" ? "auto" : "none",
                transition: "all 550ms cubic-bezier(0.25, 1, 0.5, 1)"
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
                  className={`w-full p-5 flex items-center justify-between border rounded-[24px] transition-all duration-300 active:scale-[0.99] ${
                    selectedAnim === item.id 
                      ? "border-[#FC062D]" 
                      : "border-appleLight-border/75 dark:border-appleDark-border/75 opacity-75"
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

          {/* Высокая кнопка внизу */}
          <div className="w-full max-w-[340px] mx-auto mt-4">
            {stage === "style-select" ? (
              <button
                onClick={handleNextStep}
                disabled={!selectedStyle}
                className={`w-full h-14 rounded-full font-bold text-sm transition-all duration-300 outline-none ${selectedStyle ? "bg-[#FC062D] text-white active:opacity-90" : "bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg text-appleLight-text/30 dark:text-appleDark-text/30"}`}
              >
                Продолжить
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!selectedAnim}
                className={`w-full h-14 rounded-full font-bold text-sm transition-all duration-300 outline-none ${selectedAnim ? "bg-[#FC062D] text-white active:opacity-90" : "bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg text-appleLight-text/30 dark:text-appleDark-text/30"}`}
              >
                Завершить
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
