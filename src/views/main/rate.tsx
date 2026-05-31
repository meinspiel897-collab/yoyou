"use client";

import React from "react";
import dynamic from "next/dynamic";

// Облегченный плеер Lottie без SSR
const Lottie = dynamic(() => import("lottie-light-react"), { ssr: false });

interface RateViewProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  animationData: any;
}

export default function RateView({
  title,
  setTitle,
  description,
  setDescription,
  animationData,
}: RateViewProps) {
  return (
    <div className="flex flex-col space-y-4 animate-fadeIn">
      
      {/* Сочное описание с Lottie */}
      <div className="flex items-start space-x-3.5 px-1 min-h-[52px] select-none">
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
          Йоу, оценивай все что душа пожелает! Введи название и описание, а наш ИИ сам подгонит классную картиночку. Не зашло - поменяешь в один тап
        </p>
      </div>

      {/* Поле: Название */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
          Имя тут
        </label>
        <div className="w-full h-11 bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-full flex items-center px-4 transition-colors duration-200">
          <input
            type="text"
            placeholder="Что угодно"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 20))}
            maxLength={20}
            className="flex-1 h-full bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text placeholder-neutral-300 dark:placeholder-neutral-600"
          />
          <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-600 ml-2 select-none tracking-wide">
            {title.length}/20
          </span>
        </div>
      </div>

      {/* Поле: Описание */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
          Описание здесь
        </label>
        <div className="w-full min-h-[78px] bg-transparent border border-neutral-600 dark:border-neutral-800 focus-within:border-[#FC062D] rounded-[20px] flex items-start p-3.5 transition-colors duration-200 relative">
          <textarea
            placeholder="Что угодно"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 130))}
            maxLength={130}
            rows={3}
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-appleLight-text dark:text-appleDark-text placeholder-neutral-300 dark:placeholder-neutral-600 resize-none overflow-y-auto h-[48px] pr-14 leading-tight scrollbar-none"
          />
          <span className="absolute right-4 bottom-3.5 text-[11px] font-bold text-neutral-400 dark:text-neutral-600 select-none tracking-wide">
            {description.length}/130
          </span>
        </div>
      </div>

      {/* Поле: Картинки */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-normal text-neutral-400 dark:text-neutral-500 select-none">
          Картинка
        </label>
        <div className="grid grid-cols-3 gap-3 w-full">
          {[0, 1, 2].map((index) => (
            <div 
              key={index}
              className={`aspect-[3/4] w-full border border-neutral-600 dark:border-neutral-800 rounded-2xl flex items-center justify-center relative overflow-hidden select-none ${
                index !== 0 ? "bg-neutral-200 dark:bg-neutral-800 animate-pulse" : "bg-neutral-50/50 dark:bg-neutral-950/20"
              }`}
            >
              {index === 0 && (
                <img 
                  src="/icons/add.png" 
                  alt="Добавить" 
                  className="w-9 h-9 object-contain block dark:brightness-0 dark:invert opacity-25"
                />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
