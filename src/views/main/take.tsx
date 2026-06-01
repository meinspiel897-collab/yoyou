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
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const [visibleLength, setVisibleLength] = useState(0);

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

  // Первоначальное заполнение редактора, если title прилетает сверху
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== title) {
      editorRef.current.innerHTML = title;
      setVisibleLength(editorRef.current.textContent?.length || 0);
    }
  }, []);

  const saveCaretPosition = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        savedRange.current = range.cloneRange();
      }
    }
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const plainText = editorRef.current.textContent || "";
    
    if (plainText.length > 750) {
      // Жесткое ограничение на ввод текста
      triggerHaptic("heavy");
      editorRef.current.innerHTML = title; 
      return;
    }

    setVisibleLength(plainText.length);
    setTitle(html);
  };

  // Перехват кликов по кнопкам Плюс/Минус внутри живого счетчика
  const handleEditorClick = (e: React.MouseEvent) => {
    saveCaretPosition();
    const target = e.target as HTMLElement;

    if (target.classList.contains("shield-btn")) {
      e.preventDefault();
      e.stopPropagation();
      
      const valNode = target.parentElement?.querySelector(".shield-val");
      if (valNode) {
        triggerHaptic("light");
        let val = parseInt(valNode.textContent || "0", 10);
        if (target.classList.contains("btn-inc")) val += 1;
        if (target.classList.contains("btn-dec")) val -= 1;
        valNode.textContent = val.toString();
        handleEditorInput();
      }
    }
  };

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

    // Создаем компактный инлайн-чип
    const shield = document.createElement("span");
    shield.setAttribute("contenteditable", "false");
    shield.setAttribute("draggable", "true");
    shield.className = "inline-flex items-center select-none cursor-grab active:cursor-grabbing bg-neutral-100 dark:bg-neutral-800 text-appleLight-text dark:text-appleDark-text font-bold text-[11px] h-5 px-1.5 mx-0.5 rounded-md border border-neutral-300/30 dark:border-neutral-700/50 vertical-baseline align-baseline transform translate-y-[-1px] shadow-sm";

    if (type === "score") {
      shield.innerHTML = `⭐<span class="ml-1">${defaultData}</span>`;
    } else if (type === "counter") {
      shield.innerHTML = `
        <span class="shield-btn btn-dec opacity-40 hover:opacity-100 pr-1 cursor-pointer font-black text-xs">-</span>
        <span class="shield-val px-0.5 tabular-nums">${defaultData}</span>
        <span class="shield-btn btn-inc opacity-40 hover:opacity-100 pl-1 cursor-pointer font-black text-xs">+</span>
      `;
    } else if (type === "link") {
      shield.innerHTML = `🔗<span class="ml-1 font-medium underline underline-offset-2 opacity-90">${defaultData}</span>`;
    }

    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(shield);

      // Переносим курсор строго за вставленный элемент
      range.setStartAfter(shield);
      range.setEndAfter(shield);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    handleEditorInput();
  };

  const isFormValid = description.trim().length > 0 && visibleLength > 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      
      {/* СКРОЛЛ-ЗОНА КОНТЕНТА */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col space-y-5 scrollbar-none">
        
        {/* Шапка таба с Lottie-анимацией */}
        <div className="flex items-start space-x-3.5 px-1 min-h-[52px] select-none pt-1">
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
            {animationData ? (
              <Lottie animationData={animationData} loop={true} style={{ width: 24, height: 24 }} />
            ) : (
              <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
            )}
          </div>
          <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 leading-relaxed">
            Выдай свой самый лучший тейк! Напиши базу или кринж — пускай толпа решает, гений ты или «очередной зумер»
          </p>
        </div>

        {/* Поле: Тема тейка */}
        <div className="flex flex-col space-y-1.5">
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

        {/* Поле: Текст Тейка (ContentEditable имитирует оригинальный Textarea) */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
            Твой тейк
          </label>
          <div className="w-full min-h-[164px] bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-[24px] flex flex-col p-4 pb-12 transition-colors duration-200 relative">
            
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditorInput}
              onClick={handleEditorClick}
              onBlur={() => { saveCaretPosition(); setIsTyping?.(false); }}
              onKeyUp={saveCaretPosition}
              onMouseUp={saveCaretPosition}
              onFocus={() => setIsTyping?.(true)}
              className="w-full h-[116px] pr-2 text-sm font-medium text-appleLight-text dark:text-appleDark-text outline-none overflow-y-auto overflow-x-hidden leading-snug scrollbar-none select-text relative z-10"
              style={{ wordBreak: "break-word" }}
            />

            {/* Кастомный плейсхолдер */}
            {visibleLength === 0 && (
              <div className="absolute top-4 left-4 text-sm font-medium text-neutral-300 dark:text-neutral-600 pointer-events-none select-none z-0">
                Пиши всё, что думаешь...
              </div>
            )}
            
            {/* Кружок с плюсом в левом нижнем углу описания */}
            <button
              onClick={(e) => {
                e.preventDefault();
                saveCaretPosition();
                triggerHaptic("light");
                setIsShieldsOpen(true);
              }}
              className="absolute left-4 bottom-3.5 w-7 h-7 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 shadow-sm rounded-full flex items-center justify-center transition-all outline-none active:scale-90 z-20"
            >
              <span className="text-lg font-semibold text-neutral-500 dark:text-neutral-400 leading-none mt-[-2px]">+</span>
            </button>

            {/* Счетчик символов */}
            <span className="absolute right-4 bottom-3.5 text-[11px] font-bold text-neutral-400 dark:text-neutral-600 select-none tracking-wide z-20">
              {visibleLength}/750
            </span>
          </div>
        </div>

      </div>

      {/* ПЛАВАЮЩАЯ СТИЛЬНАЯ ШТОРКА ВЫБОРА ЩИТОВ */}
      {isShieldsOpen && (
        <>
          <div className="fixed inset-0 bg-black/10 dark:bg-black/20 z-50 backdrop-blur-[1px]" onClick={() => setIsShieldsOpen(false)} />
          
          <div className="fixed left-[15px] right-[15px] bottom-[15px] mx-auto w-[calc(100vw-30px)] max-w-[345px] bg-neutral-50 dark:bg-neutral-800 rounded-[24px] shadow-[0_16px_44px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_44px_rgba(0,0,0,0.55)] border border-neutral-200/40 dark:border-neutral-700/40 p-4 pt-11 z-50 animate-in slide-in-from-bottom-5 duration-200">
            
            {/* Заголовок по центру */}
            <h3 className="absolute top-3.5 left-4 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 select-none">
              Выбери шилд
            </h3>

            {/* Кнопка закрытия */}
            <button
              onClick={() => setIsShieldsOpen(false)}
              className="absolute right-3.5 top-3 w-7 h-7 bg-neutral-200/50 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-full flex items-center justify-center transition-all outline-none active:scale-90"
            >
              <img 
                src="/icons/cross.png" 
                alt="Закрыть" 
                className="w-2.5 h-2.5 object-contain block dark:brightness-0 dark:invert opacity-60"
              />
            </button>
            
            {/* Предпоказ щитов 2х2 */}
            <div className="grid grid-cols-2 gap-2.5">
              {AVAILABLE_SHIELDS.map((shield) => (
                <button
                  key={shield.id}
                  onClick={() => handleInsertShield(shield.type, shield.defaultData)}
                  className="flex items-center space-x-3 p-3 bg-white dark:bg-neutral-900 rounded-[16px] border border-neutral-200/50 dark:border-neutral-950/40 active:scale-[0.97] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all text-left"
                >
                  <span className="text-lg bg-neutral-100 dark:bg-neutral-800 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 select-none">
                    {shield.icon}
                  </span>
                  <span className="text-xs font-bold text-appleLight-text dark:text-appleDark-text select-none">
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
