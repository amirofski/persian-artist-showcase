import React, { useRef, useCallback, useState } from "react";
import { Artwork } from "../types";
import { Maximize2 } from "lucide-react";

interface Artwork3DCardProps {
  artwork: Artwork;
  onOpenLightbox: (art: Artwork) => void;
  onHoverState?: (isHovering: boolean) => void;
  variant?: "square-gallery" | "monumental";
}

export const Artwork3DCard: React.FC<Artwork3DCardProps> = ({
  artwork,
  onOpenLightbox,
  onHoverState,
  variant = "square-gallery",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normalizedX = (x - centerX) / centerX; // -1 to 1
    const normalizedY = (y - centerY) / centerY; // -1 to 1

    const rotateY = normalizedX * 8;
    const rotateX = -normalizedY * 8;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1)`;

    if (glareRef.current) {
      const gx = ((x / rect.width) * 100).toFixed(1);
      const gy = ((y / rect.height) * 100).toFixed(1);
      glareRef.current.style.background = `radial-gradient(circle 300px at ${gx}% ${gy}%, rgba(255, 255, 255, 0.3) 0%, rgba(229, 205, 171, 0.15) 40%, transparent 80%)`;
      glareRef.current.style.opacity = "0.35";
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (onHoverState) onHoverState(true);
  }, [onHoverState]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
    if (onHoverState) onHoverState(false);
  }, [onHoverState]);

  if (variant === "monumental") {
    return (
      <div
        ref={cardRef}
        id={`artwork-monumental-${artwork.id}`}
        onClick={() => onOpenLightbox(artwork)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-[16/11] rounded-xl overflow-hidden cursor-pointer group select-none transition-all duration-300 ease-out will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? "0 35px 80px -15px rgba(0, 0, 0, 0.95), 0 0 40px rgba(229, 205, 171, 0.12)"
            : "0 25px 60px -15px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Main Artwork Canvas */}
        <img
          src={artwork.imageUrl}
          alt={artwork.titleFa}
          className="w-full h-full object-cover brightness-[0.92] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Dynamic 3D Glare Lighting Overlay */}
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
          style={{
            opacity: 0,
          }}
        />

        {/* Ornate Square Geometric Framing Lines (Inner & Outer) */}
        <div className="absolute inset-0 pointer-events-none z-20 p-4 sm:p-6">
          <div className="relative w-full h-full border border-white/20 group-hover:border-[#e5cdab]/60 transition-colors duration-500 rounded-sm">
            {/* Corner Ornaments */}
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#e5cdab] group-hover:w-5 group-hover:h-5 transition-all duration-500" />
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#e5cdab] group-hover:w-5 group-hover:h-5 transition-all duration-500" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#e5cdab] group-hover:w-5 group-hover:h-5 transition-all duration-500" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#e5cdab] group-hover:w-5 group-hover:h-5 transition-all duration-500" />
            
            {/* Fine Center Crosshair Ticks */}
            <div className="absolute top-1/2 -left-1 w-2 h-[1px] bg-[#e5cdab]/40" />
            <div className="absolute top-1/2 -right-1 w-2 h-[1px] bg-[#e5cdab]/40" />
            <div className="absolute left-1/2 -top-1 w-[1px] h-2 bg-[#e5cdab]/40" />
            <div className="absolute left-1/2 -bottom-1 w-[1px] h-2 bg-[#e5cdab]/40" />
          </div>
        </div>

        {/* Ambient bottom shadow gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/90 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500 z-10" />

        {/* Floating 3D Metadata Chips */}
        <div
          className="absolute bottom-6 right-6 z-30 flex items-center gap-3 bg-[#0c0c0c]/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs text-[#e0dcd5] shadow-lg transition-transform duration-300"
          style={{
            transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
          }}
        >
          <Maximize2 size={13} className="text-[#e5cdab]" />
          <span className="font-vazir text-[11px]">بزرگنمایی و جزئیات اثر</span>
        </div>

        <div
          className="absolute top-6 left-6 z-30 transition-transform duration-300"
          style={{
            transform: isHovered ? "translateZ(25px)" : "translateZ(0px)",
          }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase opacity-75 font-sans bg-[#0c0c0c]/85 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#e5cdab]/30 text-[#e5cdab]">
            ORIGINAL PIECE — {artwork.yearEn}
          </span>
        </div>
      </div>
    );
  }

  // Square Gallery Frame with 3D Hover & Persian Geometric Fine Lines
  return (
    <div
      ref={cardRef}
      id={`artwork-card-${artwork.id}`}
      onClick={() => onOpenLightbox(artwork)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-xl overflow-hidden cursor-pointer group select-none transition-all duration-300 ease-out bg-[#141414] border border-white/10 hover:border-[#e5cdab]/40 flex flex-col will-change-transform"
      style={{
        transformStyle: "preserve-3d",
        boxShadow: isHovered
          ? "0 28px 60px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(229, 205, 171, 0.15)"
          : "0 15px 35px -10px rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* 1. Square Art Canvas Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#0a0a0a]">
        <img
          src={artwork.imageUrl}
          alt={artwork.titleFa}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 brightness-[0.93] contrast-[1.05]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Dynamic 3D Glare Lighting Sheen */}
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
          style={{
            opacity: 0,
          }}
        />

        {/* Vignette Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20 opacity-70 group-hover:opacity-40 transition-opacity duration-500 z-10" />

        {/* 2. Elegant Square Frame with Ornate Persian Calligraphic & Sacred Lines */}
        <div className="absolute inset-0 pointer-events-none z-20 p-3 sm:p-4">
          <div className="relative w-full h-full border border-white/20 group-hover:border-[#e5cdab]/70 transition-colors duration-500 rounded-sm">
            {/* Concentric Inner Dashed Line */}
            <div className="absolute inset-1.5 border border-dashed border-white/10 group-hover:border-[#e5cdab]/40 transition-colors duration-500" />

            {/* Persian Corner Motifs (Top-Right, Top-Left, Bottom-Right, Bottom-Left) */}
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#e5cdab] group-hover:w-5 group-hover:h-5 transition-all duration-400" />
            <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#e5cdab] group-hover:w-5 group-hover:h-5 transition-all duration-400" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#e5cdab] group-hover:w-5 group-hover:h-5 transition-all duration-400" />
            <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#e5cdab] group-hover:w-5 group-hover:h-5 transition-all duration-400" />

            {/* Micro Gold Diamonds at corners */}
            <div className="absolute top-1 right-1 w-1 h-1 bg-[#e5cdab] rotate-45 opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-1 left-1 w-1 h-1 bg-[#e5cdab] rotate-45 opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-[#e5cdab] rotate-45 opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-[#e5cdab] rotate-45 opacity-60 group-hover:opacity-100 transition-opacity" />

            {/* Cardinal Crosshair Fine Line Accents */}
            <div className="absolute top-1/2 -left-1.5 w-3 h-[1px] bg-[#e5cdab]/50" />
            <div className="absolute top-1/2 -right-1.5 w-3 h-[1px] bg-[#e5cdab]/50" />
            <div className="absolute left-1/2 -top-1.5 w-[1px] h-3 bg-[#e5cdab]/50" />
            <div className="absolute left-1/2 -bottom-1.5 w-[1px] h-3 bg-[#e5cdab]/50" />
          </div>
        </div>

        {/* 3. Floating 3D Badge on Hover */}
        <div
          className="absolute top-3.5 left-3.5 z-30 transition-transform duration-300"
          style={{
            transform: isHovered ? "translateZ(24px)" : "translateZ(0px)",
          }}
        >
          <span className="bg-[#0c0c0c]/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-[#e5cdab] font-sans tracking-wider border border-[#e5cdab]/30 shadow-md">
            {artwork.yearEn}
          </span>
        </div>

        <div
          className="absolute bottom-3.5 right-3.5 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{
            transform: isHovered ? "translateZ(26px)" : "translateZ(0px)",
          }}
        >
          <div className="flex items-center gap-1.5 bg-[#0c0c0c]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#e5cdab]/40 text-[#e0dcd5] text-[10px] shadow-lg">
            <Maximize2 size={11} className="text-[#e5cdab]" />
            <span className="font-vazir text-[10px]">مشاهده اثر</span>
          </div>
        </div>
      </div>

      {/* 4. Curatorial Details Below Square Frame */}
      <div
        className="p-5 space-y-3 flex-1 flex flex-col justify-between transition-transform duration-300"
        style={{
          transform: isHovered ? "translateZ(18px)" : "translateZ(0px)",
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] tracking-[0.25em] uppercase opacity-40 font-sans text-[#e5cdab]">
              Series Artwork
            </span>
            <span className="text-[10px] font-sans opacity-40 text-[#e0dcd5]">
              {artwork.dimensionsFa}
            </span>
          </div>
          <h4 className="font-vazir font-light text-xl text-[#e0dcd5] group-hover:text-white transition-colors">
            «{artwork.titleFa}»
          </h4>
          <p className="font-vazir text-xs text-[#8c887e] line-clamp-2 mt-1 font-light leading-relaxed">
            {artwork.mediumFa}
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#a8a49c]">
          <span className="font-vazir text-[11px] text-[#c5a880]">{artwork.theme || "مجموعه اختصاصی"}</span>
          <span className="font-garamond italic text-[11px] text-[#7e7b72]">{artwork.titleEn}</span>
        </div>
      </div>
    </div>
  );
};
