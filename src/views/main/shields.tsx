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

// Кроссплатформенный закругленный шрифт-стек, применяющийся ко всем символам
const ROUNDED_FONT = "font-family: ui-rounded, 'SF Pro Rounded', 'Nunito', system-ui, sans-serif;";

export function getShieldHtml(type: ShieldType): string {
  // Базовые стили: сочные цвета из iOS-палитры, белый/светло-серый текст, увеличенный размер
  const baseClass = "inline-flex items-center inline-baseline bg-neutral-900/90 dark:bg-neutral-800 text-white rounded-full px-3.5 py-1.5 mx-1 text-[13px] font-medium select-none align-middle transition-all duration-150 select-none max-w-full";
  const rectClass = "inline-flex items-center inline-baseline bg-neutral-900/90 dark:bg-neutral-800 text-white rounded-2xl px-4 py-1.5 mx-1 text-[13px] font-medium align-middle transition-all duration-150 select-none max-w-full";

  switch (type) {
    case "counter":
      return `<span contenteditable="false" data-shield-type="counter" class="${baseClass} !pl-1.5 !pr-1.5 gap-2" style="${ROUNDED_FONT}">
        <button data-shield-action="dec" class="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-90 rounded-full outline-none transition-all text-white text-sm font-bold select-none" style="${ROUNDED_FONT}">−</button>
        <span contenteditable="true" inputmode="numeric" data-shield-value="count" class="min-w-[16px] text-center font-bold text-white outline-none focus:text-neutral-300 select-text" style="${ROUNDED_FONT}">5</span>
        <button data-shield-action="inc" class="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-90 rounded-full outline-none transition-all text-white text-sm font-bold select-none" style="${ROUNDED_FONT}">+</button>
      </span>`;
      
    case "weather":
      return `<span contenteditable="false" data-shield-type="weather" class="${baseClass}" style="${ROUNDED_FONT}">
        <span class="mr-1.5 text-sm select-none">☀️</span>
        <span contenteditable="true" data-shield-value="temp" class="font-bold text-white outline-none focus:text-neutral-300 select-text" style="${ROUNDED_FONT}">+22°C</span>
      </span>`;
      
    case "percentage":
      return `<span contenteditable="false" data-shield-type="percentage" class="${baseClass}" style="${ROUNDED_FONT}">
        <span contenteditable="true" inputmode="numeric" data-shield-value="input" class="outline-none min-w-[16px] font-bold text-center text-white focus:text-neutral-300 select-text" style="${ROUNDED_FONT}">85</span>
        <span contenteditable="false" class="text-neutral-400 font-bold ml-0.5 select-none" style="${ROUNDED_FONT}">%</span>
      </span>`;
      
    case "battery":
      return `<span contenteditable="false" data-shield-type="battery" class="${baseClass}" style="${ROUNDED_FONT}">
        <div class="w-4 h-2.5 bg-white/20 rounded-[4px] p-[1px] mr-2 flex items-center relative flex-shrink-0 select-none">
          <div data-shield-value="bar" class="h-full rounded-[2px] bg-emerald-400 transition-all duration-300" style="width: 100%;"></div>
          <div class="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1px] h-0.5 bg-white/40 rounded-r-[1px]"></div>
        </div>
        <span contenteditable="true" inputmode="numeric" data-shield-value="text" class="font-bold text-[12px] text-white outline-none focus:text-neutral-300 select-text" style="${ROUNDED_FONT}">100%</span>
      </span>`;
      
    case "usd":
      return `<span contenteditable="false" data-shield-type="usd" class="${rectClass}" style="${ROUNDED_FONT}">
        <span contenteditable="false" class="text-emerald-400 mr-1.5 font-bold select-none" style="${ROUNDED_FONT}">$</span>
        <span contenteditable="true" inputmode="numeric" data-shield-value="input" class="outline-none min-w-[12px] font-bold text-white focus:text-neutral-300 select-text" style="${ROUNDED_FONT}">100</span>
      </span>`;
      
    case "rub":
      return `<span contenteditable="false" data-shield-type="rub" class="${rectClass}" style="${ROUNDED_FONT}">
        <span contenteditable="true" inputmode="numeric" data-shield-value="input" class="outline-none min-w-[12px] font-bold text-white focus:text-neutral-300 select-text" style="${ROUNDED_FONT}">500</span>
        <span contenteditable="false" class="text-neutral-300 font-bold ml-1.5 select-none" style="${ROUNDED_FONT}">₽</span>
      </span>`;
      
    case "cny":
      return `<span contenteditable="false" data-shield-type="cny" class="${rectClass}" style="${ROUNDED_FONT}">
        <span contenteditable="true" inputmode="numeric" data-shield-value="input" class="outline-none min-w-[12px] font-bold text-white focus:text-neutral-300 select-text" style="${ROUNDED_FONT}">50</span>
        <span contenteditable="false" class="text-amber-400 font-bold ml-1.5 select-none" style="${ROUNDED_FONT}">¥</span>
      </span>`;
      
    case "stars":
      return `<span contenteditable="false" data-shield-type="stars" class="inline-flex items-center bg-neutral-900/90 dark:bg-neutral-800 rounded-full px-3.5 py-2 mx-1 align-middle transition-all select-none">
        <button data-star-idx="1" class="text-xs transition-all mx-[2px] outline-none">⭐️</button>
        <button data-star-idx="2" class="text-xs transition-all mx-[2px] outline-none">⭐️</button>
        <button data-star-idx="3" class="text-xs transition-all mx-[2px] outline-none">⭐️</button>
        <button data-star-idx="4" class="text-xs transition-all mx-[2px] outline-none">⭐️</button>
        <button data-star-idx="5" class="text-xs transition-all mx-[2px] opacity-25 grayscale outline-none">⭐️</button>
      </span>`;
      
    default:
      return "";
  }
}

/* ==========================================
   КОМПОНЕНТЫ ДЛЯ ЭКРАНА ВИДЖЕТОВ
   ========================================== */

const previewStyle = { fontFamily: "ui-rounded, 'SF Pro Rounded', system-ui, sans-serif" };

export function CounterShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-900 dark:bg-neutral-800 text-white rounded-full px-1.5 py-1.5 text-[13px] font-medium select-none gap-2">
      <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full text-xs font-bold opacity-40">−</span>
      <span className="min-w-[16px] text-center font-bold">5</span>
      <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full text-xs font-bold opacity-40">+</span>
    </span>
  );
}

export function WeatherShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-900 dark:bg-neutral-800 text-white rounded-full px-4 py-2 text-[13px] font-bold select-none">
      <span className="mr-1.5 text-sm">☀️</span>
      <span>+22°C</span>
    </span>
  );
}

export function PercentageShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-900 dark:bg-neutral-800 text-white rounded-full px-4 py-2 text-[13px] font-bold select-none">
      <span>85</span>
      <span className="text-neutral-400 font-bold ml-0.5">%</span>
    </span>
  );
}

export function BatteryShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-900 dark:bg-neutral-800 text-white rounded-full px-4 py-2 text-[13px] font-bold select-none">
      <div className="w-4 h-2.5 bg-white/20 rounded-[4px] p-[1px] mr-2 flex items-center relative">
        <div className="h-full rounded-[2px] bg-emerald-400 w-full" />
      </div>
      <span className="text-[12px]">100%</span>
    </span>
  );
}

export function UsdShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-900 dark:bg-neutral-800 text-white rounded-2xl px-4 py-2 text-[13px] font-bold select-none">
      <span className="text-emerald-400 mr-1.5 font-bold">$</span>
      <span>100</span>
    </span>
  );
}

export function RubShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-900 dark:bg-neutral-800 text-white rounded-2xl px-4 py-2 text-[13px] font-bold select-none">
      <span>500</span>
      <span className="text-neutral-300 font-bold ml-1.5">₽</span>
    </span>
  );
}

export function CnyShield() {
  return (
    <span style={previewStyle} className="inline-flex items-center bg-neutral-900 dark:bg-neutral-800 text-white rounded-2xl px-4 py-2 text-[13px] font-bold select-none">
      <span>50</span>
      <span className="text-amber-400 font-bold ml-1.5">¥</span>
    </span>
  );
}

export function StarsShield() {
  return (
    <span className="inline-flex items-center bg-neutral-900 dark:bg-neutral-800 rounded-full px-4 py-2.5 text-xs select-none">
      <span className="mx-[2px]">⭐️</span>
      <span className="mx-[2px]">⭐️</span>
      <span className="mx-[2px]">⭐️</span>
      <span className="mx-[2px]">⭐️</span>
      <span className="mx-[2px] opacity-25 grayscale">⭐️</span>
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
