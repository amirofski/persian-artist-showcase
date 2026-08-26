import React, { useRef, useState, useEffect, useMemo } from "react";
import { STORY_FRAGMENTS } from "../data/exhibitionData";
import { StoryScrollRibbon } from "./StoryScrollRibbon";
import { StoryFragment } from "../types";

interface StoryFragmentCardProps {
  fragment: StoryFragment;
  idx: number;
  isEven: boolean;
}

const StoryFragmentCard: React.FC<StoryFragmentCardProps> = ({ fragment, idx, isEven }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [hasStartedWriting, setHasStartedWriting] = useState<boolean>(false);
  const [autoProgress, setAutoProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Card starts writing when top enters 92% of viewport
      // Card is fully penned when top reaches 38% of viewport
      const startY = windowHeight * 0.92;
      const endY = windowHeight * 0.38;
      const totalRange = startY - endY;
      const currentPos = startY - rect.top;

      const rawProgress = Math.min(1, Math.max(0, currentPos / totalRange));
      setScrollProgress(rawProgress);

      if (rawProgress > 0.05 && !hasStartedWriting) {
        setHasStartedWriting(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasStartedWriting]);

  // Smooth fluid handwriting interpolation
  useEffect(() => {
    if (!hasStartedWriting) return;

    let animId: number;
    let startTimestamp: number | null = null;
    const duration = 2800; // Natural 2.8s flowing calligraphy inking rhythm

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const prog = Math.min(1, elapsed / duration);
      setAutoProgress(prog);

      if (prog < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [hasStartedWriting]);

  // Combine scroll scrub with natural auto-write
  const effectiveProgress = useMemo(() => {
    return Math.max(scrollProgress, autoProgress);
  }, [scrollProgress, autoProgress]);

  // Split lineFa and sublineFa into words for progressive RTL calligraphy reveal
  const lineWords = useMemo(() => fragment.lineFa.split(" "), [fragment.lineFa]);
  const sublineWords = useMemo(
    () => (fragment.sublineFa ? fragment.sublineFa.split(" ") : []),
    [fragment.sublineFa]
  );

  // Line 1 is written in progress 0.00 -> 0.55
  // Subline is written in progress 0.50 -> 1.00
  const line1Progress = Math.min(1, Math.max(0, effectiveProgress / 0.55));
  const sublineProgress = Math.min(1, Math.max(0, (effectiveProgress - 0.50) / 0.50));

  return (
    <div
      ref={cardRef}
      id={`story-fragment-${fragment.id}`}
      className={`relative max-w-4xl mx-auto flex flex-col ${
        isEven ? "items-start text-right" : "items-end text-left sm:text-right"
      } transition-all duration-700 z-10 w-full`}
    >
      {/* Soft backdrop vignette for text clarity over the animated ribbon */}
      <div
        id={`story-fragment-card-${fragment.id}`}
        className={`p-6 sm:p-10 md:p-12 rounded-2xl border border-white/10 bg-[#0c0c0c]/60 backdrop-blur-xl transition-all duration-500 hover:border-[#e5cdab]/30 hover:bg-[#0c0c0c]/80 max-w-3xl w-full ${
          isEven ? "self-start" : "self-end"
        }`}
        style={{
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(229, 205, 171, 0.04)",
        }}
      >
        {/* Story Sequence Marker & Persian Geometric Accent */}
        <div className="flex items-center gap-3 mb-6 select-none">
          <div className="w-2 h-2 bg-[#e5cdab] rotate-45 shadow-[0_0_8px_#e5cdab]" />
          <span className="text-[11px] tracking-[0.4em] uppercase font-sans text-[#e5cdab] opacity-75">
            Fragment 0{idx + 1}
          </span>
          <div className="w-16 h-[1px] bg-gradient-to-r from-[#e5cdab]/40 to-transparent" />
        </div>

        {/* 1. Main Primary Poetic Line (Handwritten Nastaliq Script) */}
        <div className="relative mb-6">
          <h3
            className="font-nastaliq text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#f7efe2] leading-[2.2] sm:leading-[2.4] flex flex-wrap gap-x-3 gap-y-2 items-baseline select-none"
            dir="rtl"
          >
            {lineWords.map((word, wIdx) => {
              const wordStart = wIdx / lineWords.length;
              const wordEnd = (wIdx + 1) / lineWords.length;
              const isWritten = line1Progress >= wordEnd;
              const isCurrentlyPenning = line1Progress >= wordStart && line1Progress < wordEnd;
              const wordOpacity = isWritten
                ? 1
                : isCurrentlyPenning
                ? Math.max(0.2, (line1Progress - wordStart) / (wordEnd - wordStart))
                : 0;

              return (
                <span
                  key={wIdx}
                  className="relative inline-block transition-all duration-200"
                  style={{
                    opacity: wordOpacity,
                    transform: `translateY(${isWritten ? "0px" : isCurrentlyPenning ? "2px" : "8px"}) scale(${
                      isCurrentlyPenning ? 1.04 : 1
                    })`,
                    textShadow: isCurrentlyPenning
                      ? "0 0 20px rgba(229, 205, 171, 0.8), 0 0 35px rgba(212, 175, 55, 0.5)"
                      : "0 2px 14px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  <span className="bg-gradient-to-l from-[#ffffff] via-[#f7efe2] to-[#e5cdab] bg-clip-text text-transparent">
                    {word}
                  </span>

                  {/* Active Calligraphy Nib Spark on Current Word */}
                  {isCurrentlyPenning && (
                    <span
                      className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#ffffff] pointer-events-none shadow-[0_0_12px_#e5cdab] animate-ping"
                      style={{ opacity: 0.8 }}
                    />
                  )}
                </span>
              );
            })}
          </h3>
        </div>

        {/* Delicate Golden Divider Line between Verse and Subline */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-[#e5cdab]/50 via-[#e5cdab]/20 to-transparent my-4" />

        {/* 2. Poetic Subline (Handwritten Nastaliq Script) */}
        {sublineWords.length > 0 && (
          <div className="relative mb-6">
            <p
              className="font-nastaliq text-xl sm:text-2xl md:text-3xl text-[#d4af37]/90 leading-[2.3] sm:leading-[2.5] flex flex-wrap gap-x-2.5 gap-y-1.5 items-baseline select-none"
              dir="rtl"
            >
              {sublineWords.map((word, wIdx) => {
                const wordStart = wIdx / sublineWords.length;
                const wordEnd = (wIdx + 1) / sublineWords.length;
                const isWritten = sublineProgress >= wordEnd;
                const isCurrentlyPenning = sublineProgress >= wordStart && sublineProgress < wordEnd;
                const wordOpacity = isWritten
                  ? 0.95
                  : isCurrentlyPenning
                  ? Math.max(0.15, (sublineProgress - wordStart) / (wordEnd - wordStart))
                  : 0;

                return (
                  <span
                    key={wIdx}
                    className="relative inline-block transition-all duration-200"
                    style={{
                      opacity: wordOpacity,
                      transform: `translateY(${isWritten ? "0px" : isCurrentlyPenning ? "2px" : "6px"})`,
                      textShadow: isCurrentlyPenning
                        ? "0 0 16px rgba(229, 205, 171, 0.7)"
                        : "0 2px 10px rgba(0, 0, 0, 0.7)",
                    }}
                  >
                    <span className="text-[#e5cdab]/90 hover:text-[#ffffff] transition-colors">
                      {word}
                    </span>
                  </span>
                );
              })}
            </p>
          </div>
        )}

        {/* 3. English Curatorial Translation */}
        {fragment.englishTranslation && (
          <p
            className="font-garamond italic text-sm sm:text-base text-[#9e988d] mt-6 max-w-xl pr-4 border-r border-[#e5cdab]/30 transition-opacity duration-700"
            style={{
              opacity: effectiveProgress > 0.65 ? 1 : 0.2,
            }}
          >
            "{fragment.englishTranslation}"
          </p>
        )}

        {/* Immersive UI Vertical Hairline */}
        <div className="mt-8 flex flex-col items-center gap-1 opacity-40">
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#e5cdab]/50 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export const Storytelling: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="story-section"
      className="relative w-full z-30 py-28 sm:py-48 px-6 sm:px-12 space-y-36 sm:space-y-52 overflow-hidden"
    >
      {/* 1. SCROLL-DRIVEN INTERTWINING CALLIGRAPHIC ARABESQUE SVG RIBBON */}
      <StoryScrollRibbon containerRef={sectionRef} />

      {/* 2. Deep Atmospheric Glows */}
      <div
        className="absolute top-1/4 left-1/3 w-[700px] h-[700px] bg-white/5 rounded-full blur-[140px] pointer-events-none -z-10"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#4a3a2a]/12 rounded-full blur-[120px] pointer-events-none -z-10"
      />
      <div
        className="absolute top-2/3 left-1/4 w-[450px] h-[450px] bg-[#e5cdab]/5 rounded-full blur-[100px] pointer-events-none -z-10"
      />

      {/* Story Fragments with Progressive Scroll Handwriting & Nastaliq Font */}
      {STORY_FRAGMENTS.map((fragment, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <StoryFragmentCard
            key={fragment.id}
            fragment={fragment}
            idx={idx}
            isEven={isEven}
          />
        );
      })}

      {/* Exhibition Colophon & Final Terminus */}
      <div className="relative z-10 max-w-2xl mx-auto pt-24 border-t border-white/10 text-center space-y-6 bg-[#0c0c0c]/50 backdrop-blur-md p-8 rounded-2xl border border-white/5">
        <p className="font-nastaliq text-3xl sm:text-4xl text-[#e5cdab] opacity-95 leading-[2.4] drop-shadow-[0_0_20px_rgba(229,205,171,0.3)]">
          هنر، جاودانگیِ نگاه در آینهٔ زمان است
        </p>

        <div className="flex flex-wrap justify-center items-center gap-6 text-[10px] tracking-[0.25em] uppercase opacity-40 font-sans text-[#e0dcd5]">
          <span>Exhibition No. 04</span>
          <span>•</span>
          <span>Tehran — 2026</span>
          <span>•</span>
          <span>Sara Ahmadi Studio</span>
        </div>
      </div>
    </section>
  );
};
