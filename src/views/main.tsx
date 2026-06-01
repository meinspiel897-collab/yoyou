"use client";

import { useEffect, useState, useRef } from "react";
import EmptyState from "./main/empty"; //[span_2](start_span)[span_2](end_span)
import SearchView from "./main/search"; //[span_3](start_span)[span_3](end_span)
import SettingsView from "./settings"; //[span_4](start_span)[span_4](end_span)
import Header from "./main/header"; //[span_5](start_span)[span_5](end_span)
import NewModal from "./main/new"; //[span_6](start_span)[span_6](end_span)
import TrendsGrid from "./main/grid"; // Подключаем новую сетку трендов

interface MainViewProps {
  isLoading?: boolean; //[span_7](start_span)[span_7](end_span)
}

type TabType = "trending" | "events"; //[span_8](start_span)[span_8](end_span)

export default function MainView({ isLoading = false }: MainViewProps) { //[span_9](start_span)[span_9](end_span)
  const [activeTab, setActiveTab] = useState<TabType>("trending"); //[span_10](start_span)[span_10](end_span)
  const [isSearching, setIsSearching] = useState(false); //[span_11](start_span)[span_11](end_span)
  const [searchQuery, setSearchQuery] = useState(""); //[span_12](start_span)[span_12](end_span)
  const [activeTag, setActiveTag] = useState<string | null>(null); //[span_13](start_span)[span_13](end_span)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); //[span_14](start_span)[span_14](end_span)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); //[span_15](start_span)[span_15](end_span)

  const tabsOrder: TabType[] = ["trending", "events"]; //[span_16](start_span)[span_16](end_span)

  const tabTrendingRef = useRef<HTMLButtonElement>(null); //[span_17](start_span)[span_17](end_span)
  const tabEventsRef = useRef<HTMLButtonElement>(null); //[span_18](start_span)[span_18](end_span)
  const sliderRef = useRef<HTMLDivElement>(null); //[span_19](start_span)[span_19](end_span)
  const inputRef = useRef<HTMLInputElement>(null); //[span_20](start_span)[span_20](end_span)
  const contentTrackRef = useRef<HTMLDivElement>(null); //[span_21](start_span)[span_21](end_span)

  const activeTabRef = useRef<TabType>(activeTab); //[span_22](start_span)[span_22](end_span)
  useEffect(() => {
    activeTabRef.current = activeTab; //[span_23](start_span)[span_23](end_span)
  }, [activeTab]);

  const touchStart = useRef({ x: 0, y: 0, time: 0 }); //[span_24](start_span)[span_24](end_span)
  const isSwiping = useRef(false); //[span_25](start_span)[span_25](end_span)
  const currentTranslate = useRef(0); //[span_26](start_span)[span_26](end_span)
  const isClickTransition = useRef(false); //[span_27](start_span)[span_27](end_span)

  const physicsState = useRef({
    x: 0, tx: 0, vx: 0,
    w: 0, tw: 0, vw: 0,
    sx: 1, tsx: 1, vsx: 0,
    sy: 1, tsy: 1, vsy: 0,
    isMoving: false,
  }); //[span_28](start_span)[span_28](end_span)

  // Блокировка зума на мобилках
  useEffect(() => {
    const meta = document.querySelector("meta[name='viewport']"); //[span_29](start_span)[span_29](end_span)
    if (meta) {
      meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"); //[span_30](start_span)[span_30](end_span)
    } else {
      const newMeta = document.createElement("meta"); //[span_31](start_span)[span_31](end_span)
      newMeta.name = "viewport"; //[span_32](start_span)[span_32](end_span)
      newMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"; //[span_33](start_span)[span_33](end_span)
      document.head.appendChild(newMeta); //[span_34](start_span)[span_34](end_span)
    }
  }, []);

  // Сброс размеров физики при переходе в настройки
  useEffect(() => {
    if (isSettingsOpen) {
      physicsState.current.w = 0; //[span_35](start_span)[span_35](end_span)
      physicsState.current.x = 0; //[span_36](start_span)[span_36](end_span)
    }
  }, [isSettingsOpen]);

  // Настройка цветов темы Telegram WebApp
  useEffect(() => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any; //[span_37](start_span)[span_37](end_span)
      const webApp = anyWindow.Telegram?.WebApp; //[span_38](start_span)[span_38](end_span)
      if (webApp) {
        const theme = webApp.colorScheme || "dark"; //[span_39](start_span)[span_39](end_span)
        const bgColor = theme === "dark" ? "#000000" : "#FFFFFF"; //[span_40](start_span)[span_40](end_span)
        
        webApp.setHeaderColor(bgColor); //[span_41](start_span)[span_41](end_span)
        webApp.setBackgroundColor(bgColor); //[span_42](start_span)[span_42](end_span)
      }
    }
  }, []);

  // Кнопка настроек в TG
  useEffect(() => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any; //[span_43](start_span)[span_43](end_span)
      const tg = anyWindow.Telegram?.WebApp; //[span_44](start_span)[span_44](end_span)
      
      if (tg?.SettingsButton) {
        const handleSettingsClick = () => {
          setIsSettingsOpen(true); //[span_45](start_span)[span_45](end_span)
        };
        
        tg.SettingsButton.onClick(handleSettingsClick); //[span_46](start_span)[span_46](end_span)
        tg.SettingsButton.show(); //[span_47](start_span)[span_47](end_span)
        
        return () => {
          tg.SettingsButton.offClick(handleSettingsClick); //[span_48](start_span)[span_48](end_span)
          tg.SettingsButton.hide(); //[span_49](start_span)[span_49](end_span)
        };
      }
    }
  }, []);

  // Кнопка "Назад" в TG
  useEffect(() => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any; //[span_50](start_span)[span_50](end_span)
      const tg = anyWindow.Telegram?.WebApp; //[span_51](start_span)[span_51](end_span)
      
      if (tg?.BackButton) {
        const handleBackClick = () => {
          setIsSettingsOpen(false); //[span_52](start_span)[span_52](end_span)
        };
        
        if (isSettingsOpen) {
          tg.BackButton.onClick(handleBackClick); //[span_53](start_span)[span_53](end_span)
          tg.BackButton.show(); //[span_54](start_span)[span_54](end_span)
        } else {
          tg.BackButton.hide(); //[span_55](start_span)[span_55](end_span)
          tg.BackButton.offClick(handleBackClick); //[span_56](start_span)[span_56](end_span)
        }
        
        return () => {
          tg.BackButton.offClick(handleBackClick); //[span_57](start_span)[span_57](end_span)
        };
      }
    }
  }, [isSettingsOpen]);

  // Физика пружины для кастомного слайдера табов
  useEffect(() => {
    if (isLoading || isSearching || isSettingsOpen) return; //[span_58](start_span)[span_58](end_span)

    const PHYSICS = {
      pos: { k: 340, d: 28, m: 1 },     //[span_59](start_span)[span_59](end_span)
      scale: { k: 360, d: 24, m: 1 }   //[span_60](start_span)[span_60](end_span)
    };

    function spring(current: number, target: number, velocity: number, config: { k: number, d: number, m: number }) {
      const force = -config.k * (current - target); //[span_61](start_span)[span_61](end_span)
      const damping = -config.d * velocity; //[span_62](start_span)[span_62](end_span)
      const acceleration = (force + damping) / config.m; //[span_63](start_span)[span_63](end_span)
      velocity += acceleration * 0.016; //[span_64](start_span)[span_64](end_span)
      current += velocity * 0.016; //[span_65](start_span)[span_65](end_span)
      return [current, velocity]; //[span_66](start_span)[span_66](end_span)
    }

    let rafId: number; //[span_67](start_span)[span_67](end_span)

    const updatePhysics = () => {
      const state = physicsState.current; //[span_68](start_span)[span_68](end_span)
      const slider = sliderRef.current; //[span_69](start_span)[span_69](end_span)
      if (!slider) return; //[span_70](start_span)[span_70](end_span)

      if (state.isMoving) {
        const currentTab = activeTabRef.current; //[span_71](start_span)[span_71](end_span)
        const targetEl = currentTab === "trending" ? tabTrendingRef.current : tabEventsRef.current; //[span_72](start_span)[span_72](end_span)
        
        if (targetEl) {
          state.tx = targetEl.offsetLeft; //[span_73](start_span)[span_73](end_span)
          state.tw = targetEl.offsetWidth; //[span_74](start_span)[span_74](end_span)
        }
      }

      const dist = Math.abs(state.x - state.tx); //[span_75](start_span)[span_75](end_span)
      const vel = Math.abs(state.vx); //[span_76](start_span)[span_76](end_span)

      if (state.isMoving) {
        if (dist > 15) { 
          slider.style.backgroundColor = "transparent"; //[span_77](start_span)[span_77](end_span)
          slider.style.borderColor = typeof window !== "undefined" && document.documentElement.classList.contains("dark") //[span_78](start_span)[span_78](end_span)
            ? "rgba(255, 255, 255, 0.35)" //[span_79](start_span)[span_79](end_span)
            : "rgba(0, 0, 0, 0.18)"; //[span_80](start_span)[span_80](end_span)
          state.tsy = 1.15; //[span_81](start_span)[span_81](end_span)
          state.tsx = 0.92; //[span_82](start_span)[span_82](end_span)
        } else if (dist <= 15 && dist > 0.5) {
          slider.style.backgroundColor = ""; //[span_83](start_span)[span_83](end_span)
          slider.style.borderColor = "transparent"; //[span_84](start_span)[span_84](end_span)
          state.tsy = 0.97; //[span_85](start_span)[span_85](end_span)
          state.tsx = 1.03; //[span_86](start_span)[span_86](end_span)
        } else {
          state.tsx = 1; //[span_87](start_span)[span_87](end_span)
          state.tsy = 1; //[span_88](start_span)[span_88](end_span)
          if (vel < 0.2 && Math.abs(state.vsx) < 0.2) {
            state.isMoving = false; //[span_89](start_span)[span_89](end_span)
            slider.style.backgroundColor = ""; //[span_90](start_span)[span_90](end_span)
            slider.style.borderColor = "transparent"; //[span_91](start_span)[span_91](end_span)
          }
        }
      }

      [state.x, state.vx] = spring(state.x, state.tx, state.vx, PHYSICS.pos); //[span_92](start_span)[span_92](end_span)
      [state.w, state.vw] = spring(state.w, state.tw, state.vw, PHYSICS.pos); //[span_93](start_span)[span_93](end_span)
      [state.sx, state.vsx] = spring(state.sx, state.tsx, state.vsx, PHYSICS.scale); //[span_94](start_span)[span_94](end_span)
      [state.sy, state.vsy] = spring(state.sy, state.tsy, state.vsy, PHYSICS.scale); //[span_95](start_span)[span_95](end_span)

      slider.style.left = `${state.x}px`; //[span_96](start_span)[span_96](end_span)
      slider.style.width = `${state.w}px`; //[span_97](start_span)[span_97](end_span)
      slider.style.transform = `scale(${state.sx}, ${state.sy})`; //[span_98](start_span)[span_98](end_span)

      rafId = requestAnimationFrame(updatePhysics); //[span_99](start_span)[span_99](end_span)
    };

    rafId = requestAnimationFrame(updatePhysics); //[span_100](start_span)[span_100](end_span)
    return () => cancelAnimationFrame(rafId); //[span_101](start_span)[span_101](end_span)
  }, [isLoading, isSearching, isSettingsOpen]);

  // Слежка за изменением активного таба для физики
  useEffect(() => {
    if (isLoading || isSearching || isSettingsOpen) return; //[span_102](start_span)[span_102](end_span)
    
    const targetEl = activeTab === "trending" ? tabTrendingRef.current : tabEventsRef.current; //[span_103](start_span)[span_103](end_span)
    if (targetEl) {
      const state = physicsState.current; //[span_104](start_span)[span_104](end_span)
      
      if (state.w === 0) {
        state.x = targetEl.offsetLeft; //[span_105](start_span)[span_105](end_span)
        state.w = targetEl.offsetWidth; //[span_106](start_span)[span_106](end_span)
      }
      
      state.tx = targetEl.offsetLeft; //[span_107](start_span)[span_107](end_span)
      state.tw = targetEl.offsetWidth; //[span_108](start_span)[span_108](end_span)
      state.isMoving = true; //[span_109](start_span)[span_109](end_span)
    }
  }, [activeTab, isLoading, isSearching, isSettingsOpen]);

  const triggerHaptic = () => {
    if (typeof window !== "undefined") {
      const anyWindow = window as any; //[span_110](start_span)[span_110](end_span)
      if (anyWindow.Telegram?.WebApp?.HapticFeedback) {
        try {
          anyWindow.Telegram.WebApp.HapticFeedback.selectionChanged(); //[span_111](start_span)[span_111](end_span)
        } catch (e) {}
      }
    }
  };

  const handleTabClick = (tab: TabType) => {
    if (tab !== activeTab) {
      triggerHaptic(); //[span_112](start_span)[span_112](end_span)
      isClickTransition.current = true; //[span_113](start_span)[span_113](end_span)
      
      if (contentTrackRef.current) {
        contentTrackRef.current.style.transition = "none"; //[span_114](start_span)[span_114](end_span)
        const targetIdx = tabsOrder.indexOf(tab); //[span_115](start_span)[span_115](end_span)
        contentTrackRef.current.style.transform = `translateX(${-targetIdx * window.innerWidth}px)`; //[span_116](start_span)[span_116](end_span)
      }
      
      setActiveTab(tab); //[span_117](start_span)[span_117](end_span)
    }
  };

  // Логика свайпов контента (Swipeable views)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSearching) return; //[span_118](start_span)[span_118](end_span)
    
    const touch = e.touches[0]; //[span_119](start_span)[span_119](end_span)
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }; //[span_120](start_span)[span_120](end_span)
    isSwiping.current = false; //[span_121](start_span)[span_121](end_span)
    isClickTransition.current = false; //[span_122](start_span)[span_122](end_span)
    
    if (contentTrackRef.current) {
      contentTrackRef.current.style.transition = "none"; //[span_123](start_span)[span_123](end_span)
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isSearching || !touchStart.current.time) return; //[span_124](start_span)[span_124](end_span)

    const touch = e.touches[0]; //[span_125](start_span)[span_125](end_span)
    const deltaX = touch.clientX - touchStart.current.x; //[span_126](start_span)[span_126](end_span)
    const deltaY = touch.clientY - touchStart.current.y; //[span_127](start_span)[span_127](end_span)

    if (!isSwiping.current) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        isSwiping.current = true; //[span_128](start_span)[span_128](end_span)
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        touchStart.current.time = 0; //[span_129](start_span)[span_129](end_span)
        return;
      }
    }

    if (isSwiping.current && contentTrackRef.current) {
      e.preventDefault(); //[span_130](start_span)[span_130](end_span)
      
      const currentIdx = tabsOrder.indexOf(activeTab); //[span_131](start_span)[span_131](end_span)
      const width = window.innerWidth; //[span_132](start_span)[span_132](end_span)
      let translate = -currentIdx * width + deltaX; //[span_133](start_span)[span_133](end_span)

      // Сопротивление при выходе за границы крайних табов (Rubber-banding)
      if ((currentIdx === 0 && deltaX > 0) || (currentIdx === tabsOrder.length - 1 && deltaX < 0)) {
        translate = -currentIdx * width + deltaX * 0.35; //[span_134](start_span)[span_134](end_span)
      }

      currentTranslate.current = translate; //[span_135](start_span)[span_135](end_span)
      contentTrackRef.current.style.transform = `translateX(${translate}px)`; //[span_136](start_span)[span_136](end_span)
    }
  };

  const handleTouchEnd = () => {
    if (isSearching || !isSwiping.current) return; //[span_137](start_span)[span_137](end_span)
    isSwiping.current = false; //[span_138](start_span)[span_138](end_span)

    const width = window.innerWidth; //[span_139](start_span)[span_139](end_span)
    const currentIdx = tabsOrder.indexOf(activeTab); //[span_140](start_span)[span_140](end_span)
    const movedX = currentTranslate.current + (currentIdx * width); //[span_141](start_span)[span_141](end_span)
    const duration = Date.now() - touchStart.current.time; //[span_142](start_span)[span_142](end_span)

    let targetIdx = currentIdx; //[span_143](start_span)[span_143](end_span)

    if (Math.abs(movedX) > width * 0.35 || (duration < 250 && Math.abs(movedX) > 40)) {
      if (movedX > 0 && currentIdx > 0) {
        targetIdx = currentIdx - 1; //[span_144](start_span)[span_144](end_span)
      } else if (movedX < 0 && currentIdx < tabsOrder.length - 1) {
        targetIdx = currentIdx + 1; //[span_145](start_span)[span_145](end_span)
      }
    }

    if (contentTrackRef.current) {
      contentTrackRef.current.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)"; //[span_146](start_span)[span_146](end_span)
      contentTrackRef.current.style.transform = `translateX(${-targetIdx * width}px)`; //[span_147](start_span)[span_147](end_span)
    }

    if (targetIdx !== currentIdx) {
      triggerHaptic(); //[span_148](start_span)[span_148](end_span)
      setActiveTab(tabsOrder[targetIdx]); //[span_149](start_span)[span_149](end_span)
    }
  };

  useEffect(() => {
    if (contentTrackRef.current && !isSearching) {
      const currentIdx = tabsOrder.indexOf(activeTab); //[span_150](start_span)[span_150](end_span)
      
      if (isClickTransition.current) {
        isClickTransition.current = false; //[span_151](start_span)[span_151](end_span)
        return;
      }

      contentTrackRef.current.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)"; //[span_152](start_span)[span_152](end_span)
      contentTrackRef.current.style.transform = `translateX(${-currentIdx * window.innerWidth}px)`; //[span_153](start_span)[span_153](end_span)
    }
  }, [activeTab, isSearching]);

  // Управление поиском
  const enableSearch = () => {
    triggerHaptic(); //[span_154](start_span)[span_154](end_span)
    setIsSearching(true); //[span_155](start_span)[span_155](end_span)
    setTimeout(() => inputRef.current?.focus(), 150); //[span_156](start_span)[span_156](end_span)
  };

  const disableSearch = () => {
    triggerHaptic(); //[span_157](start_span)[span_157](end_span)
    setIsSearching(false); //[span_158](start_span)[span_158](end_span)
    setSearchQuery(""); //[span_159](start_span)[span_159](end_span)
    setActiveTag(null); //[span_160](start_span)[span_160](end_span)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; //[span_161](start_span)[span_161](end_span)
    if (!activeTag) {
      const match = value.match(/^@([^\s]+)\s$/); //[span_162](start_span)[span_162](end_span)
      if (match) {
        triggerHaptic(); //[span_163](start_span)[span_163](end_span)
        setActiveTag(match[1]); //[span_164](start_span)[span_164](end_span)
        setSearchQuery(""); //[span_165](start_span)[span_165](end_span)
        return;
      }
    }
    setSearchQuery(value); //[span_166](start_span)[span_166](end_span)
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && searchQuery === "" && activeTag) {
      triggerHaptic(); //[span_167](start_span)[span_167](end_span)
      setActiveTag(null); //[span_168](start_span)[span_168](end_span)
      e.preventDefault(); //[span_169](start_span)[span_169](end_span)
    }
  };

  // Управление модалкой добавления контента
  const handleOpenAddModal = () => {
    triggerHaptic(); //[span_170](start_span)[span_170](end_span)
    setIsAddModalOpen(true); //[span_171](start_span)[span_171](end_span)
  };

  const handleCloseAddModal = () => {
    triggerHaptic(); //[span_172](start_span)[span_172](end_span)
    setIsAddModalOpen(false); //[span_173](start_span)[span_173](end_span)
  };

  if (isSettingsOpen) {
    return <SettingsView />; //[span_174](start_span)[span_174](end_span)
  }

  return (
    <div className="w-full h-full bg-black overflow-hidden relative">
      <div 
        className="flex flex-col w-full h-full bg-appleLight-bg dark:bg-appleDark-bg transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform"
        style={{
          transform: isAddModalOpen ? "scale(0.95)" : "scale(1)", //[span_175](start_span)[span_175](end_span)
          borderRadius: isAddModalOpen ? "24px" : "0px", //[span_176](start_span)[span_176](end_span)
        }}
      >
        <main className="flex-1 w-full pt-[calc(var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))+44px)] flex flex-col overflow-hidden select-none">
          
          <Header
            isLoading={isLoading} //[span_177](start_span)[span_177](end_span)
            activeTab={activeTab} //[span_178](start_span)[span_178](end_span)
            isSearching={isSearching} //[span_179](start_span)[span_179](end_span)
            searchQuery={searchQuery} //[span_180](start_span)[span_180](end_span)
            activeTag={activeTag} //[span_181](start_span)[span_181](end_span)
            sliderRef={sliderRef} //[span_182](start_span)[span_182](end_span)
            tabTrendingRef={tabTrendingRef} //[span_183](start_span)[span_183](end_span)
            tabEventsRef={tabEventsRef} //[span_184](start_span)[span_184](end_span)
            inputRef={inputRef} //[span_185](start_span)[span_185](end_span)
            handleTabClick={handleTabClick} //[span_186](start_span)[span_186](end_span)
            enableSearch={enableSearch} //[span_187](start_span)[span_187](end_span)
            disableSearch={disableSearch} //[span_188](start_span)[span_188](end_span)
            handleInputChange={handleInputChange} //[span_189](start_span)[span_189](end_span)
            handleInputKeyDown={handleInputKeyDown} //[span_190](start_span)[span_190](end_span)
            onAddClick={handleOpenAddModal} //[span_191](start_span)[span_191](end_span)
          />

          <div className="flex-1 w-full overflow-hidden relative mt-1">
            {isSearching ? (
              <SearchView searchQuery={searchQuery} /> //[span_192](start_span)[span_192](end_span)
            ) : (
              <div 
                ref={contentTrackRef} //[span_193](start_span)[span_193](end_span)
                onTouchStart={handleTouchStart} //[span_194](start_span)[span_194](end_span)
                onTouchMove={handleTouchMove} //[span_195](start_span)[span_195](end_span)
                onTouchEnd={handleTouchEnd} //[span_196](start_span)[span_196](end_span)
                className="absolute inset-0 flex w-[200%] h-full will-change-transform" //[span_197](start_span)[span_197](end_span)
                style={{ transform: `translateX(0px)` }} //[span_198](start_span)[span_198](end_span)
              >
                {/* Лента Трендов с новой Pinterest-сеткой */}
                <div className="w-screen h-full flex-shrink-0 overflow-y-auto scrollbar-none">
                  <TrendsGrid isLoading={isLoading} />
                </div>
                
                {/* Лента Событий пока остается в дефолтном состоянии */}
                <div className="w-screen h-full flex-shrink-0 overflow-y-auto scrollbar-none">
                  <EmptyState isLoading={isLoading} activeTab="events" /> {/*[span_199](start_span)[span_199](end_span) */}
                </div>
              </div>
            )}
          </div>

        </main>
      </div>

      <NewModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} /> {/*[span_200](start_span)[span_200](end_span) */}
    </div>
  );
}
