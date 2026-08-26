import React, { useRef, useEffect } from "react";
import { ARTIST_DATA } from "../data/exhibitionData";

interface OrientalArchPortraitProps {
  revealAmount: number;
  scrollProgress: number;
}

export const OrientalArchPortrait: React.FC<OrientalArchPortraitProps> = ({
  revealAmount: _revealAmount,
  scrollProgress,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardWrapperRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const sheenRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);
  const glintApexRef = useRef<HTMLDivElement | null>(null);

  // Targets & current values for smooth spring/lerp without React re-renders
  const stateRef = useRef({
    targetTiltX: 0,
    targetTiltY: 0,
    currTiltX: 0,
    currTiltY: 0,
    mousePx: 50,
    mousePy: 50,
    isHovered: false,
    scrollProgress: scrollProgress,
    animId: 0,
  });

  // Keep scroll progress updated in ref
  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress;
  }, [scrollProgress]);

  // Single dedicated RAF loop that only runs when animating/interpolating
  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      if (!active) return;

      const s = stateRef.current;
      const dx = s.targetTiltX - s.currTiltX;
      const dy = s.targetTiltY - s.currTiltY;

      // Update current values with smooth lerp
      s.currTiltX += dx * 0.12;
      s.currTiltY += dy * 0.12;

      const scrollTiltX = (s.scrollProgress - 0.85) * 12;
      const totalRotX = s.currTiltX + scrollTiltX;
      const totalRotY = s.currTiltY;

      // Apply transforms directly to DOM elements
      if (cardWrapperRef.current) {
        const scale = s.isHovered ? 1.025 : 1;
        cardWrapperRef.current.style.transform = `rotateX(${totalRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`;
      }

      if (imgRef.current) {
        const imgScale = s.isHovered ? 1.12 : 1.08;
        const imgTx = (-s.currTiltY * 0.7).toFixed(1);
        const imgTy = (s.currTiltX * 0.7).toFixed(1);
        imgRef.current.style.transform = `scale(${imgScale}) translate(${imgTx}px, ${imgTy}px)`;
      }

      if (sheenRef.current) {
        sheenRef.current.style.background = `radial-gradient(circle at ${s.mousePx}% ${s.mousePy}%, rgba(255, 235, 200, 0.16) 0%, transparent 60%)`;
        sheenRef.current.style.opacity = s.isHovered ? "1" : "0";
      }

      if (haloRef.current) {
        haloRef.current.style.opacity = s.isHovered ? "0.95" : "0.75";
      }

      if (glintApexRef.current) {
        glintApexRef.current.style.opacity = s.isHovered ? "0.9" : "0.4";
        glintApexRef.current.style.transform = `translateX(-50%) scale(${s.isHovered ? 1.3 : 1})`;
      }

      s.animId = requestAnimationFrame(renderLoop);
    };

    stateRef.current.animId = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      cancelAnimationFrame(stateRef.current.animId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const mousePx = ((e.clientX - rect.left) / rect.width) * 100;
    const mousePy = ((e.clientY - rect.top) / rect.height) * 100;

    const s = stateRef.current;
    s.targetTiltX = -y * 14;
    s.targetTiltY = x * 16;
    s.mousePx = mousePx;
    s.mousePy = mousePy;
    s.isHovered = true;
  };

  const handleMouseLeave = () => {
    const s = stateRef.current;
    s.targetTiltX = 0;
    s.targetTiltY = 0;
    s.isHovered = false;
    s.mousePx = 50;
    s.mousePy = 50;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[420px] aspect-[1/1.6] select-none cursor-pointer"
      style={{
        perspective: "1200px",
      }}
    >
      {/* 3D Moving Wrapper */}
      <div
        ref={cardWrapperRef}
        className="relative w-full h-full will-change-transform"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Layer 0: Ambient Back Shadow & Oriental Golden Halo */}
        <div
          ref={haloRef}
          className="absolute -inset-6 rounded-t-full -z-10 pointer-events-none transition-opacity duration-500"
          style={{
            transform: "translateZ(-30px)",
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(229, 205, 171, 0.18) 0%, rgba(12, 12, 12, 0.9) 70%)",
            filter: "blur(35px)",
            opacity: 0.75,
          }}
        />

        {/* Layer 1: The Portrait Image with Persian Horseshoe Arch Mask */}
        <div
          className="absolute inset-[32px] sm:inset-[38px] bottom-[28px] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
          style={{
            transform: "translateZ(15px)",
            clipPath: "url(#persianArchClip)",
            background: "#121212",
          }}
        >
          <img
            ref={imgRef}
            src={ARTIST_DATA.portraitUrl}
            alt={ARTIST_DATA.nameFa}
            className="w-full h-full object-cover grayscale-[20%] contrast-[1.15] brightness-[0.9] will-change-transform"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Deep Ambient Gradient at base of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent pointer-events-none" />

          {/* Dynamic Light Sheen overlaying the image on hover */}
          <div
            ref={sheenRef}
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: 0,
            }}
          />

          {/* Persian Atelier Calligraphic Badge */}
          <div
            className="absolute bottom-5 right-5 z-20 flex items-center gap-2"
            style={{ transform: "translateZ(25px)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#e5cdab] shadow-[0_0_8px_#e5cdab]" />
            <span className="text-[9px] tracking-[0.35em] uppercase font-sans text-[#e5cdab]/90 font-medium">
              کارگاه هنر تهران
            </span>
          </div>
        </div>

        {/* Layer 2: Intricate Oriental Archway & Islamic Geometric Linework SVG */}
        <div
          className="absolute inset-0 pointer-events-none overflow-visible"
          style={{
            transform: "translateZ(40px)",
          }}
        >
          <svg
            viewBox="0 0 500 760"
            className="w-full h-full overflow-visible drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Persian Pointed Arch Clip Path for Portrait Image */}
              <clipPath id="persianArchClip" clipPathUnits="objectBoundingBox">
                {/* Normalized coordinates for traditional multi-arc pointed cusp */}
                <path d="M 0 1 L 0 0.42 C 0 0.28 0.14 0.18 0.32 0.09 C 0.42 0.04 0.48 0.01 0.5 0 C 0.52 0.01 0.58 0.04 0.68 0.09 C 0.86 0.18 1 0.28 1 0.42 L 1 1 Z" />
              </clipPath>

              {/* Luminous Gold & Mineral Linework Gradients */}
              <linearGradient id="goldArchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#e5cdab" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#c5a880" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8c6d48" stopOpacity="0.75" />
              </linearGradient>

              <linearGradient id="turquoiseLapisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#48dbfb" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#0abde3" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10ac84" stopOpacity="0.6" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="goldLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* --- 1. Outer Grand Arch Border Frame (Gilded Double Rectangular Surround) --- */}
            <rect
              x="20"
              y="20"
              width="460"
              height="720"
              stroke="url(#goldArchGrad)"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
            <rect
              x="28"
              y="28"
              width="444"
              height="704"
              stroke="url(#goldArchGrad)"
              strokeWidth="0.8"
              strokeDasharray="4 2"
              strokeOpacity="0.3"
            />

            {/* Corner Ornamental L-Brackets */}
            <path d="M 24 44 L 24 24 L 44 24" stroke="url(#goldArchGrad)" strokeWidth="2" />
            <path d="M 476 44 L 476 24 L 456 24" stroke="url(#goldArchGrad)" strokeWidth="2" />
            <path d="M 24 716 L 24 736 L 44 736" stroke="url(#goldArchGrad)" strokeWidth="2" />
            <path d="M 476 716 L 476 736 L 456 736" stroke="url(#goldArchGrad)" strokeWidth="2" />

            {/* --- 2. Top Spandrel (لچکی) with Geometric Islamic Star Motifs (شمسه و گره‌چینی) --- */}
            {/* Left Spandrel 8-Pointed Star & Arabesque Geometry */}
            <g transform="translate(68, 80) scale(0.65)" stroke="url(#goldArchGrad)" strokeWidth="1.2" fill="none" opacity="0.75">
              <polygon points="0,-24 7,-7 24,0 7,7 0,24 -7,7 -24,0 -7,-7" />
              <polygon points="0,-18 5,-5 18,0 5,5 0,18 -5,5 -18,0 -5,-5" strokeDasharray="2 1" />
              <circle cx="0" cy="0" r="4" fill="#e5cdab" />
              <circle cx="0" cy="0" r="30" strokeDasharray="3 3" opacity="0.4" />
              <line x1="-38" y1="0" x2="38" y2="0" strokeWidth="0.6" opacity="0.4" />
              <line x1="0" y1="-38" x2="0" y2="38" strokeWidth="0.6" opacity="0.4" />
              <line x1="-26" y1="-26" x2="26" y2="26" strokeWidth="0.6" opacity="0.3" />
              <line x1="-26" y1="26" x2="26" y2="-26" strokeWidth="0.6" opacity="0.3" />
            </g>

            {/* Right Spandrel 8-Pointed Star */}
            <g transform="translate(432, 80) scale(0.65)" stroke="url(#goldArchGrad)" strokeWidth="1.2" fill="none" opacity="0.75">
              <polygon points="0,-24 7,-7 24,0 7,7 0,24 -7,7 -24,0 -7,-7" />
              <polygon points="0,-18 5,-5 18,0 5,5 0,18 -5,5 -18,0 -5,-5" strokeDasharray="2 1" />
              <circle cx="0" cy="0" r="4" fill="#e5cdab" />
              <circle cx="0" cy="0" r="30" strokeDasharray="3 3" opacity="0.4" />
              <line x1="-38" y1="0" x2="38" y2="0" strokeWidth="0.6" opacity="0.4" />
              <line x1="0" y1="-38" x2="0" y2="38" strokeWidth="0.6" opacity="0.4" />
              <line x1="-26" y1="-26" x2="26" y2="26" strokeWidth="0.6" opacity="0.3" />
              <line x1="-26" y1="26" x2="26" y2="-26" strokeWidth="0.6" opacity="0.3" />
            </g>

            {/* Minor celestial stars scattered in spandrel */}
            <circle cx="120" cy="54" r="1.5" fill="#e5cdab" opacity="0.7" />
            <circle cx="145" cy="78" r="1.2" fill="#ffffff" opacity="0.6" />
            <circle cx="380" cy="54" r="1.5" fill="#e5cdab" opacity="0.7" />
            <circle cx="355" cy="78" r="1.2" fill="#ffffff" opacity="0.6" />

            {/* --- 3. Concentric Multi-Tiered Oriental Arches (طاق‌های تودرتوی گنبدی و شاهانه) --- */}

            {/* Outer Grand Pointed Arch (طاق پنج و هفت بیرونی) */}
            <path
              d="M 45 720 L 45 320 C 45 220 120 130 250 42 C 380 130 455 220 455 320 L 455 720"
              stroke="url(#goldArchGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#goldLineGlow)"
            />

            {/* Middle Horseshoe Arch with Intricate Multi-Cusp Scallops (طاق جناغی دندانه‌دار) */}
            <path
              d="M 58 720 L 58 335 C 58 245 135 155 250 72 C 365 155 442 245 442 335 L 442 720"
              stroke="url(#goldArchGrad)"
              strokeWidth="1.2"
              strokeDasharray="8 4"
              opacity="0.8"
            />

            {/* Inner Delicate Arch bordering the image (طاق داخلی) */}
            <path
              d="M 72 720 L 72 350 C 72 265 145 180 250 102 C 355 180 428 265 428 350 L 428 720"
              stroke="#ffffff"
              strokeWidth="1"
              strokeOpacity="0.6"
            />

            {/* Inner-most hairline beaded tracer */}
            <path
              d="M 82 720 L 82 360 C 82 280 152 200 250 125 C 348 200 418 280 418 360 L 418 720"
              stroke="url(#goldArchGrad)"
              strokeWidth="0.8"
              strokeDasharray="2 3"
              strokeOpacity="0.5"
            />

            {/* --- 4. Apex Finial & Toranj (ترنج و شمسه راس طاق) --- */}
            <g transform="translate(250, 42)">
              <path
                d="M 0 -22 L 4 -12 L 0 -4 L -4 -12 Z"
                fill="url(#goldArchGrad)"
                stroke="#ffffff"
                strokeWidth="0.5"
              />
              <circle cx="0" cy="-26" r="3" fill="#ffffff" filter="url(#goldLineGlow)" />
              <circle cx="0" cy="0" r="5" fill="#e5cdab" stroke="#ffffff" strokeWidth="1" />
              <line x1="0" y1="-8" x2="0" y2="-18" stroke="url(#goldArchGrad)" strokeWidth="1.5" />
              <line x1="-10" y1="-5" x2="-18" y2="-10" stroke="url(#goldArchGrad)" strokeWidth="1" />
              <line x1="10" y1="-5" x2="18" y2="-10" stroke="url(#goldArchGrad)" strokeWidth="1" />
            </g>

            {/* Secondary Mid-Arch Toranj Medallion */}
            <g transform="translate(250, 102)">
              <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
              <polygon points="0,-8 2.5,-2.5 8,0 2.5,2.5 0,8 -2.5,2.5 -8,0 -2.5,-2.5" stroke="url(#goldArchGrad)" strokeWidth="0.8" />
            </g>

            {/* --- 5. Left & Right Architectural Columns (ستون‌های ظریف اسلیمی با سرستون و پایه) --- */}

            {/* Left Column Shaft & Capital */}
            <g transform="translate(45, 0)">
              <path d="M -16 320 L 16 320 L 12 334 L -12 334 Z" fill="#221e1a" stroke="url(#goldArchGrad)" strokeWidth="1.2" />
              <path d="M -20 310 L 20 310 L 16 320 L -16 320 Z" fill="#181512" stroke="url(#goldArchGrad)" strokeWidth="1.4" />
              <line x1="-12" y1="324" x2="12" y2="324" stroke="url(#goldArchGrad)" strokeWidth="0.8" />
              <circle cx="0" cy="315" r="2.5" fill="#e5cdab" />

              <line x1="-8" y1="334" x2="-8" y2="700" stroke="url(#goldArchGrad)" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="0" y1="334" x2="0" y2="700" stroke="url(#goldArchGrad)" strokeWidth="1.2" strokeOpacity="0.6" />
              <line x1="8" y1="334" x2="8" y2="700" stroke="url(#goldArchGrad)" strokeWidth="0.8" strokeOpacity="0.4" />

              <path d="M -12 700 L 12 700 L 16 714 L -16 714 Z" fill="#181512" stroke="url(#goldArchGrad)" strokeWidth="1.2" />
              <rect x="-20" y="714" width="40" height="12" fill="#221e1a" stroke="url(#goldArchGrad)" strokeWidth="1.4" />
            </g>

            {/* Right Column Shaft & Capital */}
            <g transform="translate(455, 0)">
              <path d="M -16 320 L 16 320 L 12 334 L -12 334 Z" fill="#221e1a" stroke="url(#goldArchGrad)" strokeWidth="1.2" />
              <path d="M -20 310 L 20 310 L 16 320 L -16 320 Z" fill="#181512" stroke="url(#goldArchGrad)" strokeWidth="1.4" />
              <line x1="-12" y1="324" x2="12" y2="324" stroke="url(#goldArchGrad)" strokeWidth="0.8" />
              <circle cx="0" cy="315" r="2.5" fill="#e5cdab" />

              <line x1="-8" y1="334" x2="-8" y2="700" stroke="url(#goldArchGrad)" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="0" y1="334" x2="0" y2="700" stroke="url(#goldArchGrad)" strokeWidth="1.2" strokeOpacity="0.6" />
              <line x1="8" y1="334" x2="8" y2="700" stroke="url(#goldArchGrad)" strokeWidth="0.8" strokeOpacity="0.4" />

              <path d="M -12 700 L 12 700 L 16 714 L -16 714 Z" fill="#181512" stroke="url(#goldArchGrad)" strokeWidth="1.2" />
              <rect x="-20" y="714" width="40" height="12" fill="#221e1a" stroke="url(#goldArchGrad)" strokeWidth="1.4" />
            </g>

            {/* --- 6. Lower Geometric Inscription / Dado Ribbon (حاشیه کتیبه و گره‌چینی زیرین) --- */}
            <g transform="translate(0, 715)">
              <line x1="20" y1="0" x2="480" y2="0" stroke="url(#goldArchGrad)" strokeWidth="1.5" />
              <path
                d="M 45 8 L 55 16 L 65 8 L 75 16 L 85 8 L 95 16 L 105 8 L 115 16 L 125 8 L 135 16 L 145 8 L 155 16 L 165 8 L 175 16 L 185 8 L 195 16 L 205 8 L 215 16 L 225 8 L 235 16 L 245 8 L 255 16 L 265 8 L 275 16 L 285 8 L 295 16 L 305 8 L 315 16 L 325 8 L 335 16 L 345 8 L 355 16 L 365 8 L 375 16 L 385 8 L 395 16 L 405 8 L 415 16 L 425 8 L 435 16 L 445 8 L 455 16"
                stroke="url(#goldArchGrad)"
                strokeWidth="0.9"
                fill="none"
                opacity="0.6"
              />
              <line x1="20" y1="24" x2="480" y2="24" stroke="url(#goldArchGrad)" strokeWidth="1.2" />
            </g>
          </svg>
        </div>

        {/* Layer 3: Floating Foreground 3D Highlights (Glints on corners & Apex) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transform: "translateZ(65px)" }}
        >
          {/* Luminous Specular Point on Arch Apex */}
          <div
            ref={glintApexRef}
            className="absolute top-[26px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#ffffff] transition-transform duration-300"
            style={{
              opacity: 0.4,
              transform: "translateX(-50%) scale(1)",
            }}
          />

          {/* Left Column Light Glint */}
          <div
            className="absolute top-[42%] left-[42px] w-2 h-2 rounded-full bg-[#e5cdab] shadow-[0_0_10px_#e5cdab] opacity-40"
          />

          {/* Right Column Light Glint */}
          <div
            className="absolute top-[42%] right-[42px] w-2 h-2 rounded-full bg-[#e5cdab] shadow-[0_0_10px_#e5cdab] opacity-40"
          />
        </div>
      </div>
    </div>
  );
};
