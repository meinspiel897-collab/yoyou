"use client";

import React from "react";

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
}

// Названия чистые, без эмодзи (они отрендерятся в превью сами)
export const AVAILABLE_SHIELDS: ShieldConfig[] = [
  { id: "counter", label: "Счетчик" },
  { id: "weather", label: "Погода" },
  { id: "percentage", label: "Проценты" },
  { id: "battery", label: "Батарея" },
  { id: "usd", label: "Доллары" },
  { id: "rub", label: "Рубли" },
  { id: "cny", label: "Юани" },
  { id: "stars", label: "Звезды" },
];

// Кроссплатформенный закругленный шрифт-стек (iOS использует родной SF Pro Rounded, Android/остальные — качественные закругленные фолбеки)
const ROUNDED_FONT = "font-family: ui-rounded, 'SF Pro Rounded', 'Nunito', 'Comfortaa', system-ui, -apple-system, sans-serif;";

export function getShieldHtml(type: ShieldType): string {
  // Без контура, увеличенные отступы, крупнее текст, благородный сплошной наливной цвет
  const baseClass = "inline-flex items-center inline-baseline bg-neutral-200/70 dark:bg-neutral-800 rounded-full px-3.5 py-1 mx-1.5 text-[13px] font-medium select-none text-appleLight-text dark:text-appleDark-text align-middle transition-all duration-150 transform scale-[0.98] select-none";
  const rectClass = "inline-flex items-center inline-baseline bg-neutral-200/70 dark:bg-neutral-800 rounded-xl px-3 py-1 mx-1.5 text-[13px] font-medium text-appleLight-text dark:text-appleDark-text align-middle transition-all duration-150 select-none";

  switch (type) {
    case "counter":
      return `<span contenteditable="false" data-shield-type="counter" class="${baseClass}" style="${ROUNDED_FONT}">
        <button data-shield-action="dec" class="w-5 h-5 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full active:scale-75 outline-none font-mono text-xs mr-1">-</button>
        <span contenteditable="true" inputmode="numeric" data-shield-value="count" class="mx-1 min-w-[14px] text-center font-bold font-mono text-[#FC062D] outline-none">5</span>
        <button data-shield-action="inc" class="w-5 h-5 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full active:scale-75 outline-none font-mono text-xs ml-1">+</button>
      </span>`;
      
    case "weather":
      return `<span contenteditable="false" data-shield-type="weather" class="${baseClass}" style="${ROUNDED_FONT}">
        <span data-shield-value="icon" class="mr-1.5 text-xs">☀️</span>
        <span contenteditable="true" data-shield-value="temp" class="font-bold outline-none focus:text-[#FC062D]">+22°C</span>
      </span>`;
      
    case "percentage":
      return `<span contenteditable="false" data-shield-type="percentage" class="${baseClass}" style="${ROUNDED_FONT}">
        <span contenteditable="true" inputmode="numeric" data-shield-value="input" class="outline-none min-w-[16px] font-bold text-center focus:text-[#FC062D]">85</span>
        <span class="text-neutral-400 dark:text-neutral-500 font-normal ml-0.5">%</span>
      </span>`;
      
    case "battery":
      return `<span contenteditable="false" data-shield-type="battery" class="${baseClass}" style="${ROUNDED_FONT}">
        <div class="w-4 h-2.5 bg-neutral-300 dark:bg-neutral-700 rounded-[3px] p-[1px] mr-1.5 flex items-center relative flex-shrink-0">
          <div data-shield-value="bar" class="h-full rounded-[1.5px] bg-emerald-500 transition-all duration-300" style="width: 100%;"></div>
          <div class="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1px] h-0.5 bg-neutral-400 dark:bg-neutral-600 rounded-r-[0.5px]"></div>
        </div>
        <span contenteditable="true" inputmode="numeric" data-shield-value="text" class="font-bold text-[11px] outline-none focus:text-[#FC062D]">100%</span>
      </span>`;
      
    case "usd":
      return `<span contenteditable="false" data-shield-type="usd" class="${rectClass}" style="${ROUNDED_FONT}">
        <span class="text-emerald-500 mr-1 font-semibold">$</span>
        <span contenteditable="true" inputmode="numeric" data-shield-value="input" class="outline-none min-w-[12px] font-bold focus:text-[#FC062D]">100</span>
      </span>`;
      
    case "rub":
      return `<span contenteditable="false" data-shield-type="rub" class="${rectClass}" style="${ROUNDED_FONT}">
        <span contenteditable="true" inputmode="numeric" data-shield-value="input" class="outline-none min-w-[12px] font-bold focus:text-[#FC062D]">500</span>
        <span class="text-neutral-400 dark:text-neutral-500 font-normal ml-1">₽</span>
      </span>`;
      
    case "cny":
      return `<span contenteditable="false" data-shield-type="cny" class="${rectClass}" style="${ROUNDED_FONT}">
        <span contenteditable="true" inputmode="numeric" data-shield-value="input" class="outline-none min-w-[12px] font-bold focus:text-[#FC062D]">50</span>
        <span class="text-amber-600 dark:text-amber-500 font-normal ml-1">¥</span>
      </span>`;
      
    case "stars":
      return `<span contenteditable="false" data-shield-type="stars" class="inline-flex items-center bg-neutral-200/70 dark:bg-neutral-800 rounded-full px-3 py-1 mx-1.5 align-middle transform scale-[0.98]">
        <button data-star-idx="1" class="text-xs transition-all mx-[1px] outline-none">⭐️</button>
        <button data-star-idx="2" class="text-xs transition-all mx-[1px] outline-none">⭐️</button>
        <button data-star-idx="3" class="text-xs transition-all mx-[1px] outline-none">⭐️</button>
        <button data-star-idx="4" class="text-xs transition-all mx-[1px] outline-none">⭐️</button>
        <button data-star-idx="5" class="text-xs transition-all mx-[1px] opacity-25 grayscale outline-none">⭐️</button>
      </span>`;
      
    default:
      return "";
  }
}

/* ==========================================
   КОМПОНЕНТЫ ПРЕДПРОСМОТРА БЕЗ КАРТОЧЕК
   ========================================== */

const previewStyle = { fontFamily: "ui-rounded, 'SF Pro Rounded', 'Nunito', sans-serif" };

export function CounterShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-200/70 dark:bg-neutral-800 rounded-full px-3.5 py-1 text-[13px] font-medium text-appleLight-text dark:text-appleDark-text select-none">
      <span className="w-5 h-5 flex items-center justify-center opacity-30 text-xs mr-1">-</span>
      <span className="mx-1 font-bold text-[#FC062D]">5</span>
      <span className="w-5 h-5 flex items-center justify-center opacity-30 text-xs ml-1">+</span>
    </span>
  );
}

export function WeatherShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-200/70 dark:bg-neutral-800 rounded-full px-3.5 py-1 text-[13px] font-bold text-appleLight-text dark:text-appleDark-text select-none">
      <span className="mr-1.5 text-xs">☀️</span>
      <span>+22°C</span>
    </span>
  );
}

export function PercentageShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-200/70 dark:bg-neutral-800 rounded-full px-3.5 py-1 text-[13px] font-bold text-appleLight-text dark:text-appleDark-text select-none">
      <span>85</span>
      <span className="text-neutral-400 dark:text-neutral-500 font-normal ml-0.5">%</span>
    </span>
  );
}

export function BatteryShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-200/70 dark:bg-neutral-800 rounded-full px-3.5 py-1 text-[13px] font-bold text-appleLight-text dark:text-appleDark-text select-none">
      <div className="w-4 h-2.5 bg-neutral-300 dark:bg-neutral-700 rounded-[3px] p-[1px] mr-1.5 flex items-center relative">
        <div className="h-full rounded-[1.5px] bg-emerald-500 w-full" />
      </div>
      <span className="text-[11px]">100%</span>
    </span>
  );
}

export function UsdShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-200/70 dark:bg-neutral-800 rounded-xl px-3 py-1 text-[13px] font-bold text-appleLight-text dark:text-appleDark-text select-none">
      <span className="text-emerald-500 mr-1 font-semibold">$</span>
      <span>100</span>
    </span>
  );
}

export function RubShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-200/70 dark:bg-neutral-800 rounded-xl px-3 py-1 text-[13px] font-bold text-appleLight-text dark:text-appleDark-text select-none">
      <span>500</span>
      <span className="text-neutral-400 dark:text-neutral-500 font-normal ml-1">₽</span>
    </span>
  );
}

export function CnyShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-200/70 dark:bg-neutral-800 rounded-xl px-3 py-1 text-[13px] font-bold text-appleLight-text dark:text-appleDark-text select-none">
      <span>50</span>
      <span className="text-amber-600 dark:text-amber-500 font-normal ml-1">¥</span>
    </span>
  );
}

export function StarsShield() {
  return (
    <span className="inline-flex items-center bg-neutral-200/70 dark:bg-neutral-800 rounded-full px-3 py-1 text-xs select-none">
      <span className="mx-[1px]">⭐️</span>
      <span className="mx-[1px]">⭐️</span>
      <span className="mx-[1px]">⭐️</span>
      <span className="mx-[1px]">⭐️</span>
      <span className="mx-[1px] opacity-25 grayscale">⭐️</span>
    </span>
  );
}

export function RenderShield({ type }: { type: ShieldType }) {
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
