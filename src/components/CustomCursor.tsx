import React, { useEffect, useRef, useState } from "react";

interface CustomCursorProps {
  isHoveringArtwork: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ isHoveringArtwork }) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    let isShown = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isShown) {
        isShown = true;
        setIsVisible(true);
      }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      isShown = false;
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      id="custom-cursor-element"
      className={`fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: "translate3d(-100px, -100px, 0)",
        willChange: "transform",
      }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        {isHoveringArtwork ? (
          <div className="w-12 h-12 rounded-full border border-white/40 bg-[#0c0c0c]/80 backdrop-blur-sm flex items-center justify-center text-[9px] uppercase tracking-tighter text-[#e0dcd5] shadow-[0_0_20px_rgba(255,255,255,0.15)] animate-pulse">
            <span className="opacity-80 font-vazir">مشاهده</span>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-[7px] uppercase tracking-tighter text-[#e0dcd5]">
            <span className="w-1 h-1 rounded-full bg-white/40" />
          </div>
        )}
      </div>
    </div>
  );
};
