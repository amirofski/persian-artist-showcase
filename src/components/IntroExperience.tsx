import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSvgCalligraphy } from "./HeroSvgCalligraphy";
import { NastaliqReveal } from "./NastaliqReveal";
import { BetweenSequenceMotif } from "./BetweenSequenceMotif";
import { BackgroundDustCalligraphy } from "./BackgroundDustCalligraphy";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface IntroExperienceProps {
  onScrollProgressUpdate: (progress: number) => void;
  scrollProgress: number;
}

export const IntroExperience: React.FC<IntroExperienceProps> = ({
  onScrollProgressUpdate,
  scrollProgress,
}) => {
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollPrompt, setShowScrollPrompt] = useState<boolean>(true);

  useEffect(() => {
    const pinElement = pinSectionRef.current;
    const triggerElement = triggerRef.current;
    if (!pinElement || !triggerElement) return;

    // Create GSAP ScrollTrigger timeline to drive continuous scroll transformations
    const st = ScrollTrigger.create({
      trigger: triggerElement,
      start: "top top",
      end: "+=350%", // Pinned distance
      pin: pinElement,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        onScrollProgressUpdate(self.progress);
        if (self.progress > 0.05) {
          setShowScrollPrompt(false);
        } else {
          setShowScrollPrompt(true);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [onScrollProgressUpdate]);

  return (
    <div
      ref={triggerRef}
      id="hero-experience-trigger"
      className="relative w-full h-[400vh] bg-transparent"
    >
      {/* Pinned 100vh Viewport Screen */}
      <div
        ref={pinSectionRef}
        id="hero-experience"
        className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent"
      >
        {/* Ambient Oversized Calligraphic Letterforms & Flourishes floating off-canvas */}
        <BackgroundDustCalligraphy scrollProgress={scrollProgress} />

        {/* Soft Atmospheric Radial Vignette */}
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(197, 168, 128, 0.03) 0%, rgba(10, 11, 14, 0.45) 80%)",
          }}
        />

        {/* Phase 1 & 2: Primary Persian SVG Calligraphy with Piece-by-Piece Handwriting & Disintegration */}
        <HeroSvgCalligraphy scrollProgress={scrollProgress} />

        {/* Phase 3 & 4: Nastaliq Calligraphy Reveal & Handwriting Stroke Animation (Single continuous line) */}
        <NastaliqReveal scrollProgress={scrollProgress} />

        {/* Phase 5: Monumental Persian Motif Reveal between Sequence 2 and Sequence 3 (3X+ Scale, Top-to-Bottom) */}
        <BetweenSequenceMotif scrollProgress={scrollProgress} />

        {/* Minimal Subtle Scroll Prompt (Fades as user starts scrolling) */}
        <div
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none transition-all duration-700 select-none ${
            showScrollPrompt ? "opacity-75 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="font-vazir text-xs text-[#8c887e] tracking-widest">
            اسکرول کنید
          </span>
          <ChevronDown size={14} className="text-[#c5a880] animate-bounce" />
        </div>
      </div>
    </div>
  );
};
