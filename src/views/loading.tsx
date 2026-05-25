"use client";

import { useState, useEffect } from "react";

interface OnboardingProps {
  onComplete: () => void;
}

export default function OnboardingView({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<"style" | "anim">("style");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedAnim, setSelectedAnim] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      const theme = webApp.colorScheme || "dark";
      const bgColor = theme === "dark" ? "#000000" : "#FFFFFF";
      webApp.setHeaderColor("#FC062D");
      webApp.setBackgroundColor(bgColor);
    }
  }, []);

  const handleNextStep = () => {
    if (selectedStyle) {
      setStep("anim");
    }
  };

  const handleFinish = () => {
    if (selectedAnim && typeof window !== "undefined") {
      const anyWindow = window as any;
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try {
          anyWindow.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
        } catch (e) {}
      }
      onComplete();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-appleLight-bg dark:bg-appleDark-bg overflow-hidden relative">
      <div className="h-1/2 w-full bg-[#FC062D] relative flex items-end pb-8 px-6 box-border">
        <div className="flex items-center space-x-3 w-full max-w-[340px] mx-auto">
          <img 
            src="/icons/logo.png" 
            alt="Logo" 
            className="w-12 h-12 object-contain transition-all duration-500 ease-out"
          />
          <div className="flex-1 h-12 relative overflow-hidden">
            <div className={`absolute inset-0 flex items-center transition-all duration-500 ease-out ${step === "style" ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
              <h2 className="text-white text-base font-bold leading-tight tracking-tight">
                Выбери стиль, который тебе больше всего нравится
              </h2>
            </div>
            <div className={`absolute inset-0 flex items-center transition-all duration-500 ease-out ${step === "anim" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
              <h2 className="text-white text-base font-bold leading-tight tracking-tight">
                Включим анимации?
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1/2 w-full bg-appleLight-bg dark:bg-appleDark-bg flex flex-col justify-between pt-6 pb-8 px-6 box-border">
        <div className="w-full max-w-[340px] mx-auto flex flex-col space-y-3 relative overflow-hidden flex-1">
          <div className={`w-full flex flex-col space-y-3 transition-all duration-500 absolute top-0 inset-x-0 ${step === "style" ? "translate-x-0 opacity-100 pointer-events-auto" : "-translate-x-full opacity-0 pointer-events-none"}`}>
            {[
              { id: "zoomer", emoji: "🫪", name: "Зумерский", desc: "оч популярный вариант, классный вайб" },
              { id: "official", emoji: "👔", name: "Официальный", desc: "ох уж эти миллениалы" },
              { id: "nefor", emoji: "🕷️", name: "Нефорский", desc: "ее, шаришь за это? а я нет, но постараюсь сделать вид, что тоже в теме, бро!" }
            ].map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedStyle(item.id)}
                className={`w-full p-3.5 flex items-center justify-between border rounded-[22px] transition-all ${selectedStyle === item.id ? "border-[#FC062D]" : "border-appleLight-border dark:border-appleDark-border"}`}
              >
                <div className="flex items-start space-x-3 pr-2">
                  <span className="text-xl pt-0.5">{item.emoji}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-appleLight-text dark:text-appleDark-text leading-none">{item.name}</span>
                    <span className="text-xs font-medium text-appleLight-text/75 dark:text-appleDark-text/75 mt-1 leading-tight">{item.desc}</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedStyle === item.id ? "border-[#FC062D] bg-[#FC062D]" : "border-appleLight-border dark:border-appleDark-border"}`}>
                  {selectedStyle === item.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            ))}
          </div>

          <div className={`w-full flex flex-col space-y-3 transition-all duration-500 absolute top-0 inset-x-0 ${step === "anim" ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"}`}>
            {[
              { id: "yes", emoji: "✅", name: "Кнш включим", desc: "Куда же без них, верно?" },
              { id: "no", emoji: "😱", name: "НИ В КОЕМ СЛУЧАЕ!", desc: "эти вечно движущиеся штуки ТАК пугают…" },
              { id: "whatever", emoji: "🙄", name: "ватевер", desc: "сделаем как задумано дизайнером, он же старался" }
            ].map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedAnim(item.id)}
                className={`w-full p-3.5 flex items-center justify-between border rounded-[22px] transition-all ${selectedAnim === item.id ? "border-[#FC062D]" : "border-appleLight-border dark:border-appleDark-border"}`}
              >
                <div className="flex items-start space-x-3 pr-2">
                  <span className="text-xl pt-0.5">{item.emoji}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-appleLight-text dark:text-appleDark-text leading-none">{item.name}</span>
                    <span className="text-xs font-medium text-appleLight-text/75 dark:text-appleDark-text/75 mt-1 leading-tight">{item.desc}</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedAnim === item.id ? "border-[#FC062D] bg-[#FC062D]" : "border-appleLight-border dark:border-appleDark-border"}`}>
                  {selectedAnim === item.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-[340px] mx-auto mt-4">
          {step === "style" ? (
            <button
              onClick={handleNextStep}
              disabled={!selectedStyle}
              className={`w-full h-12 rounded-full font-bold text-sm transition-all outline-none ${selectedStyle ? "bg-[#FC062D] text-white" : "bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg text-appleLight-text/30 dark:text-appleDark-text/30"}`}
            >
              Продолжить
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!selectedAnim}
              className={`w-full h-12 rounded-full font-bold text-sm transition-all outline-none ${selectedAnim ? "bg-[#FC062D] text-white" : "bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg text-appleLight-text/30 dark:text-appleDark-text/30"}`}
            >
              Завершить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
