import React, { useState, useEffect } from "react";
import { FEATURED_ARTWORK, GALLERY_ARTWORKS } from "../data/exhibitionData";
import { Artwork } from "../types";
import { X } from "lucide-react";
import { Artwork3DCard } from "./Artwork3DCard";

interface ArtworkSectionProps {
  onArtworkHover?: (isHovering: boolean) => void;
}

export const ArtworkSection: React.FC<ArtworkSectionProps> = ({ onArtworkHover }) => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [activeTab, setActiveTab] = useState<"featured" | "series">("featured");
  const [currentFeatured] = useState<Artwork>(FEATURED_ARTWORK);

  const openLightbox = (art: Artwork) => {
    setSelectedArtwork(art);
  };

  const closeLightbox = () => {
    setSelectedArtwork(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedArtwork) {
        closeLightbox();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedArtwork]);

  return (
    <section
      id="artwork-section"
      className="relative min-h-screen w-full flex flex-col justify-center py-24 sm:py-36 px-6 sm:px-12 z-30 overflow-hidden"
    >
      {/* Deep Immersive Atmospheric Glow */}
      <div
        className="absolute top-1/3 right-1/4 w-[650px] h-[650px] bg-white/5 rounded-full blur-[120px] pointer-events-none -z-10"
      />
      <div
        className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#4a3a2a]/10 rounded-full blur-[100px] pointer-events-none -z-10"
      />

      <div className="max-w-7xl w-full mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] tracking-[0.4em] uppercase opacity-40 font-sans text-[#e0dcd5]">
                Exhibition Selection
              </span>
            </div>
            <h2 className="font-vazir font-light text-3xl sm:text-4xl lg:text-5xl text-[#e0dcd5]">
              شاهکار برگزیده
            </h2>
          </div>

          {/* Series Switcher */}
          <div className="flex items-center gap-2 bg-[#141414] p-1 rounded-full border border-white/10">
            <button
              id="tab-featured"
              onClick={() => setActiveTab("featured")}
              className={`px-4 py-1.5 rounded-full text-xs font-vazir transition-all cursor-pointer ${
                activeTab === "featured"
                  ? "bg-white/15 text-[#ffffff] font-medium shadow"
                  : "text-[#9c9890] hover:text-[#e0dcd5]"
              }`}
            >
              اثر اصلی (در جستجوی سکوت)
            </button>
            <button
              id="tab-series"
              onClick={() => setActiveTab("series")}
              className={`px-4 py-1.5 rounded-full text-xs font-vazir transition-all cursor-pointer ${
                activeTab === "series"
                  ? "bg-white/15 text-[#ffffff] font-medium shadow"
                  : "text-[#9c9890] hover:text-[#e0dcd5]"
              }`}
            >
              مجموعهٔ تکمیلی (فریم‌های مربع)
            </button>
          </div>
        </div>

        {/* MAIN FEATURED MONUMENTAL ARTWORK */}
        {activeTab === "featured" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Cinematic Large Artwork Viewport with 3D Tilt */}
            <div className="lg:col-span-8">
              <Artwork3DCard
                artwork={currentFeatured}
                variant="monumental"
                onOpenLightbox={openLightbox}
                onHoverState={onArtworkHover}
              />
            </div>

            {/* Artwork Curatorial Metadata Column */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-sans text-[#e0dcd5]">
                  {currentFeatured.titleEn}
                </span>
                <h3
                  id="featured-artwork-title"
                  className="font-vazir font-light text-3xl sm:text-4xl text-[#e0dcd5]"
                >
                  «{currentFeatured.titleFa}»
                </h3>
                <p className="font-vazir text-sm text-[#a8a49c] font-light">
                  {currentFeatured.subtitleFa}
                </p>
              </div>

              {/* Medium and Year specifications */}
              <div className="bg-[#141414] p-5 rounded-lg border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                  <span className="text-[#75726a] font-vazir">تکنیک:</span>
                  <span className="text-[#e0dcd5] font-vazir text-left max-w-[200px] leading-tight">
                    {currentFeatured.mediumFa}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                  <span className="text-[#75726a] font-vazir">ابعاد اثر:</span>
                  <span className="text-[#e0dcd5] font-vazir font-cinzel">
                    {currentFeatured.dimensionsFa}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#75726a] font-vazir">سال خلق:</span>
                  <span className="text-[#e0dcd5] font-vazir">
                    {currentFeatured.yearFa} ({currentFeatured.yearEn})
                  </span>
                </div>
              </div>

              {/* Curatorial Description */}
              <p className="font-vazir text-sm text-[#a8a49c] leading-relaxed font-light">
                {currentFeatured.descriptionFa}
              </p>

              {/* Palette extracted swatches */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 font-sans block text-[#e0dcd5]">
                  Mineral Pigments
                </span>
                <div className="flex items-center gap-2">
                  {currentFeatured.palette.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full border border-white/10 shadow-inner transition-transform hover:scale-115 cursor-help"
                      style={{ backgroundColor: color }}
                      title={`Pigment ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* COMPLEMENTARY SERIES GRID (Square Frames with 3D Hover & Beautiful Persian Fine Lines) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GALLERY_ARTWORKS.map((art) => (
              <Artwork3DCard
                key={art.id}
                artwork={art}
                variant="square-gallery"
                onOpenLightbox={openLightbox}
                onHoverState={onArtworkHover}
              />
            ))}
          </div>
        )}
      </div>

      {/* DETAILED LIGHTBOX MODAL */}
      {selectedArtwork && (
        <div
          id="artwork-lightbox-modal"
          role="dialog"
          aria-modal="true"
          aria-label="نمایش جزئیات اثر"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#060606]/95 backdrop-blur-xl animate-fade-in"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-[#121212] border border-white/15 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="btn-close-lightbox"
              onClick={closeLightbox}
              aria-label="بستن"
              className="absolute top-4 left-4 z-20 p-2 rounded-full bg-[#0c0c0c]/80 text-[#e0dcd5] hover:text-white border border-white/15 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* High-res Image Area */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden min-h-[300px] md:min-h-[500px]">
              <img
                src={selectedArtwork.imageUrl}
                alt={selectedArtwork.titleFa}
                className="max-h-[85vh] w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Curatorial Details Area */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-sans text-[#e0dcd5]">
                  {selectedArtwork.titleEn}
                </span>

                <h3 className="font-vazir text-2xl sm:text-3xl text-[#e0dcd5] font-light">
                  {selectedArtwork.titleFa}
                </h3>
                <p className="font-vazir text-sm text-[#a8a49c]">
                  {selectedArtwork.subtitleFa}
                </p>

                <div className="space-y-2 py-4 border-y border-white/10 text-xs font-vazir">
                  <div className="flex justify-between">
                    <span className="text-[#75726a]">تکنیک:</span>
                    <span className="text-[#e0dcd5]">{selectedArtwork.mediumFa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#75726a]">ابعاد:</span>
                    <span className="text-[#e0dcd5]">{selectedArtwork.dimensionsFa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#75726a]">سال خلق:</span>
                    <span className="text-[#e0dcd5]">{selectedArtwork.yearFa} ({selectedArtwork.yearEn})</span>
                  </div>
                </div>

                <p className="font-vazir text-sm text-[#a8a49c] leading-relaxed font-light">
                  {selectedArtwork.descriptionFa}
                </p>
                <p className="font-garamond italic text-xs text-[#7e7b72] leading-relaxed">
                  "{selectedArtwork.descriptionEn}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 font-sans text-[#e0dcd5]">
                  Sara Ahmadi Archive
                </span>
                <button
                  onClick={closeLightbox}
                  className="px-4 py-1.5 rounded text-xs font-vazir bg-white/10 text-[#e0dcd5] hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
