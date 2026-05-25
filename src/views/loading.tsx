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

  useEffect(() => {
    if (stage === "pure-loading") {
      const timer = setTimeout(() => {
        setStage("style-select");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

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
      }, 2000);
    }
  };

  const isFullRed = stage === "pure-loading" || stage === "final-loading";

  return (
    <div className="w-full h-full flex flex-col bg-appleLight-bg dark:bg-appleDark-bg overflow-hidden relative">
      <div 
        className="w-full bg-[#FC062D] relative flex items-end px-6 box-border z-[99]"
        style={{
          height: isFullRed ? "100%" : "24%",
          minHeight: isFullRed ? "100%" : "150px",
          justifyContent: isFullRed ? "center" : "flex-start",
          alignItems: isFullRed ? "center" : "flex-end",
          paddingBottom: isFullRed ? "0" : "24px",
          transition: "all 550ms cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}
      >
        <div 
          className="flex items-center w-full max-w-[340px] mx-auto"
          style={{
            justifyContent: isFullRed ? "center" : "flex-start",
            gap: isFullRed ? "0px" : "14px",
            flexDirection: "row",
            transition: "all 550ms cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        >
          <img 
            src="/icons/logo.png" 
            alt="Logo" 
            className="object-contain"
            style={{
              width: isFullRed ? "96px" : "48px",
              height: isFullRed ? "96px" : "48px",
              transition: "all 550ms cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}
          />
          
          {!isFullRed && (
            <div className="flex-1 h-12 relative overflow-hidden">
              <div 
                className="absolute inset-0 flex items-center"
                style={{
                  transform: stage === "style-select" ? "translateX(0)" : "translateX(-110%)",
                  opacity: stage === "style-select" ? 1 : 0,
                  transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
              >
                <h2 className="text-white text-base font-bold leading-tight tracking-tight">
                  Выбери стиль, который тебе больше всего нравится
                </h2>
              </div>
              <div 
                className="absolute inset-0 flex items-center"
                style={{
                  transform: stage === "anim-select" ? "translateX(0)" : "translateX(110%)",
                  opacity: stage === "anim-select" ? 1 : 0,
                  transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
              >
                <h2 className="text-white text-base font-bold leading-tight tracking-tight">
                  Включим анимации?
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isFullRed && (
        <div className="flex-1 w-full bg-appleLight-bg dark:bg-appleDark-bg flex flex-col justify-between pt-4 pb-10 px-6 box-border">
          <div className="w-full max-w-[340px] mx-auto flex flex-col justify-center relative overflow-hidden flex-1">
            <div 
              className="w-full flex flex-col space-y-3.5 absolute inset-x-0"
              style={{
                transform: stage === "style-select" ? "translateX(0)" : "translateX(-110%)",
                opacity: stage === "style-select" ? 1 : 0,
                pointerEvents: stage === "style-select" ? "auto" : "none",
                transition: "all 450ms cubic-bezier(0.34, 1.56, 0.64, 1)"
              }}
            >
              {[
                { id: "zoomer", emoji: "🫪", name: "Зумерский", desc: "оч популярный вариант, классный вайб" },
                { id: "official", emoji: "👔", name: "Официальный", desc: "ох уж эти миллениалы" },
                { id: "nefor", emoji: "🕷️", name: "Нефорский", desc: "ее, шаришь за это? а я нет, но постараюсь сделать вид, что тоже в теме, бро!" }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedStyle(item.id)}
                  className={`w-full p-4 flex items-center justify-between border rounded-[24px] transition-all duration-300 ${
                    selectedStyle === item.id 
                      ? "border-[#FC062D]" 
                      : "border-appleLight-border/75 dark:border-appleDark-border/75"
                  }`}
                >
                  <div className="flex items-start space-x-3.5 pr-2">
                    <span className="text-2xl pt-0.5">{item.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-appleLight-text dark:text-appleDark-text leading-none">{item.name}</span>
                      <span className="text-xs font-medium text-appleLight-text/75 dark:text-appleDark-text/75 mt-1.5 leading-tight">{item.desc}</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${selectedStyle === item.id ? "border-[#FC062D] bg-[#FC062D]" : "border-appleLight-border/75 dark:border-appleDark-border/75"}`}>
                    {selectedStyle === item.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>

            <div 
              className="w-full flex flex-col space-y-3.5 absolute inset-x-0"
              style={{
                transform: stage === "anim-select" ? "translateX(0)" : "translateX(110%)",
                opacity: stage === "anim-select" ? 1 : 0,
                pointerEvents: stage === "anim-select" ? "auto" : "none",
                transition: "all 450ms cubic-bezier(0.34, 1.56, 0.64, 1)"
              }}
            >
              {[
                { id: "yes", emoji: "✅", name: "Кнш включим", desc: "Куда же без них, верно?" },
                { id: "no", emoji: "😱", name: "НИ В КОЕМ СЛУЧАЕ!", desc: "эти вечно движущиеся штуки ТАК пугают…" },
                { id: "whatever", emoji: "🙄", name: "ватевер", desc: "сделаем как задумано дизайнером, он же старался" }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedAnim(item.id)}
                  className={`w-full p-4 flex items-center justify-between border rounded-[24px] transition-all duration-300 ${
                    selectedAnim === item.id 
                      ? "border-[#FC062D]" 
                      : "border-appleLight-border/75 dark:border-appleDark-border/75"
                  }`}
                >
                  <div className="flex items-start space-x-3.5 pr-2">
                    <span className="text-2xl pt-0.5">{item.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-appleLight-text dark:text-appleDark-text leading-none">{item.name}</span>
                      <span className="text-xs font-medium text-appleLight-text/75 dark:text-appleDark-text/75 mt-1.5 leading-tight">{item.desc}</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${selectedAnim === item.id ? "border-[#FC062D] bg-[#FC062D]" : "border-appleLight-border/75 dark:border-appleDark-border/75"}`}>
                    {selectedAnim === item.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-[340px] mx-auto mt-4">
            {stage === "style-select" ? (
              <button
                onClick={() => setStage("anim-select")}
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
