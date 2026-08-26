import React, { useEffect, useState, useMemo } from "react";
import { APP_CONFIG } from "../config";
import { HERO_CALLIGRAPHY_D } from "../data/calligraphyPaths";

interface HeroSvgCalligraphyProps {
  scrollProgress: number; // 0..1 hero scroll progress
}

export const HeroSvgCalligraphy: React.FC<HeroSvgCalligraphyProps> = ({ scrollProgress }) => {
  // Autonomic smooth progressive handwriting animation on load / idle
  const [autoProgress, setAutoProgress] = useState<number>(0);

  useEffect(() => {
    // If user has already scrolled past hero, show 100% completed text
    if (scrollProgress > 0.08) {
      setAutoProgress(1);
      return;
    }

    let animId: number;
    let startTimestamp: number | null = null;
    const duration = 4200; // 4.2s natural fluid calligraphy writing speed

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(1, elapsed / duration);
      // Smooth natural cubic ease for handwriting rhythm
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setAutoProgress(eased);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Combined write progress: scroll scrub + auto write on idle
  const writeProgress = useMemo(() => {
    const scrollDriven = Math.min(1, scrollProgress / 0.12);
    return Math.max(autoProgress, scrollDriven);
  }, [autoProgress, scrollProgress]);

  // Disintegration & fade out as user scrolls past hero into sequence 2
  const disintegrateProgress = Math.max(0, Math.min(1, (scrollProgress - 0.12) / 0.22));
  const opacity = Math.max(0, 1 - disintegrateProgress * 1.3);
  const scale = 1 + disintegrateProgress * 0.12;
  const blur = disintegrateProgress * 15;
  const translateY = -disintegrateProgress * 40;

  if (opacity <= 0.01) return null;

  // Split handwriting into two sequential Persian calligraphy lines (strictly Right-to-Left)
  // Line 1 (Upper sentence): writeProgress 0.00 -> 0.50
  // Line 2 (Lower sentence): writeProgress 0.48 -> 1.00
  const line1Progress = Math.min(1, Math.max(0, writeProgress / 0.50));
  const line2Progress = Math.min(1, Math.max(0, (writeProgress - 0.48) / 0.52));

  // Dynamic Right-to-Left Mask coordinates (spans from x=1150 on right to x=-100 on left)
  // We add a soft feathered gradient leading edge of 80px so ink flows organically without sharp cuts
  const line1HeadX = 1120 - line1Progress * 1200;
  const line2HeadX = 1120 - line2Progress * 1200;

  // Traveling Calligraphy Reed Pen (قلم نی خوشنویسی) nib position
  let penX = -100;
  let penY = -100;
  let penActive = false;

  if (writeProgress > 0.01 && writeProgress < 0.49) {
    // Line 1: travels from right (x=1030) to left (x=70) with organic vertical wave
    penX = 1030 - line1Progress * 960;
    penY = 380 + Math.sin(line1Progress * Math.PI * 4) * 35;
    penActive = true;
  } else if (writeProgress >= 0.49 && writeProgress < 0.98) {
    // Line 2: travels from right (x=980) to left (x=130) with organic vertical wave
    penX = 980 - line2Progress * 850;
    penY = 600 + Math.sin(line2Progress * Math.PI * 4) * 30;
    penActive = true;
  }

  return (
    <div
      id="hero-svg-calligraphy-container"
      className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full max-w-5xl mx-auto select-none pointer-events-none transition-transform duration-75 ease-out"
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        filter: `blur(${blur}px)`,
      }}
    >
      {/* Ambient Atmospheric Glow */}
      <div
        className="absolute -inset-32 rounded-full pointer-events-none -z-10 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(229, 205, 171, 0.10) 0%, rgba(74, 58, 42, 0.12) 40%, rgba(12, 12, 12, 0) 70%)",
          opacity: 1 - disintegrateProgress,
        }}
      />

      {/* Persian Nastaliq Master Artwork Vector */}
      <div className="relative w-full max-w-[780px] aspect-square flex items-center justify-center">
        <svg
          id="hero-calligraphy-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1080 1080"
          className="w-full h-full object-contain overflow-visible drop-shadow-[0_0_35px_rgba(229,205,171,0.25)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* 1. Master Calligraphy Silhouette */}
            <path id="hero-master-path" d={HERO_CALLIGRAPHY_D} />

            {/* 2. Soft-edge feathered RTL Reveal Gradient for Line 1 */}
            <linearGradient id="heroRtlGradLine1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="60px" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>

            {/* 3. Strict RTL Progressive Mask that covers 100% of letter height */}
            <mask id="hero-rtl-progressive-mask">
              {/* Black background = hidden until inked */}
              <rect x="0" y="0" width="1080" height="1080" fill="#000000" />

              {/* Line 1 (Upper) Full-height reveal box from top down to y=520 */}
              <rect
                x={line1HeadX}
                y="0"
                width={Math.max(0, 1200 - line1HeadX)}
                height="520"
                fill="#ffffff"
              />

              {/* Line 2 (Lower) Full-height reveal box from y=480 to 1080 */}
              <rect
                x={line2HeadX}
                y="480"
                width={Math.max(0, 1200 - line2HeadX)}
                height="600"
                fill="#ffffff"
              />
            </mask>

            {/* Luminous Rich Gold/Ivory Calligraphy Gradient */}
            <linearGradient id="heroSvgGoldGrad" x1="100%" y1="20%" x2="0%" y2="80%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#f7efe2" stopOpacity="1" />
              <stop offset="55%" stopColor="#e5cdab" stopOpacity="1" />
              <stop offset="85%" stopColor="#d4af37" stopOpacity="1" />
              <stop offset="100%" stopColor="#c5a880" stopOpacity="1" />
            </linearGradient>

            {/* Wet Ink Edge Bloom Filter */}
            <filter id="heroInkGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Master Silhouette with Full-Glyph RTL Progressive Inking */}
          <g mask="url(#hero-rtl-progressive-mask)" filter="url(#heroInkGlow)">
            {/* 100% Solid vibrant Persian gold filled calligraphy (No half-cut lines) */}
            <path
              d={HERO_CALLIGRAPHY_D}
              fill="url(#heroSvgGoldGrad)"
            />
          </g>

          {/* Active Calligraphy Pen Spark / Glowing Reed Tip (قلم نی) */}
          {penActive && (
            <g style={{ opacity: 1 - disintegrateProgress }}>
              {/* Wide diffuse wet ink aura around the pen nib */}
              <circle
                cx={penX}
                cy={penY}
                r="22"
                fill="url(#heroSvgGoldGrad)"
                opacity={0.3}
                filter="blur(6px)"
              />
              <circle
                cx={penX}
                cy={penY}
                r="10"
                fill="#ffffff"
                className="animate-ping opacity-75"
              />
              <circle
                cx={penX}
                cy={penY}
                r="6"
                fill="#f5efe6"
                style={{
                  filter: "drop-shadow(0 0 14px #e5cdab)",
                }}
              />
              <circle
                cx={penX}
                cy={penY}
                r="2.5"
                fill="#ffffff"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Vertical Hairline Divider & Curatorial Subtitle */}
      <div
        className="mt-4 sm:mt-6 flex flex-col items-center gap-3 transition-opacity duration-300"
        style={{ opacity: 1 - disintegrateProgress * 2 }}
      >
        <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-[#e5cdab]/50 to-transparent" />
        <span className="text-[11px] tracking-[0.3em] uppercase opacity-60 font-sans text-[#e0dcd5]">
          {APP_CONFIG.hero.authorFa}
        </span>
      </div>
    </div>
  );
};
