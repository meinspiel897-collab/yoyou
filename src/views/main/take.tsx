"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { AVAILABLE_SHIELDS } from "./shields";

const Lottie = dynamic(() => import("lottie-light-react"), { ssr: false });

interface TakeViewProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  animationData: any;
  setIsTyping?: (typing: boolean) => void;
}

export default function TakeView({
  title,
  setTitle,
  description,
  setDescription,
  animationData,
  setIsTyping
}: TakeViewProps) {
  const [isShieldsOpen, setIsShieldsOpen] = useState(false);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);

  const triggerHaptic = (style: "light" | "medium" | "heavy") => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try {
          anyWindow.Telegram.WebApp.HapticFeedback.impactOccurred(style);
        } catch (e) {}
      }
    }
  };

  // Сохраняем позицию курсора при любых изменениях и потере фокуса
  const saveCaretPosition = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      // Проверяем, что курсор находится именно внутри нашего редактора
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        savedRange.current = range.cloneRange();
      }
    }
  };

  const handleEditorChange = () => {
    if (!editorRef.current) return;
    const htmlContent = editorRef.current.innerHTML;
    const textContent = editorRef.current.textContent || "";
    
    setIsEditorEmpty(textContent.trim().length === 0 && !htmlContent.includes("<span"));
    setDescription(htmlContent); // Сохраняем HTML структуру с чипами в стейт
  };

  // Делегирование кликов для интерактива счетчика внутри редактора [- 0 +]
  const handleEditorClick = (e: React.MouseEvent) => {
    saveCaretPosition();
    const target = e.target as HTMLElement;
    
    if (target.classList.contains("count-btn")) {
      e.preventDefault();
      e.stopPropagation();
      
      const shieldEl = target.closest('[data-shield-type="counter"]');
      const valEl = shieldEl?.querySelector(".count-val");
      
      if (shieldEl && valEl) {
        triggerHaptic("light");
        let currentVal = parseInt(valEl.textContent || "0", 10);
        if (target.classList.contains("btn-inc")) currentVal += 1;
        if (target.classList.contains("btn-dec")) currentVal -= 1;
        
        valEl.textContent = currentVal.toString();
        shieldEl.setAttribute("data-shield-data", currentVal.toString());
        handleEditorChange();
      }
    }
  };

  // Механика вставки интерактивного щита на место курсора
  const handleInsertShield = (type: string, defaultData: string) => {
    triggerHaptic("medium");
    setIsShieldsOpen(false);
    setIsTyping?.(true);

    // Возвращаем фокус текстовому полю
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }

    // Создаем атомарный DOM-элемент чипа
    const shieldNode = document.createElement("span");
    shieldNode.setAttribute("data-shield-type", type);
    shieldNode.setAttribute("data-shield-data", defaultData);
    shieldNode.setAttribute("contenteditable", "false");
    shieldNode.setAttribute("draggable", "true");
    
    // Стилизация премиального чипа
    shieldNode.className = "inline-flex items-center inline-block align-middle px-2 py-0.5 mx-1 rounded-lg text-xs font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 select-none cursor-grab active:cursor-grabbing border border-neutral-300/40 dark:border-neutral-700/50 shadow-sm transition-transform duration-150 transform hover:scale-[1.02]";

    if (type === "score") {
      shieldNode.innerHTML = `⭐ <span class="ml-1">${defaultData}</span>`;
    } else if (type === "counter") {
      shieldNode.innerHTML = `
        <span class="count-btn btn-dec opacity-40 hover:opacity-100 px-1 cursor-pointer select-none font-medium text-sm mr-1">-</span>
        <span class="count-val tabular-nums">${defaultData}</span>
        <span class="count-btn btn-inc opacity-40 hover:opacity-100 px-1 cursor-pointer select-none font-medium text-sm ml-1">+</span>
      `;
    } else if (type === "link") {
      shieldNode.innerHTML = `🔗 <span class="ml-1 opacity-90 underline underline-offset-2">${defaultData}</span>`;
    }

    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(shieldNode);

      // Переставляем курсор сразу ПОСЛЕ добавленного чипа
      range.setStartAfter(shieldNode);
      range.setEndAfter(shieldNode);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    handleEditorChange();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      
      {/* КОНТЕНТ ВВОДА */}
      <div className="flex-1 px-5 pb-4 flex flex-col space-y-5 overflow-y-auto scrollbar-none">
        
        {/* Lottie-шапка */}
        <div className="flex items-start space-x-3.5 px-1 min-h-[52px] select-none pt-1 flex-shrink-0">
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
            {animationData ? (
              <Lottie animationData={animationData} loop={true} style={{ width: 24, height: 24 }} />
            ) : (
              <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
            )}
          </div>
          <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 leading-relaxed">
            Выскажи свой жесткий тейк! Разбавляй мысли интерактивными щитами, чтобы текст оживал при чтении 🫪
          </p>
        </div>

        {/* Поле: Заголовок */}
        <div className="flex flex-col space-y-1.5 flex-shrink-0">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 px-1 select-none">
            Суть тейка
          </label>
          <input
            type="text"
            placeholder="О чем речь? Кратко и емко..."
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 50))}
            onFocus={() => setIsTyping?.(true)}
            onBlur={() => setIsTyping?.(false)}
            className="w-full h-12 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[18px] px-4 text-sm font-medium text-appleLight-text dark:text-appleDark-text placeholder-neutral-400 dark:placeholder-neutral-500 outline-none border border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 transition-colors"
          />
        </div>

        {/* Продвинутое поле ввода: Описание с поддержкой Щитов */}
        <div className="flex flex-col space-y-1.5 relative group flex-1">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 px-1 select-none">
            Аргументы и разбор
          </label>
          
          <div className="w-full flex-1 min-h-[160px] bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg rounded-[24px] p-4 pb-14 relative border border-transparent focus-within:border-neutral-200 dark:focus-within:border-neutral-800 transition-all duration-200 flex flex-col">
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorChange}
              onClick={handleEditorClick}
              onBlur={() => { saveCaretPosition(); setIsTyping?.(false); }}
              onKeyUp={saveCaretPosition}
              onMouseUp={saveCaretPosition}
              onFocus={() => setIsTyping?.(true)}
              className="w-full flex-1 bg-transparent outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text overflow-y-auto leading-relaxed select-text"
              style={{ wordBreak: "break-word" }}
            />
            
            {isEditorEmpty && (
              <div className="absolute top-4 left-4 text-sm font-medium text-neutral-400/70 dark:text-neutral-500/70 pointer-events-none select-none">
                Расширенное мнение. Добавляй щиты кнопкой ниже...
              </div>
            )}
            
            {/* Кнопка Плюс в левом нижнем углу самого блока описания */}
            <button
              onClick={(e) => {
                e.preventDefault();
                saveCaretPosition();
                triggerHaptic("light");
                setIsShieldsOpen(true);
              }}
              className="absolute left-4 bottom-4 w-7 h-7 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 shadow-md rounded-full flex items-center justify-center transition-all duration-200 outline-none active:scale-90 z-10"
            >
              <span className="text-lg font-semibold text-neutral-600 dark:text-neutral-300 leading-none mt-[-2px]">+</span>
            </button>
          </div>
        </div>

      </div>

      {/* ПАРИРУЮЩАЯ КАРМАННАЯ МОДАЛКА ДЛЯ ВЫБОРА ЩИТОВ */}
      {isShieldsOpen && (
        <>
          {/* Полупрозрачный задник для изоляции тапов */}
          <div className="fixed inset-0 bg-black/5 dark:bg-black/10 z-50 backdrop-blur-[1px]" onClick={() => setIsShieldsOpen(false)} />
          
          <div className="fixed left-[15px] right-[15px] bottom-[15px] bg-white dark:bg-neutral-800 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-neutral-100 dark:border-neutral-700/40 p-4 pt-12 z-50 animate-in slide-in-from-bottom-6 duration-200">
            
            {/* Кнопка закрытия (крестик) вверху справа */}
            <button
              onClick={() => setIsShieldsOpen(false)}
              className="absolute right-3.5 top-3.5 w-7 h-7 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-full flex items-center justify-center transition-all outline-none active:scale-90"
            >
              <img 
                src="/icons/cross.png" 
                alt="Закрыть" 
                className="w-2.5 h-2.5 object-contain block dark:brightness-0 dark:invert opacity-50 dark:opacity-70"
              />
            </button>
            
            {/* Сетка элементов из shields.tsx */}
            <div className="grid grid-cols-3 gap-3">
              {AVAILABLE_SHIELDS.map((shield) => (
                <button
                  key={shield.id}
                  onClick={() => handleInsertShield(shield.type, shield.defaultData)}
                  className="flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-900 rounded-[20px] border border-neutral-200/40 dark:border-neutral-700/30 active:scale-[0.95] hover:bg-neutral-100/50 dark:hover:bg-neutral-950/50 transition-all"
                >
                  <span className="text-xl mb-1.5 select-none">{shield.icon}</span>
                  <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 select-none">
                    {shield.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ФИКСИРОВАННЫЙ ПОДВАЛ (ФИНАЛЬНАЯ КНОПКА) */}
      <div className="px-5 pb-8 pt-6 flex flex-col items-center relative z-40 bg-white dark:bg-neutral-900 flex-shrink-0 select-none">
        <button
          disabled={!title.trim() || isEditorEmpty}
          className={`w-full h-14 rounded-full font-bold text-sm transition-all duration-150 outline-none flex items-center justify-center ${
            title.trim() && !isEditorEmpty
              ? "bg-[#FC062D] text-white active:scale-[0.98] cursor-pointer" 
              : "bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg text-appleLight-text/30 dark:text-appleDark-text/30 cursor-default"
          }`}
        >
          Закинуть в тренды
        </button>
      </div>

    </div>
  );
}
