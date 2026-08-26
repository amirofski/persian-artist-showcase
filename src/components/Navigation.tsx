import React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface NavigationProps {
  isVisible: boolean;
  audioActive: boolean;
  onToggleAudio: () => void;
  onScrollTo: (targetId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isVisible,
  audioActive,
  onToggleAudio,
  onScrollTo,
}) => {
  return (
    <header
      id="gallery-navigation-bar"
      className={`fixed top-0 inset-x-0 z-45 transition-all duration-700 ease-out flex justify-between items-center px-8 sm:px-12 py-6 sm:py-8 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
      }`}
    >
      {/* Exhibition Sub-badge */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] tracking-[0.4em] uppercase opacity-40 font-sans text-[#e0dcd5]">
          Exhibition No. 04
        </span>
      </div>

      {/* Center Navigation links */}
      <nav className="flex items-center gap-8 sm:gap-12 text-[13px] opacity-75 font-vazir">
        <button
          onClick={() => onScrollTo("hero-experience")}
          className="hover:opacity-100 transition-opacity text-[#e0dcd5] cursor-pointer"
        >
          سارا احمدی
        </button>

        <button
          onClick={() => onScrollTo("artist-section")}
          className="hover:opacity-100 transition-opacity text-[#e0dcd5] cursor-pointer"
        >
          هنرمندان
        </button>

        <button
          onClick={() => onScrollTo("artwork-section")}
          className="hover:opacity-100 transition-opacity text-[#e0dcd5] cursor-pointer"
        >
          آثار
        </button>

        <button
          onClick={() => onScrollTo("story-section")}
          className="hover:opacity-100 transition-opacity text-[#e0dcd5] cursor-pointer"
        >
          درباره
        </button>

        {/* Ambient Audio Toggle */}
        <button
          id="toggle-audio-btn"
          onClick={onToggleAudio}
          className={`flex items-center gap-2 hover:opacity-100 transition-opacity cursor-pointer ${
            audioActive ? "text-white opacity-100" : "opacity-50 text-[#e0dcd5]"
          }`}
          title={audioActive ? "قطع نوای اتمسفر" : "پخش نوای اتمسفر"}
        >
          {audioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span className="text-[11px] hidden md:inline">
            {audioActive ? "اتمسفر صوتی" : "سکوت"}
          </span>
        </button>
      </nav>
    </header>
  );
};
