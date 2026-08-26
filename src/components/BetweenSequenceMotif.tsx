import React, { useMemo } from "react";
import { CalligraphyMotifReveal } from "./CalligraphyMotifReveal";

interface BetweenSequenceMotifProps {
  scrollProgress: number; // 0..1 hero/pinned scroll progress
}

export const BetweenSequenceMotif: React.FC<BetweenSequenceMotifProps> = ({
  scrollProgress,
}) => {
  // Visible starting from Sequence 2 completion through the pinned hero exit (0.50 to 1.05)
  const isVisible = scrollProgress >= 0.50 && scrollProgress <= 1.05;

  // Top-to-bottom drawing reveal
  const motifProgress = useMemo(() => {
    if (scrollProgress < 0.53) return 0;
    if (scrollProgress > 0.78) return 1;
    return (scrollProgress - 0.53) / 0.25;
  }, [scrollProgress]);

  // Smooth entrance (0.50 -> 0.56) and stays visible to connect into next scene
  const opacity = useMemo(() => {
    if (scrollProgress < 0.50) return 0;
    if (scrollProgress < 0.56) return (scrollProgress - 0.50) / 0.06;
    if (scrollProgress <= 0.88) return 1;
    // Seamless gentle transition into the artist scene background continuation
    return Math.max(0.4, 1 - ((scrollProgress - 0.88) / 0.12) * 0.6);
  }, [scrollProgress]);

  // Majestic monumental parallax drift as the user scrolls
  const translateY = useMemo(() => {
    if (scrollProgress < 0.53) return 30;
    if (scrollProgress <= 0.85) return (1 - motifProgress) * 20;
    // Upward glide as user unpins into scene 3
    return -((scrollProgress - 0.85) / 0.15) * 50;
  }, [scrollProgress, motifProgress]);

  // Subtle breathing scale
  const scale = useMemo(() => {
    if (scrollProgress <= 0.85) return 1;
    return 1 + ((scrollProgress - 0.85) / 0.15) * 0.06;
  }, [scrollProgress]);

  if (!isVisible || opacity <= 0.01) return null;

  return (
    <div
      id="between-sequence-motif-stage"
      className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-22 px-4 sm:px-8 select-none"
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
      }}
    >
      {/* Deep Atmospheric Luminous Halo behind the Monumental Motif */}
      <div
        className="absolute w-[900px] sm:w-[1300px] h-[550px] sm:h-[750px] max-w-full rounded-full -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(229, 205, 171, 0.16) 0%, rgba(197, 168, 128, 0.05) 45%, transparent 75%)",
          filter: "blur(60px)",
        }}
      />

      {/* Monumental Persian Calligraphic Motif (3X+ Larger Scale) */}
      <div className="relative w-full max-w-[950px] sm:max-w-[1250px] lg:max-w-[1500px] xl:max-w-[1680px] flex items-center justify-center">
        <CalligraphyMotifReveal
          progress={motifProgress}
          className="w-full h-auto max-h-[82vh]"
          glow={true}
          opacity={1}
        />
      </div>

      {/* Subtle Persian Inscription Eyebrow above / below during reveal */}
      <div
        className="mt-6 flex items-center gap-3 transition-opacity duration-500"
        style={{
          opacity: motifProgress > 0.4 ? Math.min(1, (motifProgress - 0.4) / 0.3) * 0.6 : 0,
        }}
      >
        <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#e5cdab]/40" />
        
        <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#e5cdab]/40" />
      </div>
    </div>
  );
};
