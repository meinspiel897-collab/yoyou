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
  setIsTyping,
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

  // Сохраняем положение каретки перед открытием шторки
  const saveCaretPosition = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        savedRange.current = range.cloneRange();
      }
    }
  };

  const handleEditorChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const text = editorRef.current.textContent || "";
    
    // Проверяем на пустоту с учетом вставленных элементов
    setIsEditorEmpty(text.trim().length === 0 && !html.includes("<span"));
    
    // Ограничиваем длину текста до 750 символов
    if (text.length > 750) {
      triggerHaptic("heavy");
      // Откатываем назад избыточный ввод
      editorRef.current.textContent = text.slice(0, 750);
      return;
    }
    
    setTitle(html);
  };

  // Интерактивный клик по счетчикам прямо внутри редактора [- 0 +]
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

  // Функция вставки выбранного шилда на место курсора
  const handleInsertShield = (type: string, defaultData: string) => {
    triggerHaptic("medium");
    setIsShieldsOpen(false);
    setIsTyping?.(true);

    if (editorRef.current) {
      editorRef.current.focus();
    }

    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }

    // Создаем атомарный DOM-узел чипа
    const shieldNode = document.createElement("span");
    shieldNode.setAttribute("data-shield-type", type);
    shieldNode.setAttribute("data-shield-data", defaultData);
    shieldNode.setAttribute("contenteditable", "false");
    shieldNode.setAttribute("draggable", "true");
    
    // Ультра-стильный яблочный дизайн токена
    shieldNode.className = "inline-flex items-center inline-block align-middle px-2 py-0.5 mx-1 rounded-md text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 select-none cursor-grab active:cursor-grabbing border border-neutral-300/50 dark:border-neutral-700/60 shadow-sm transition-transform transform hover:scale-[1.02]";

    if (type === "score") {
      shieldNode.innerHTML = `⭐ <span class="ml-1">${defaultData}</span>`;
    } else if (type === "counter") {
      shieldNode.innerHTML = `
        <span class="count-btn btn-dec opacity-40 hover:opacity-100 px-1 cursor-pointer select-none font-bold text-sm mr-1">-</span>
        <span class="count-val tabular-nums">${defaultData}</span>
        <span class="count-btn btn-inc opacity-40 hover:opacity-100 px-1 cursor-pointer select-none font-bold text-sm ml-1">+</span>
      `;
    } else if (type === "link") {
      shieldNode.innerHTML = `🔗 <span class="ml-1 opacity-90 underline underline-offset-2">${defaultData}</span>`;
    }

    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(shieldNode);

      // Двигаем курсор сразу за вставленный элемент
      range.setStartAfter(shieldNode);
      range.setEndAfter(shieldNode);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    handleEditorChange();
  };

  // Вычисляем чистый текст для счетчика символов
  const getCleanTextLength = () => {
    if (typeof window === "undefined" || !editorRef.current) return 0;
    return editorRef.current.textContent?.length || 0;
  };

  const isFormValid = description.trim().length > 0 && !isEditorEmpty;

  const handleMainButtonClick = () => {
    if (!isFormValid) return;
    triggerHaptic("medium");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      
      {/* СКРОЛЛ-ЗОНА КОНТЕНТА */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col space-y-5 scrollbar-none">
        
        {/* Шапка таба с Lottie-анимацией */}
        <div className="flex items-start space-x-3.5 px-1 min-h-[52px] select-none pt-1 flex-shrink-0">
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
            {animationData ? (
              <Lottie 
                animationData={animationData} 
                loop={true} 
                style={{ width: 24, height: 24 }}
              />
            ) : (
              <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
            )}
          </div>
          <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 leading-relaxed">
            Выдай свой самый лучший тейк! Напиши базу или кринж — пускай толпа решает, гений ты или «очередной зумер»
          </p>
        </div>

        {/* Поле: Тема тейка */}
        <div className="flex flex-col space-y-1.5 flex-shrink-0">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
            Тема тейка
          </label>
          <div className="w-full h-11 bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-full flex items-center px-4 transition-colors duration-200">
            <input
              type="text"
              placeholder="Добавь тейку заголовок"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 40))}
              maxLength={40}
              onFocus={() => setIsTyping?.(true)}
              onBlur={() => setIsTyping?.(false)}
              className="flex-1 h-full bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text placeholder-neutral-300 dark:placeholder-neutral-600"
            />
            <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-600 ml-2 select-none tracking-wide">
              {description.length}/40
            </span>
          </div>
        </div>

        {/* Поле: Твой Тейк (Продвинутый ContentEditable контейнер) */}
        <div className="flex flex-col space-y-1.5 flex-1 min-h-[164px]">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
            Твой тейк
          </label>
          <div className="w-full flex-1 bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-[24px] flex flex-col p-4 pb-12 transition-colors duration-200 relative">
            
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorChange}
              onClick={handleEditorClick}
              onFocus={() => setIsTyping?.(true)}
              onBlur={() => { saveCaretPosition(); setIsTyping?.(false); }}
              onKeyUp={saveCaretPosition}
              onMouseUp={saveCaretPosition}
              className="w-full flex-1 bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text overflow-y-auto pr-2 leading-snug scrollbar-none h-[116px] select-text"
              style={{ wordBreak: "break-word" }}
            />

            {isEditorEmpty && (
              <div className="absolute top-4 left-4 text-sm font-medium text-neutral-300 dark:text-neutral-600 pointer-events-none select-none">
                Пиши всё, что думаешь...
              </div>
            )}
            
            {/* Кнопка Плюс в левом нижнем углу инпута */}
            <button
              onClick={(e) => {
                e.preventDefault();
                saveCaretPosition();
                triggerHaptic("light");
                setIsShieldsOpen(true);
              }}
              className="absolute left-4 bottom-3.5 w-7 h-7 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300/30 dark:border-neutral-700/40 hover:bg-neutral-200 dark:hover:bg-neutral-700 shadow-sm rounded-full flex items-center justify-center transition-all outline-none active:scale-90 z-20"
            >
              <span className="text-lg font-medium text-neutral-500 dark:text-neutral-400 leading-none mt-[-2px]">+</span>
            </button>

            {/* Счетчик символов в правом нижнем углу */}
            <span className="absolute right-4 bottom-3.5 text-[11px] font-bold text-neutral-400 dark:text-neutral-600 select-none tracking-wide z-20">
              {getCleanTextLength()}/750
            </span>
          </div>
        </div>

      </div>

      {/* ПАРИРУЮЩИЙ КОМПАКТНЫЙ ОСТРОВОК (МОДАЛКА ВЫБОРА ШИТОВ) */}
      {isShieldsOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/10 dark:bg-black/20 z-50 backdrop-blur-[1px]" 
            onClick={() => setIsShieldsOpen(false)} 
          />
          
          <div className="fixed left-4 right-4 bottom-4 mx-auto w-[calc(100%-32px)] max-w-[360px] bg-white dark:bg-neutral-800 rounded-[22px] shadow-[0_12px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)] border border-neutral-200/50 dark:border-neutral-700/70 p-4 pt-11 z-50 animate-in slide-in-from-bottom-5 duration-200">
            
            {/* Заголовок модалки */}
            <h3 className="absolute left-4 top-3.5 text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-tight uppercase select-none">
              Выбери шилд
            </h3>

            {/* Крестик закрытия */}
            <button
              onClick={() => setIsShieldsOpen(false)}
              className="absolute right-3 top-3 w-6 h-6 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-full flex items-center justify-center transition-all outline-none active:scale-90"
            >
              <img 
                src="/icons/cross.png" 
                alt="Закрыть" 
                className="w-2 h-2 object-contain block dark:brightness-0 dark:invert opacity-40 dark:opacity-60"
              />
            </button>
            
            {/* Сетка Шилдов строго в 2 колонки */}
            <div className="grid grid-cols-2 gap-2.5">
              {AVAILABLE_SHIELDS.map((shield) => (
                <button
                  key={shield.id}
                  onClick={() => handleInsertShield(shield.type, shield.defaultData)}
                  className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-[14px] border border-neutral-200/40 dark:border-neutral-700/30 active:scale-[0.96] hover:bg-neutral-100/70 dark:hover:bg-neutral-950/40 transition-all text-left group"
                >
                  <span className="text-lg bg-white dark:bg-neutral-800 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm border border-neutral-200/30 dark:border-neutral-700/20 select-none group-active:scale-90 transition-transform">
                    {shield.icon}
                  </span>
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 select-none">
                    {shield.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ФИКСИРОВАННЫЙ ПОДВАЛ */}
      <div className="px-5 pb-8 pt-9 flex flex-col items-center relative z-40 bg-white dark:bg-neutral-900 flex-shrink-0 select-none">
        <div className="w-full relative flex flex-col items-center">
          <div className="absolute -top-7 left-0 right-0 bg-neutral-600 dark:bg-neutral-800 rounded-t-[20px] pt-2 pb-10 text-center pointer-events-none z-10">
            <p className="text-[11px] font-normal text-white dark:text-neutral-200 tracking-wide px-4">
              Твой тейк отправится прямо в общую ленту трендов
            </p>
          </div>

          <div
            onClick={handleMainButtonClick}
            className={`w-full h-14 rounded-full font-bold text-sm transition-all duration-150 outline-none flex items-center justify-center relative z-20 ${
              isFormValid 
                ? "bg-[#FC062D] text-white active:scale-[0.98] cursor-pointer" 
                : "bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg text-appleLight-text/30 dark:text-appleDark-text/30 cursor-default"
            }`}
          >
            <span>Закинуть в тренды</span>
          </div>
        </div>
      </div>

    </div>
  );
}
