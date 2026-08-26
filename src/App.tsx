import React, { useState, useEffect, useCallback } from "react";
import { ParticleField } from "./components/ParticleField";
import { IntroExperience } from "./components/IntroExperience";
import { ArtistReveal } from "./components/ArtistReveal";
import { ArtworkSection } from "./components/ArtworkSection";
import { Storytelling } from "./components/Storytelling";
import { Navigation } from "./components/Navigation";
import { ScrollProgress } from "./components/ScrollProgress";
import { CustomCursor } from "./components/CustomCursor";
import { MusicVisualizerBar } from "./components/MusicVisualizerBar";
import { audioVisualizer } from "./utils/audioSynth";
import { VisualizerSettings } from "./types";

export default function App() {
  const [heroScrollProgress, setHeroScrollProgress] = useState<number>(0);
  const [totalPageProgress, setTotalPageProgress] = useState<number>(0);
  const [isHoveringArtwork, setIsHoveringArtwork] = useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);

  // Music Visualizer Dance Settings (Mouse Attractor & Audio-reactive)
  const [visualizerSettings, setVisualizerSettings] = useState<VisualizerSettings>({
    mode: "homing",
    theme: "persianGold",
    radius: 3.2,
    distance: 550,
    sensitivity: 1.5,
    soundWaveSpeed: 1.0,
  });

  const handleUpdateSettings = useCallback(
    (newSettings: Partial<VisualizerSettings>) => {
      setVisualizerSettings((prev) => ({ ...prev, ...newSettings }));
    },
    []
  );

  useEffect(() => {
    const unsub = audioVisualizer.subscribe((state) => {
      setIsAudioActive(state.isPlaying);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = window.scrollY / totalHeight;
        setTotalPageProgress(Math.min(1, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleAudio = useCallback(() => {
    audioVisualizer.togglePlay();
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div
      id="persian-art-showcase"
      className="relative min-h-screen bg-[#0c0c0c] text-[#e0dcd5] selection:bg-white/20 selection:text-white overflow-x-hidden font-vazir"
    >
      {/* 1. Immersive UI Deep Atmospheric Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -top-40 -left-20" />
        <div className="absolute w-[400px] h-[400px] bg-[#4a3a2a]/10 rounded-full blur-[100px] bottom-0 right-0" />
        <div className="absolute w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[140px] top-1/2 left-1/3" />

        {/* Ambient Subtle Starry Dust Nodes */}
        <div className="absolute w-[1px] h-[1px] bg-white/40 shadow-[0_0_1px_1px_rgba(255,255,255,0.2)] rounded-full top-[15%] left-[25%]" />
        <div className="absolute w-[2px] h-[2px] bg-white/20 rounded-full top-[45%] left-[80%]" />
        <div className="absolute w-[1px] h-[1px] bg-white/30 rounded-full top-[70%] left-[15%]" />
        <div className="absolute w-[2px] h-[2px] bg-white/10 rounded-full top-[30%] left-[60%]" />
        <div className="absolute w-[1px] h-[1px] bg-white/25 rounded-full top-[85%] left-[45%]" />
        <div className="absolute w-[1px] h-[1px] bg-white/15 rounded-full top-[10%] left-[90%]" />
      </div>

      {/* 2. Atmospheric Noise / Film Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 film-grain" />

      {/* 3. Immersive UI Custom Cursor */}
      <CustomCursor isHoveringArtwork={isHoveringArtwork} />

      {/* 4. Canvas Particle Field Synced with Music Visualizer */}
      <ParticleField
        scrollProgress={heroScrollProgress}
        settings={visualizerSettings}
      />

      {/* 5. Immersive UI Navigation Header */}
      <Navigation
        isVisible={heroScrollProgress > 0.15 || totalPageProgress > 0.1}
        audioActive={isAudioActive}
        onToggleAudio={toggleAudio}
        onScrollTo={scrollToSection}
      />

      {/* 6. Music Visualizer Controller & Audio Player Bar */}
      <MusicVisualizerBar
        settings={visualizerSettings}
        onUpdateSettings={handleUpdateSettings}
        pageProgress={totalPageProgress}
      />

      {/* 7. Immersive UI Vertical Scroll Progress */}
      <ScrollProgress
        progress={totalPageProgress}
        onNavigate={scrollToSection}
      />

      {/* 8. SCROLL PIPELINE */}
      <main className="relative z-20">
        <IntroExperience
          onScrollProgressUpdate={setHeroScrollProgress}
          scrollProgress={heroScrollProgress}
        />

        <ArtistReveal
          scrollProgress={heroScrollProgress}
          isInView={heroScrollProgress >= 0.75}
        />

        <ArtworkSection onArtworkHover={setIsHoveringArtwork} />

        <Storytelling />
      </main>

      {/* Footer Colophon */}
      <footer className="relative z-30 py-12 px-8 sm:px-12 border-t border-white/10 bg-[#080808] text-xs text-[#75726a]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-vazir">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-sans text-[#e0dcd5]">
              Exhibition No. 04
            </span>
            <span>•</span>
            <span>مجموعهٔ اختصاصی آثار سارا احمدی</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase opacity-50 font-sans text-[#e0dcd5]">
            <span>SARA AHMADI GALLERY</span>
            <span>•</span>
            <span>TEHRAN — 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
