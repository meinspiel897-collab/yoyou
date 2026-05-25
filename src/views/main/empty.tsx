"use client";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-6 select-none">
      <div className="flex flex-col items-center max-w-[260px] w-full">
        <img 
          src="/pictures/none.png" 
          alt="Ничего не найдено" 
          className="w-24 h-24 object-contain mb-4 opacity-90"
        />
        <h2 className="text-lg font-bold tracking-tight text-center text-appleLight-text dark:text-appleDark-text">
          Тут 100 проц что-то есть
        </h2>
        <p className="text-sm font-medium text-center text-appleLight-text/85 dark:text-appleDark-text/85 mt-1">
          Но у тебя этого пока не видно. Проверь там свое соединение, чтоль
        </p>
        <button className="w-full mt-5 h-11 bg-[#FC062D] text-white font-semibold text-sm rounded-full transition-transform active:scale-[0.97] bg-[--tg-theme-button-color] text-[--tg-theme-button-text-color]">
          Попробовать еще
        </button>
      </div>
    </div>
  );
}
