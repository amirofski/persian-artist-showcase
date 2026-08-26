import React from "react";
import { ARTIST_DATA } from "../data/exhibitionData";
import { OrientalArchPortrait } from "./OrientalArchPortrait";

interface ArtistRevealProps {
  scrollProgress: number;
  isInView: boolean;
}

export const ArtistReveal: React.FC<ArtistRevealProps> = ({ scrollProgress }) => {
  const revealAmount = Math.max(0, Math.min(1, (scrollProgress - 0.78) / 0.18));

  return (
    <section
      id="artist-section"
      className="relative min-h-screen w-full flex items-center justify-center py-24 sm:py-32 px-6 sm:px-12 z-30 overflow-hidden"
    >
      {/* Immersive UI Deep Atmospheric Glows */}
      <div
        className="absolute w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -top-20 -left-20 pointer-events-none -z-10"
      />
      <div
        className="absolute w-[450px] h-[450px] bg-[#4a3a2a]/15 rounded-full blur-[100px] bottom-0 right-0 pointer-events-none -z-10"
      />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Oriental Islamic Arch Portrait with 3D Mouse Parallax & Linework Frame */}
        <div
          id="artist-portrait-container"
          className="lg:col-span-6 relative flex justify-center order-2 lg:order-1 items-center"
        >
          <OrientalArchPortrait
            revealAmount={revealAmount}
            scrollProgress={scrollProgress}
          />
        </div>

        {/* Right Column: Artist Information & Statements */}
        <div
          id="artist-info-container"
          className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8 order-1 lg:order-2"
        >
          {/* Eyebrow metadata */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.4em] uppercase opacity-40 font-sans">
              Exhibition No. 04
            </span>
            <span className="w-8 h-[1px] bg-white/20" />
            <span className="font-garamond tracking-widest text-xs uppercase text-[#e0dcd5] opacity-70">
              {ARTIST_DATA.nameEn}
            </span>
          </div>

          {/* Artist Persian Name & Title */}
          <div className="space-y-2">
            <h2
              id="artist-name-fa"
              className="font-vazir text-4xl sm:text-5xl lg:text-6xl text-[#e0dcd5] font-bold tracking-tight"
            >
              {ARTIST_DATA.nameFa}
            </h2>
            <p
              id="artist-title-fa"
              className="font-vazir text-base sm:text-lg text-[#e0dcd5] opacity-60 tracking-wide"
            >
              {ARTIST_DATA.titleFa}
            </p>
          </div>

          {/* Curatorial Statement */}
          <div className="border-r border-white/20 pr-5 py-1">
            <p className="font-vazir text-lg sm:text-xl text-[#e0dcd5] opacity-80 italic leading-relaxed font-light">
              «{ARTIST_DATA.statementFa}»
            </p>
            <p className="font-garamond italic text-sm text-[#8c887e] mt-2">
              "{ARTIST_DATA.statementEn}"
            </p>
          </div>

          {/* Bio paragraphs */}
          <div className="space-y-3 font-vazir text-sm sm:text-base text-[#a8a49c] leading-relaxed font-light">
            {ARTIST_DATA.bioFa.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Exhibitions */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-sans mb-3 text-[#e0dcd5]">
              Selected Exhibitions
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ARTIST_DATA.exhibitions.slice(0, 4).map((ex, idx) => (
                <div key={idx} className="flex flex-col text-xs">
                  <span className="text-[#e0dcd5] font-medium">{ex.titleFa}</span>
                  <span className="text-[#75726a]">{ex.galleryFa}، {ex.cityFa} ({ex.year})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
