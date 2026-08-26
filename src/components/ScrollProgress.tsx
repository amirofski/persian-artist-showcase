import React from "react";

interface ScrollProgressProps {
  progress: number;
  onNavigate?: (targetId: string) => void;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ progress }) => {
  return (
    <div
      id="scroll-progress-indicator"
      className="fixed left-8 sm:left-12 bottom-12 z-40 hidden md:flex flex-col gap-2 select-none"
    >
      <span className="text-[10px] opacity-30 uppercase font-sans tracking-[0.2em] text-[#e0dcd5]">
        Scroll Progress
      </span>
      <div className="w-[1px] h-32 bg-white/10 relative">
        <div
          className="absolute left-0 w-[1px] h-8 bg-white transition-all duration-100"
          style={{
            top: `${Math.min(96, Math.max(0, progress * 96))}px`,
          }}
        />
      </div>
      <span className="text-[10px] opacity-40 font-sans tracking-widest text-[#e0dcd5]">
        {Math.round(progress * 100)}%
      </span>
    </div>
  );
};
