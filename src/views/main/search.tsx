"use client";

interface SearchViewProps {
  searchQuery: string;
}

export default function SearchView({ searchQuery }: SearchViewProps) {
  // Массив из 3 элементов для рендера скелетонов
  const placeholders = Array.from({ length: 3 });

  return (
    <div className="w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-colors duration-300 px-5 pt-4 box-border overflow-y-auto">
      <div className="flex flex-col space-y-3 w-full">
        {placeholders.map((_, index) => (
          <div
            key={index}
            className="w-full h-14 bg-appleLight-secondaryBg dark:bg-appleDark-secondaryBg/40 rounded-2xl flex items-center p-2.5 box-border animate-pulse"
          >
            {/* Квадратик картинки слева */}
            <div className="w-9 h-9 bg-neutral-300 dark:bg-neutral-800 rounded-xl flex-shrink-0" />
            
            {/* Текстовая подсказка в состоянии загрузки */}
            <div className="flex-1 ml-3 flex flex-col justify-center space-y-1.5">
              <div className="w-2/3 h-3 bg-neutral-300 dark:bg-neutral-800 rounded-sm" />
              <div className="w-1/3 h-2 bg-neutral-300 dark:bg-neutral-800 rounded-sm opacity-60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
