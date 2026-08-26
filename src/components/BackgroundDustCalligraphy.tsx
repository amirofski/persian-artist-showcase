import React, { useMemo } from "react";

interface FloatingCalligraphyMarkProps {
  scrollProgress: number;
}

// Background oversized poetic calligraphy strokes and letterforms bleeding off canvas
export const BackgroundDustCalligraphy: React.FC<FloatingCalligraphyMarkProps> = ({ scrollProgress }) => {
  // Fade out cleanly before artist section
  const fadeOpacity = useMemo(() => {
    if (scrollProgress > 0.80) return 0;
    if (scrollProgress > 0.70) return (0.80 - scrollProgress) / 0.10;
    return 1;
  }, [scrollProgress]);

  if (scrollProgress >= 0.80 || fadeOpacity <= 0.01) return null;

  return (
    <div
      id="bg-dust-calligraphy"
      className="fixed inset-0 pointer-events-none z-[12] overflow-hidden select-none transition-opacity duration-300"
      style={{ opacity: fadeOpacity }}
      aria-hidden="true"
    >
      {/* 1. Giant Persian letter 'Haa / ه' bleeding off top-right */}
      <div
        className="absolute -top-[12%] -right-[10%] w-[55vw] max-w-[680px] aspect-square transition-transform duration-700 ease-out opacity-[0.07]"
        style={{
          transform: `translate3d(${scrollProgress * 40}px, ${-scrollProgress * 30}px, 0) rotate(${
            -12 + scrollProgress * 10
          }deg)`,
        }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full stroke-[#f5efe6] fill-none overflow-visible"
          style={{ strokeWidth: 1.2, strokeDasharray: "1200", strokeDashoffset: "0" }}
        >
          <path
            d="M420,120 C380,60 260,70 200,160 C140,250 170,360 260,390 C350,420 440,320 400,230 C370,160 280,180 240,260 C210,320 250,380 320,380 C390,380 430,310 420,240 C410,170 330,130 250,160"
            strokeLinecap="round"
          />
          <path
            d="M480,90 C430,40 310,50 240,130 C180,200 130,290 110,400"
            stroke="rgba(197, 168, 128, 0.4)"
            strokeWidth="0.6"
            strokeDasharray="6 4"
          />
        </svg>
      </div>

      {/* 2. Sweeping Persian Nastaliq ' کشیده / Kashida ' flourish bleeding off bottom-left */}
      <div
        className="absolute -bottom-[15%] -left-[14%] w-[65vw] max-w-[850px] aspect-[16/9] transition-transform duration-700 ease-out opacity-[0.065]"
        style={{
          transform: `translate3d(${-scrollProgress * 50}px, ${scrollProgress * 20}px, 0) rotate(${
            6 - scrollProgress * 8
          }deg)`,
        }}
      >
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full stroke-[#c5a880] fill-none overflow-visible"
          style={{ strokeWidth: 1.4 }}
        >
          <path
            d="M20,380 C180,390 320,350 460,260 C580,180 670,90 780,40 C750,90 620,220 490,300 C360,380 210,420 40,410"
            strokeLinecap="round"
          />
          {/* Subtle Persian Diacritic Point / Nuqta */}
          <rect
            x="640"
            y="110"
            width="32"
            height="32"
            transform="rotate(45 656 126)"
            stroke="rgba(245, 239, 230, 0.6)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* 3. Persian Letter 'Noon / ن' curve bleeding off middle-right */}
      <div
        className="absolute top-[38%] -right-[8%] w-[42vw] max-w-[500px] aspect-square transition-transform duration-700 ease-out opacity-[0.055]"
        style={{
          transform: `translate3d(${scrollProgress * 25}px, ${scrollProgress * 40}px, 0) rotate(${
            18 + scrollProgress * 12
          }deg)`,
        }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full stroke-[#e5cdab] fill-none overflow-visible"
          style={{ strokeWidth: 1 }}
        >
          <path
            d="M360,110 C370,220 310,320 200,340 C90,360 30,270 40,180 C45,130 90,80 150,90"
            strokeLinecap="round"
          />
          {/* Central Point Nuqta */}
          <rect
            x="200"
            y="190"
            width="22"
            height="22"
            transform="rotate(45 211 201)"
            stroke="rgba(245, 239, 230, 0.7)"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      {/* 4. Delicate Persian 'Ayn / ع' loop bleeding off top-left */}
      <div
        className="absolute -top-[10%] -left-[8%] w-[38vw] max-w-[460px] aspect-square transition-transform duration-700 ease-out opacity-[0.06]"
        style={{
          transform: `translate3d(${-scrollProgress * 30}px, ${-scrollProgress * 20}px, 0) rotate(${
            -8 + scrollProgress * 6
          }deg)`,
        }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full stroke-[#ffffff] fill-none overflow-visible"
          style={{ strokeWidth: 0.9 }}
        >
          <path
            d="M120,80 C180,40 240,60 260,120 C270,160 230,200 180,210 C110,220 40,290 50,370 C60,430 150,460 240,430 C330,400 390,300 380,200"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
