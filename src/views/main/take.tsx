"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { getShieldHtml, ShieldType } from "./shields";

const Lottie = dynamic(() => import("lottie-light-react"), { ssr: false });

interface TakeViewProps {
  title: string; // В архитектуре new.tsx title отвечает за ТЕКСТ ТЕЙКА
  setTitle: (val: string) => void;
  description: string; // В архитектуре new.tsx description отвечает за ТЕМУ ТЕЙКА
  setDescription: (val: string) => void;
  animationData: any;
  setIsTyping?: (typing: boolean) => void;
  onAddShieldClick?: () => void;
  controlRef?: React.MutableRefObject<{ insertShield: (type: ShieldType) => void } | null>;
}

export default function TakeView({
  title,
  setTitle,
  description,
  setDescription,
  animationData,
  setIsTyping,
  onAddShieldClick,
  controlRef,
}: TakeViewProps) {
  
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const triggerHaptic = (style: "light" | "medium" | "heavy") => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try { anyWindow.Telegram.WebApp.HapticFeedback.impactOccurred(style); } catch (e) {}
      }
    }
  };

  // Метод сохранения позиции каретки курсора перед потерей фокуса (при открытии модалки)
  const saveCaretPosition = () => {
    if (typeof window === "undefined") return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Главная функция: вживление шилда прямо в позицию курсора
  const insertShield = (type: ShieldType) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    const sel = window.getSelection();
    if (!sel) return;

    // Восстанавливаем сохраненный курсор, если он был
    if (savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }

    const range = sel.getRangeAt(0);
    range.deleteContents();

    // Создаем DOM-элемент из HTML-строки шилда
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = getShieldHtml(type);
    const shieldNode = tempDiv.firstElementChild;

    if (shieldNode) {
      range.insertNode(shieldNode);
      
      // Перемещаем курсор сразу ЗА добавленный шилд
      range.setStartAfter(shieldNode);
      range.setEndAfter(shieldNode);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    // Синхронизируем HTML-содержимое со стейтом
    setTitle(editor.innerHTML);
    savedRangeRef.current = range.cloneRange();
  };

  // Прокидываем метод в родительский new.tsx через controlRef channel
  useEffect(() => {
    if (controlRef) {
      controlRef.current = { insertShield };
    }
    return () => {
      if (controlRef) controlRef.current = null;
    };
  }, [controlRef, title]);

  // ДЕЛЕГИРОВАНИЕ СОБЫТИЙ: Обработка кликов внутри интерактивных шилдов
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const shieldContainer = target.closest("[data-shield-type]");
    if (!shieldContainer) return;

    const type = shieldContainer.getAttribute("data-shield-type") as ShieldType;

    // 1. Счетчик [- 5 +]
    if (type === "counter") {
      const action = target.getAttribute("data-shield-action");
      if (action) {
        e.preventDefault();
        triggerHaptic("light");
        const valNode = shieldContainer.querySelector('[data-shield-value="count"]') as HTMLElement;
        if (valNode) {
          let current = parseInt(valNode.innerText) || 0;
          if (action === "inc") current++;
          if (action === "dec") current--;
          valNode.innerText = current.toString();
        }
      }
    }

    // 2. Погода
    if (type === "weather") {
      e.preventDefault();
      triggerHaptic("light");
      const tempNode = shieldContainer.querySelector('[data-shield-value="temp"]') as HTMLElement;
      const iconNode = shieldContainer.querySelector('[data-shield-value="icon"]') as HTMLElement;
      if (tempNode && iconNode) {
        let curTemp = parseInt(tempNode.innerText) || 22;
        let nextTemp = curTemp === 22 ? 15 : curTemp === 15 ? -4 : 22;
        tempNode.innerText = nextTemp > 0 ? `+${nextTemp}°C` : `${nextTemp}°C`;
        iconNode.innerText = nextTemp > 0 ? "☀️" : "❄️";
      }
    }

    // 3. Батарея
    if (type === "battery") {
      e.preventDefault();
      triggerHaptic("light");
      const barNode = shieldContainer.querySelector('[data-shield-value="bar"]') as HTMLElement;
      const textNode = shieldContainer.querySelector('[data-shield-value="text"]') as HTMLElement;
      if (barNode && textNode) {
        let curPct = parseInt(textNode.innerText) || 100;
        let nextPct = curPct === 100 ? 42 : curPct === 42 ? 12 : 100;
        textNode.innerText = `${nextPct}%`;
        barNode.style.width = `${nextPct}%`;
        
        if (nextPct <= 20) {
          barNode.className = "h-full rounded-[0.5px] bg-red-500 transition-all duration-300";
        } else if (nextPct <= 50) {
          barNode.className = "h-full rounded-[0.5px] bg-amber-500 transition-all duration-300";
        } else {
          barNode.className = "h-full rounded-[0.5px] bg-emerald-500 transition-all duration-300";
        }
      }
    }

    // 4. Звезды
    const starIdx = target.getAttribute("data-star-idx");
    if (type === "stars" && starIdx) {
      e.preventDefault();
      triggerHaptic("light");
      const idx = parseInt(starIdx);
      const buttons = shieldContainer.querySelectorAll("[data-star-idx]");
      buttons.forEach((btn) => {
        const bHtml = btn as HTMLElement;
        const bIdx = parseInt(bHtml.getAttribute("data-star-idx") || "0");
        if (bIdx <= idx) {
          bHtml.className = "text-[10px] transition-all mx-[0.5px] opacity-100 outline-none";
        } else {
          bHtml.className = "text-[10px] transition-all mx-[0.5px] opacity-25 grayscale outline-none";
        }
      });
    }

    // При любых интерактивных изменениях пушим финальный HTML обратно в стейт
    if (editorRef.current) {
      setTitle(editorRef.current.innerHTML);
    }
  };

  const isFormValid = description.trim().length > 0 && title.trim().length > 0;

  // Инлайн-хак для стилизации placeholder внутри contentEditable
  const placeholderStyles = `
    .editor-placeholder:empty::before {
      content: attr(data-placeholder);
      color: #a3a3a3;
    }
    .dark .editor-placeholder:empty::before {
      content: attr(data-placeholder);
      color: #525252;
    }
  `;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: placeholderStyles }} />
      
      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col space-y-5 scrollbar-none">
        
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

        {/* Поле: Текст Тейка (ContentEditable Движок) */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
            Твой тейк
          </label>
          <div className="w-full min-h-[164px] bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-[24px] flex flex-col p-4 pb-12 transition-colors duration-200 relative">
            
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Пиши всё, что думаешь..."
              onFocus={() => setIsTyping?.(true)}
              onBlur={() => {
                setIsTyping?.(false);
                saveCaretPosition(); // Запоминаем каретку при уходе фокуса на модалку
              }}
              onInput={(e) => setTitle(e.currentTarget.innerHTML)}
              onClick={handleEditorClick}
              className="editor-placeholder flex-1 bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text resize-none overflow-y-auto min-h-[106px] pr-2 leading-snug scrollbar-none"
            />
            
            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                saveCaretPosition();
                if (onAddShieldClick) onAddShieldClick();
              }}
              className="absolute left-4 bottom-3 w-8 h-8 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-90 rounded-full flex items-center justify-center transition-all outline-none z-10"
            >
              <img 
                src="/icons/add.png" 
                alt="Добавить шилд" 
                className="w-4 h-4 object-contain block dark:brightness-0 dark:invert"
              />
            </button>

            <span className="absolute right-4 bottom-3.5 text-[11px] font-bold text-neutral-400 dark:text-neutral-600 select-none tracking-wide">
              Символов: {editorRef.current?.innerText.length || 0}/750
            </span>
          </div>
        </div>

      </div>

      <div className="px-5 pb-8 pt-9 flex flex-col items-center relative z-40 bg-white dark:bg-neutral-900 flex-shrink-0 select-none">
        <div className="w-full relative flex flex-col items-center">
          <div className="absolute -top-7 left-0 right-0 bg-neutral-600 dark:bg-neutral-800 rounded-t-[20px] pt-2 pb-10 text-center pointer-events-none z-10">
            <p className="text-[11px] font-normal text-white dark:text-neutral-200 tracking-wide px-4">
              Твой тейк отправится прямо в общую ленту трендов
            </p>
          </div>

          <div
            onClick={() => isFormValid && triggerHaptic("medium")}
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
