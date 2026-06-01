"use client";

import React, { useState } from "react";

// Типы поддерживаемых шилдов
export type ShieldType = 
  | "counter" 
  | "weather" 
  | "percentage" 
  | "battery" 
  | "usd" 
  | "rub" 
  | "cny" 
  | "stars";

// Интерфейс для списка выбора в ModalSh
export interface ShieldConfig {
  id: ShieldType;
  label: string;
  icon: string; // Можно использовать как эмодзи, так и путь к картинке
}

// Конфигурация для рендеринга в меню выбора
export const AVAILABLE_SHIELDS: ShieldConfig[] = [
  { id: "counter", label: "Счетчик", icon: "🔢" },
  { id: "weather", label: "Погода", icon: "☀️" },
  { id: "percentage", label: "Проценты", icon: "％" },
  { id: "battery", label: "Батарея", icon: "🔋" },
  { id: "usd", label: "Доллары", icon: "＄" },
  { id: "rub", label: "Рубли", icon: "₽" },
  { id: "cny", label: "Юани", icon: "¥" },
  { id: "stars", label: "Звезды", icon: "⭐️" },
];

// Вспомогательный хандлер вибрации для кнопок внутри шилдов
const triggerHaptic = (style: "light" | "medium") => {
  if (typeof window !== "undefined") {
    const anyWindow = window as any;
    if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
      try { anyWindow.Telegram.WebApp.HapticFeedback.impactOccurred(style); } catch (e) {}
    }
  }
};

/* ==========================================
   КОМПОНЕНТЫ ШИЛДОВ (Каждый изолирован)
   ========================================== */

// 1. Счетчик [- 6 +]
export function CounterShield() {
  const [count, setCount] = useState(5);
  return (
    <span 
      contentEditable={false}
      className="inline-flex items-center inline-baseline bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-full px-2 py-0.5 mx-1 text-xs font-bold select-none text-appleLight-text dark:text-appleDark-text vertical-mid scale-[0.98]"
    >
      <button 
        onClick={() => { triggerHaptic("light"); setCount(c => c - 1); }}
        className="w-4 h-4 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors active:scale-90"
      >
        -
      </button>
      <span className="mx-2 min-w-[12px] text-center tracking-tighter font-mono text-[#FC062D]">
        {count}
      </span>
      <button 
        onClick={() => { triggerHaptic("light"); setCount(c => c + 1); }}
        className="w-4 h-4 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors active:scale-90"
      >
        +
      </button>
    </span>
  );
}

// 2. Погода
export function WeatherShield() {
  const [temp, setTemp] = useState(22);
  return (
    <span 
      contentEditable={false}
      className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-full px-2.5 py-0.5 mx-1 text-xs font-medium select-none text-appleLight-text dark:text-appleDark-text"
      onClick={() => {
        triggerHaptic("light");
        setTemp(t => t === 22 ? 15 : t === 15 ? -4 : 22); // Демонстрация интерактива по тапу
      }}
    >
      <span className="mr-1">{temp > 0 ? "☀️" : "❄️"}</span>
      <span className="font-mono font-bold">{temp > 0 ? `+${temp}` : temp}°C</span>
    </span>
  );
}

// 3. Проценты
export function PercentageShield() {
  return (
    <span 
      contentEditable={false}
      className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-full px-2 py-0.5 mx-1 text-xs font-bold text-appleLight-text dark:text-appleDark-text"
    >
      <span 
        contentEditable 
        suppressContentEditableWarning
        className="outline-none px-0.5 min-w-[15px] font-mono text-center focus:text-[#FC062D]"
      >
        85
      </span>
      <span className="text-neutral-400 dark:text-neutral-500 font-normal ml-0.5">%</span>
    </span>
  );
}

// 4. Батарея
export function BatteryShield() {
  const [level, setLevel] = useState(100);
  return (
    <span 
      contentEditable={false}
      onClick={() => {
        triggerHaptic("light");
        setLevel(l => l === 100 ? 42 : l === 42 ? 12 : 100);
      }}
      className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-full px-2.5 py-0.5 mx-1 text-xs font-medium select-none text-appleLight-text dark:text-appleDark-text"
    >
      <div className="w-4 h-2.5 border border-neutral-400 dark:border-neutral-500 rounded-[3px] p-[1px] mr-1.5 flex items-center relative">
        <div 
          className={`h-full rounded-[1px] transition-all duration-300 ${
            level <= 20 ? "bg-red-500" : level <= 50 ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${level}%` }}
        />
        <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1px] h-1 bg-neutral-400 dark:bg-neutral-500 rounded-r-[1px]" />
      </div>
      <span className="font-mono font-bold text-[11px]">{level}%</span>
    </span>
  );
}

// 5. Валюта: Доллар
export function UsdShield() {
  return (
    <span 
      contentEditable={false}
      className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-md px-1.5 py-0.5 mx-1 text-xs font-bold text-appleLight-text dark:text-appleDark-text"
    >
      <span className="text-emerald-500 mr-0.5">$</span>
      <span 
        contentEditable 
        suppressContentEditableWarning
        className="outline-none min-w-[10px] font-mono focus:text-[#FC062D]"
      >
        100
      </span>
    </span>
  );
}

// 6. Валюта: Рубль
export function RubShield() {
  return (
    <span 
      contentEditable={false}
      className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-md px-1.5 py-0.5 mx-1 text-xs font-bold text-appleLight-text dark:text-appleDark-text"
    >
      <span 
        contentEditable 
        suppressContentEditableWarning
        className="outline-none min-w-[10px] font-mono focus:text-[#FC062D]"
      >
        500
      </span>
      <span className="text-neutral-400 dark:text-neutral-500 font-normal ml-0.5">₽</span>
    </span>
  );
}

// 7. Валюта: Юань
export function CnyShield() {
  return (
    <span 
      contentEditable={false}
      className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-md px-1.5 py-0.5 mx-1 text-xs font-bold text-appleLight-text dark:text-appleDark-text"
    >
      <span 
        contentEditable 
        suppressContentEditableWarning
        className="outline-none min-w-[10px] font-mono focus:text-[#FC062D]"
      >
        50
      </span>
      <span className="text-amber-600 dark:text-amber-500 font-normal ml-0.5">¥</span>
    </span>
  );
}

// 8. Звезды (Интерактивный рейтинг)
export function StarsShield() {
  const [rating, setRating] = useState(4);
  return (
    <span 
      contentEditable={false}
      className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-full px-2 py-0.5 mx-1 text-xs select-none"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => { triggerHaptic("light"); setRating(star); }}
          className={`text-[11px] transition-transform active:scale-125 mx-[0.5px] ${
            star <= rating ? "opacity-100" : "opacity-25 grayscale"
          }`}
        >
          ⭐️
        </button>
      ))}
    </span>
  );
}

/* ==========================================
   МАППЕР ДЛЯ ДИНАМИЧЕСКОГО РЕНДЕРА
   ========================================== */
interface RenderShieldProps {
  type: ShieldType;
}

export function RenderShield({ type }: RenderShieldProps) {
  switch (type) {
    case "counter": return <CounterShield />;
    case "weather": return <WeatherShield />;
    case "percentage": return <PercentageShield />;
    case "battery": return <BatteryShield />;
    case "usd": return <UsdShield />;
    case "rub": return <RubShield />;
    case "cny": return <CnyShield />;
    case "stars": return <StarsShield />;
    default: return null;
  }
}
