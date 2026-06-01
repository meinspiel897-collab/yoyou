"use client";

import React from "react";

interface GridItem {
  id: string;
  type: "rate" | "take";
  title: string;
  description: string;
  imageUrl?: string;
  score?: number;
}

interface TrendsGridProps {
  isLoading?: boolean;
}

// Генерируем сочные моки
const MOCK_ITEMS: GridItem[] = [
  {
    id: "1",
    type: "rate",
    title: "Пацаны",
    description: "Четвертый сезон просто разрыв всего, Хоумлендер выдает исторический перформанс, смотреть всем",
    imageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&auto=format&fit=crop",
    score: 9.2,
  },
  {
    id: "2",
    type: "rate",
    title: "Cyberpunk 2077",
    description: "В 2026 году игра ощущается как абсолютный шедевр после всех патчей и Phantom Liberty",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop",
    score: 9.5,
  },
  {
    id: "3",
    type: "take",
    title: "iOS 18 устарела морально",
    description: "Жду полноценный стек дизайна iOS 26 с полным стеклянным неоморфизмом. Текущие виджеты Apple — это просто прошлый век, интерфейсы должны дышать и быть абсолютно чистыми от визуального мусора. Кто согласен, накидайте трендов",
    imageUrl: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "4",
    type: "rate",
    title: "Вкусно и точка",
    description: "Гранды стали какими-то сухими, а картошка черствеет за две минуты. Раньше было лучше",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop",
    score: 5.4,
  },
  {
    id: "5",
    type: "rate",
    title: "Dune: Part Two",
    description: "Визуал Вильнева — это чисто гипноз. Звук в IMAX заставляет зубы вибрировать, мастхэв",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop",
    score: 8.9,
  },
  {
    id: "6",
    type: "take",
    title: "О модерации контента в Mini Apps",
    description: "Ребята, если запускаете свои проекты, сразу думайте про клиентские фильтры для картинок. Наплыв неадекватов, желающих загрузить непотребства в ленту, начнется в первую же минуту после релиза на хайпе",
  },
];

export default function TrendsGrid({ isLoading = false }: TrendsGridProps) {
  const counterStyle = { fontFamily: "ui-rounded, 'SF Pro Rounded', system-ui, sans-serif" };

  // Рендерим скелетоны во время загрузки
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3.5 px-5 w-full auto-rows-max pb-24">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex flex-col space-y-2 ${i === 3 ? "col-span-2" : "col-span-1"}`}>
            <div className={`w-full ${i === 3 ? "aspect-[16/10]" : "aspect-[3/4]"} bg-neutral-200 dark:bg-neutral-800/60 rounded-[24px] animate-pulse`} />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800/60 rounded-full w-2/3 animate-pulse" />
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800/60 rounded-full w-full animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3.5 px-5 w-full auto-rows-max pb-24">
      {MOCK_ITEMS.map((item) => {
        const isTake = item.type === "take";

        return (
          <div
            key={item.id}
            className={`flex flex-col bg-white dark:bg-neutral-900/40 rounded-[28px] overflow-hidden p-3 relative group active:scale-[0.99] transition-transform duration-150 ${
              isTake ? "col-span-2" : "col-span-1"
            }`}
          >
            {/* Картинка (если есть) */}
            {item.imageUrl && (
              <div className={`w-full rounded-[20px] overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative ${
                isTake ? "aspect-[16/10]" : "aspect-[3/4]"
              }`}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                
                {/* Оценка (плашка сверху картинки для rate) */}
                {!isTake && item.score && (
                  <div 
                    className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-full"
                    style={counterStyle}
                  >
                    {item.score}
                  </div>
                )}
              </div>
            )}

            {/* Контент под картинкой */}
            <div className={`flex flex-col pt-2.5 px-1 relative ${!item.imageUrl ? "pt-1" : ""}`}>
              {/* Название */}
              <h3 className="text-xs font-bold text-appleLight-text dark:text-appleDark-text truncate pr-2">
                {item.title}
              </h3>

              {/* Описание с мягким градиентным затуханием */}
              <div className="relative mt-1 max-h-[48px] overflow-hidden mb-7">
                <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 leading-snug break-words">
                  {item.description}
                </p>
                {/* Маска затухания */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-neutral-900/100 to-transparent pointer-events-none" />
              </div>

              {/* Кнопка Посмотреть */}
              <div className="absolute bottom-0 left-1 right-1 flex justify-between items-center select-none border-none">
                <span className="text-[10px] font-bold text-[#FC062D] tracking-wide uppercase">
                  Посмотреть
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
