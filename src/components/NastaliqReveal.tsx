import React, { useMemo } from "react";
import { NASTALIQ_SINGLE_LINE_D } from "../data/calligraphyPaths";

interface NastaliqRevealProps {
  scrollProgress: number;
}

export const NastaliqReveal: React.FC<NastaliqRevealProps> = ({ scrollProgress }) => {
  // Visible strictly during sequence 2 (0.24 to 0.65)
  const isVisible = scrollProgress >= 0.24 && scrollProgress <= 0.66;

  // Single continuous Persian calligraphy line writing progress mapped from scroll (0.28 to 0.52)
  const drawProgress = useMemo(() => {
    if (scrollProgress < 0.28) return 0;
    if (scrollProgress > 0.52) return 1;
    return (scrollProgress - 0.28) / 0.24;
  }, [scrollProgress]);

  // Overall container opacity with smooth ease & clean exit before between-sequence motif
  const containerOpacity = useMemo(() => {
    if (scrollProgress < 0.24) return 0;
    if (scrollProgress < 0.30) return (scrollProgress - 0.24) / 0.06;
    if (scrollProgress <= 0.53) return 1;
    // Complete fade out and glide upwards between 0.53 and 0.64
    if (scrollProgress <= 0.64) return Math.max(0, 1 - (scrollProgress - 0.53) / 0.11);
    return 0;
  }, [scrollProgress]);

  // Dynamic glide upwards on exit
  const exitOffsetY = useMemo(() => {
    if (scrollProgress <= 0.53) return 0;
    return -((scrollProgress - 0.53) / 0.11) * 35;
  }, [scrollProgress]);

  // Dynamic Right-to-Left reveal mask coordinates
  const revealHeadX = 1150 - drawProgress * 1250;

  // Traveling pen head spark across the single Persian line (from right to left: 1060 -> 50)
  let penX = -100;
  let penY = -100;
  let penActive = false;

  if (drawProgress > 0.01 && drawProgress < 0.99 && containerOpacity > 0.15) {
    penX = 1060 - drawProgress * 1010;
    penY = 485 + Math.sin(drawProgress * Math.PI * 3.5) * 45;
    penActive = true;
  }

  if (!isVisible || containerOpacity <= 0.01) return null;

  return (
    <div
      id="nastaliq-reveal-container"
      className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-25 px-4 select-none"
      style={{
        opacity: containerOpacity,
        transform: `translateY(${exitOffsetY + (1 - drawProgress) * 12}px)`,
        transition: "opacity 0.12s ease-out, transform 0.12s ease-out",
      }}
    >
      {/* Background Soft Luminous Ethereal Glow */}
      <div
        className="absolute w-[800px] h-[450px] max-w-full rounded-full -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(229, 205, 171, 0.12) 0%, rgba(197, 168, 128, 0.03) 45%, transparent 75%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative w-full max-w-4xl flex flex-col items-center">
        {/* Persian Nastaliq Master Artwork Vector SVG with 100% Full-Glyph RTL Inking */}
        <div className="relative w-full aspect-square max-w-[700px] flex items-center justify-center">
          <svg
            id="seq2-calligraphy-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1080 1080"
            className="w-full h-full object-contain overflow-visible drop-shadow-[0_0_35px_rgba(229,205,171,0.25)]"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* 1. Full-Height RTL Progressive Mask */}
              <mask id="nastaliq-rtl-mask">
                <rect x="0" y="0" width="1080" height="1080" fill="#000000" />
                <rect
                  x={revealHeadX}
                  y="0"
                  width={Math.max(0, 1250 - revealHeadX)}
                  height="1080"
                  fill="#ffffff"
                />
              </mask>

              {/* Luminous Rich Gold/Ivory Calligraphy Gradient */}
              <linearGradient id="nastaliqSvgGoldGrad" x1="100%" y1="15%" x2="0%" y2="85%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="25%" stopColor="#f7efe2" stopOpacity="1" />
                <stop offset="60%" stopColor="#e5cdab" stopOpacity="1" />
                <stop offset="85%" stopColor="#d4af37" stopOpacity="1" />
                <stop offset="100%" stopColor="#c5a880" stopOpacity="1" />
              </linearGradient>

              {/* Ink Bleed Glow */}
              <filter id="nastaliqInkGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Master Silhouette with Full-Height RTL Inking (100% Solid Vibrant Persian Gold) */}
            <g mask="url(#nastaliq-rtl-mask)" filter="url(#nastaliqInkGlow)">
              <path
                d={NASTALIQ_SINGLE_LINE_D}
                fill="url(#nastaliqSvgGoldGrad)"
              />
            </g>

            {/* Traveling Calligraphy Pen Ink Spark Head */}
            {penActive && (
              <g>
                <circle
                  cx={penX}
                  cy={penY}
                  r="20"
                  fill="url(#nastaliqSvgGoldGrad)"
                  opacity={0.3}
                  filter="blur(5px)"
                />
                <circle
                  cx={penX}
                  cy={penY}
                  r="8"
                  fill="#ffffff"
                  className="animate-ping opacity-70"
                />
                <circle
                  cx={penX}
                  cy={penY}
                  r="5"
                  fill="#f7efe2"
                  style={{
                    filter: "drop-shadow(0 0 14px #e5cdab)",
                  }}
                />
                <circle
                  cx={penX}
                  cy={penY}
                  r="2"
                  fill="#ffffff"
                />
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
