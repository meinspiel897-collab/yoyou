"use client";

import React from "react";

interface GridItem {
  id: string;
  type: "rate" | "take";
  title: string;
  description: string;
  imageUrl?: string;
}

interface TrendsGridProps {
  isLoading?: boolean;
}

const MOCK_ITEMS: GridItem[] = [
  {
    id: "1",
    type: "rate",
    title: "Пацаны",
    description: "Четвертый сезон просто разрыв всего, Хоумлендер выдает исторический перформанс, смотреть всем без исключения.",
    imageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "2",
    type: "rate",
    title: "Cyberpunk 2077",
    description: "В 2026 году игра ощущается как абсолютный шедевр после всех патчей и шикарного Phantom Liberty.",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "3",
    type: "take",
    title: "iOS 18 устарела морально",
    description: "Жду полноценный стек дизайна iOS 26 с полным стеклянным неоморфизмом. Текущие виджеты Apple — это просто прошлый век, интерфейсы должны дышать и быть абсолютно чистыми от визуального мусора. Кто согласен, залетайте обсудить в комменты.",
  },
  {
    id: "4",
    type: "rate",
    title: "Вкусно и точка",
    description: "Гранды стали какими-то сухими, а картошка черствеет за две минуты. Раньше было лучше.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "5",
    type: "rate",
    title: "Dune: Part Two",
    description: "Визуал Вильнева — это чисто гипноз. Звук в IMAX заставляет зубы вибрировать, мастхэв.",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "6",
    type: "take",
    title: "О модерации контента в Mini Apps",
    description: "Ребята, если запускаете свои проекты, сразу думайте про клиентские фильтры для картинок. Наплыв неадекватов, желающих загрузить непотребства в ленту, начнется в первую же минуту после релиза на хайпе. Проверено.",
  },
];

export default function TrendsGrid({ isLoading = false }: TrendsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3.5 px-5 w-full auto-rows-max pb-24">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex flex-col space-y-2 ${i === 3 ? "col-span-2" : "col-span-1"}`}>
            <div className={`w-full ${i === 3 ? "h-32" : "aspect-[3/4]"} bg-neutral-200 dark:bg-neutral-800/60 rounded-[24px] animate-pulse`} />
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
            className={`flex flex-col bg-neutral-100/70 dark:bg-neutral-800/35 rounded-[28px] overflow-hidden p-3 relative group ${
              isTake ? "col-span-2 min-h-[110px]" : "col-span-1"
            }`}
          >
            {/* Картинка (только для обычных оценок) */}
            {!isTake && item.imageUrl && (
              <div className="w-full rounded-[20px] overflow-hidden bg-neutral-200 dark:bg-neutral-900 relative aspect-[3/4]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Вотермарка в стиле Threads (только для текстовых Тейков) */}
            {isTake && (
              <div className="absolute bottom-3 right-3 w-9 h-9 opacity-[0.06] dark:opacity-[0.03] pointer-events-none select-none">
                <img 
                  src="/icons/logo.png" 
                  alt="Watermark" 
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
            )}

            {/* Текстовый блок */}
            <div className="flex flex-col pt-2.5 px-0.5 relative">
              <h3 className="text-xs font-bold text-appleLight-text dark:text-appleDark-text truncate pr-4">
                {item.title}
              </h3>

              <div className="relative mt-1 max-h-[52px] overflow-hidden">
                <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 leading-snug break-words">
                  {item.description}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-neutral-100/70 dark:from-neutral-800/0 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
