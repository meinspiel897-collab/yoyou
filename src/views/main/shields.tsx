"use client";

import React, { useState } from "react";

export type ShieldType = 
  | "counter" 
  | "weather" 
  | "percentage" 
  | "battery" 
  | "usd" 
  | "rub" 
  | "cny" 
  | "stars";

export interface ShieldConfig {
  id: ShieldType;
  label: string;
  icon: string;
}

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

const triggerHaptic = (style: "light" | "medium") => {
  if (typeof window !== "undefined") {
    const anyWindow = window as any;
    if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
      try { anyWindow.Telegram.WebApp.HapticFeedback.impactOccurred(style); } catch (e) {}
    }
  }
};

// Функция генерации статического HTML для моментальной вставки в каретку курсора
export function getShieldHtml(type: ShieldType): string {
  const baseClass = "inline-flex items-center inline-baseline bg-neutral-100 dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/50 rounded-full px-2 py-0.5 mx-1 text-xs font-bold select-none text-appleLight-text dark:text-appleDark-text align-middle transition-all duration-150 transform scale-[0.98] select-none";
  const rectClass = "inline-flex items-center inline-baseline bg-neutral-100 dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/50 rounded-md px-1.5 py-0.5 mx-1 text-xs font-bold text-appleLight-text dark:text-appleDark-text align-middle transition-all duration-150 select-none";

  switch (type) {
    case "counter":
      return `<span contenteditable="false" data-shield-type="counter" class="${baseClass}">
        <button data-shield-action="dec" class="w-4 h-4 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full active:scale-75 outline-none font-mono">-</button>
        <span data-shield-value="count" class="mx-1.5 min-w-[12px] text-center tracking-tighter font-mono text-[#FC062D]">5</span>
        <button data-shield-action="inc" class="w-4 h-4 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full active:scale-75 outline-none font-mono">+</button>
      </span>`;
      
    case "weather":
      return `<span contenteditable="false" data-shield-type="weather" class="${baseClass} cursor-pointer active:scale-95">
        <span data-shield-value="icon" class="mr-1 text-[11px]">☀️</span>
        <span data-shield-value="temp" class="font-mono font-bold text-[11px]">+22°C</span>
      </span>`;
      
    case "percentage":
      return `<span contenteditable="false" data-shield-type="percentage" class="${baseClass}">
        <span contenteditable="true" data-shield-value="input" class="outline-none px-0.5 min-w-[14px] font-mono text-center focus:text-[#FC062D]">85</span>
        <span class="text-neutral-400 dark:text-neutral-500 font-normal ml-0.5">%</span>
      </span>`;
      
    case "battery":
      return `<span contenteditable="false" data-shield-type="battery" class="${baseClass} cursor-pointer active:scale-95">
        <div class="w-3.5 h-2 border border-neutral-400 dark:border-neutral-500 rounded-[2px] p-[0.5px] mr-1 flex items-center relative flex-shrink-0">
          <div data-shield-value="bar" class="h-full rounded-[0.5px] bg-emerald-500 transition-all duration-300" style="width: 100%;"></div>
          <div class="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1px] h-0.5 bg-neutral-400 dark:bg-neutral-500 rounded-r-[0.5px]"></div>
        </div>
        <span data-shield-value="text" class="font-mono font-bold text-[10px]">100%</span>
      </span>`;
      
    case "usd":
      return `<span contenteditable="false" data-shield-type="usd" class="${rectClass}">
        <span class="text-emerald-500 mr-0.5 font-medium">$</span>
        <span contenteditable="true" data-shield-value="input" class="outline-none min-w-[10px] font-mono focus:text-[#FC062D]">100</span>
      </span>`;
      
    case "rub":
      return `<span contenteditable="false" data-shield-type="rub" class="${rectClass}">
        <span contenteditable="true" data-shield-value="input" class="outline-none min-w-[10px] font-mono focus:text-[#FC062D]">500</span>
        <span class="text-neutral-400 dark:text-neutral-500 font-normal ml-0.5">₽</span>
      </span>`;
      
    case "cny":
      return `<span contenteditable="false" data-shield-type="cny" class="${rectClass}">
        <span contenteditable="true" data-shield-value="input" class="outline-none min-w-[10px] font-mono focus:text-[#FC062D]">50</span>
        <span class="text-amber-600 dark:text-amber-500 font-normal ml-0.5">¥</span>
      </span>`;
      
    case "stars":
      return `<span contenteditable="false" data-shield-type="stars" class="inline-flex items-center bg-neutral-100 dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/50 rounded-full px-2 py-0.5 mx-1 text-xs select-none align-middle scale-[0.98]">
        <button data-star-idx="1" class="text-[10px] transition-all mx-[0.5px] opacity-100 outline-none">⭐️</button>
        <button data-star-idx="2" class="text-[10px] transition-all mx-[0.5px] opacity-100 outline-none">⭐️</button>
        <button data-star-idx="3" class="text-[10px] transition-all mx-[0.5px] opacity-100 outline-none">⭐️</button>
        <button data-star-idx="4" class="text-[10px] transition-all mx-[0.5px] opacity-100 outline-none">⭐️</button>
        <button data-star-idx="5" class="text-[10px] transition-all mx-[0.5px] opacity-25 grayscale outline-none">⭐️</button>
      </span>`;
      
    default:
      return "";
  }
}

/* ==========================================
   КОМПОНЕНТЫ ДЛЯ ПРЕДПРОСМОТРА В МОДАЛКЕ
   ========================================== */

export function CounterShield() {
  return (
    <span className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-full px-2 py-0.5 text-xs font-bold text-appleLight-text dark:text-appleDark-text select-none">
      <span className="w-4 h-4 flex items-center justify-center opacity-40">-</span>
      <span className="mx-2 font-mono text-[#FC062D]">5</span>
      <span className="w-4 h-4 flex items-center justify-center opacity-40">+</span>
    </span>
  );
}

export function WeatherShield() {
  return (
    <span className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-full px-2.5 py-0.5 text-xs font-medium text-appleLight-text dark:text-appleDark-text select-none">
      <span className="mr-1">☀️</span>
      <span className="font-mono font-bold">+22°C</span>
    </span>
  );
}

export function PercentageShield() {
  return (
    <span className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-full px-2 py-0.5 text-xs font-bold text-appleLight-text dark:text-appleDark-text select-none">
      <span className="font-mono">85</span>
      <span className="text-neutral-400 dark:text-neutral-500 font-normal ml-0.5">%</span>
    </span>
  );
}

export function BatteryShield() {
  return (
    <span className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-full px-2.5 py-0.5 text-xs font-medium text-appleLight-text dark:text-appleDark-text select-none">
      <div className="w-3.5 h-2 border border-neutral-400 dark:border-neutral-500 rounded-[2px] p-[0.5px] mr-1 flex items-center relative">
        <div className="h-full rounded-[0.5px] bg-emerald-500 w-full" />
        <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1px] h-0.5 bg-neutral-400 dark:bg-neutral-500 rounded-r-[0.5px]" />
      </div>
      <span className="font-mono font-bold text-[10px]">100%</span>
    </span>
  );
}

export function UsdShield() {
  return (
    <span className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-md px-1.5 py-0.5 text-xs font-bold text-appleLight-text dark:text-appleDark-text select-none">
      <span className="text-emerald-500 mr-0.5">$</span>
      <span className="font-mono">100</span>
    </span>
  );
}

export function RubShield() {
  return (
    <span className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-md px-1.5 py-0.5 text-xs font-bold text-appleLight-text dark:text-appleDark-text select-none">
      <span className="font-mono">500</span>
      <span className="text-neutral-400 dark:text-neutral-500 font-normal ml-0.5">₽</span>
    </span>
  );
}

export function CnyShield() {
  return (
    <span className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-md px-1.5 py-0.5 text-xs font-bold text-appleLight-text dark:text-appleDark-text select-none">
      <span className="font-mono">50</span>
      <span className="text-amber-600 dark:text-amber-500 font-normal ml-0.5">¥</span>
    </span>
  );
}

export function StarsShield() {
  return (
    <span className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 rounded-full px-2 py-0.5 text-xs select-none">
      <span className="text-[10px] mx-[0.5px]">⭐️</span>
      <span className="text-[10px] mx-[0.5px]">⭐️</span>
      <span className="text-[10px] mx-[0.5px]">⭐️</span>
      <span className="text-[10px] mx-[0.5px]">⭐️</span>
      <span className="text-[10px] mx-[0.5px] opacity-25 grayscale">⭐️</span>
    </span>
  );
}

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
