"use client";

export default function EmptyState() {
  const handleTryAgain = () => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any;
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try {
          anyWindow.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
        } catch (e) {}
      }
    }
  };

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
        <p className="text-sm font-medium text-center text-appleLight-text/75 dark:text-appleDark-text/75 mt-1">
          Но у тебя этого пока не видно. Проверь там свое соединение, чтоль
        </p>
        <button 
          onClick={handleTryAgain}
          className="w-full mt-5 h-11 bg-[#FC062D] text-white font-semibold text-sm rounded-full outline-none"
        >
          Попробовать еще
        </button>
      </div>
    </div>
  );
}
