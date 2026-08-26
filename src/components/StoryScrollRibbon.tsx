import React, { useEffect, useState, useRef, useMemo } from "react";

interface StoryScrollRibbonProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export const StoryScrollRibbon: React.FC<StoryScrollRibbonProps> = ({ containerRef }) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState<number>(4500);

  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len > 0) setPathLength(len);
      } catch (e) {
        // fallback
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Section starts entering when rect.top <= windowHeight
      // Section is fully traversed when rect.bottom <= windowHeight / 2
      const totalDistance = rect.height + windowHeight * 0.4;
      const currentPassed = windowHeight - rect.top;

      const progress = Math.min(1, Math.max(0, currentPassed / totalDistance));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  // Primary Intertwining Serpentine Arabesque Path (flows gracefully top to bottom)
  const mainRibbonPath =
    "M 500 0 " +
    "C 500 120, 780 180, 840 320 " +
    "C 900 460, 720 560, 520 620 " +
    "C 320 680, 140 760, 160 920 " +
    "C 180 1080, 420 1140, 680 1220 " +
    "C 920 1300, 880 1480, 760 1580 " +
    "C 640 1680, 260 1700, 180 1860 " +
    "C 100 2020, 360 2160, 500 2260 " +
    "C 540 2290, 500 2340, 500 2380";

  // Secondary Intertwining Counter-Wave (Creates rich 3D braided ribbon effect)
  const secondaryRibbonPath =
    "M 500 40 " +
    "C 450 140, 240 220, 260 380 " +
    "C 280 540, 580 580, 760 690 " +
    "C 940 800, 860 980, 720 1060 " +
    "C 580 1140, 280 1220, 240 1360 " +
    "C 200 1500, 460 1620, 680 1720 " +
    "C 900 1820, 840 2000, 660 2120 " +
    "C 540 2200, 480 2300, 500 2380";

  // Milestone Junction Nodes (Coordinates mapped to story fragment points)
  const milestoneNodes = [
    { id: 1, cx: 840, cy: 320, threshold: 0.15, label: "طنین نخست" },
    { id: 2, cx: 160, cy: 920, threshold: 0.38, label: "تنفس قلم" },
    { id: 3, cx: 760, cy: 1580, threshold: 0.65, label: "عروس خطوط" },
    { id: 4, cx: 180, cy: 1860, threshold: 0.82, label: "غبار زمان" },
    { id: 5, cx: 500, cy: 2260, threshold: 0.94, label: "جاودانگی" },
  ];

  // Dynamic tip coordinate based on path progress
  const tipPoint = useMemo(() => {
    if (!pathRef.current) return null;
    try {
      const currentLength = pathLength * scrollProgress;
      const pt = pathRef.current.getPointAtLength(currentLength);
      return { x: pt.x, y: pt.y };
    } catch (e) {
      return null;
    }
  }, [scrollProgress, pathLength]);

  const strokeOffset = pathLength * (1 - scrollProgress);
  const secondaryStrokeOffset = (pathLength * 0.95) * (1 - Math.max(0, scrollProgress - 0.05) / 0.95);

  return (
    <div
      id="story-scroll-ribbon-wrapper"
      className="absolute inset-0 w-full h-full pointer-events-none -z-1 overflow-hidden"
    >
      <svg
        id="story-intertwining-svg"
        viewBox="0 0 1000 2400"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Luminous Gold Gradient for Primary Scroll Ribbon */}
          <linearGradient id="storyGoldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#f5efe6" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#e5cdab" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#c5a880" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>

          {/* Secondary Subdued Counter-Ribbon Gradient */}
          <linearGradient id="storyCounterRibbonGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5cdab" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#a88c65" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f5efe6" stopOpacity="0.2" />
          </linearGradient>

          {/* Intense Ink Ribbon Diffusion Glow */}
          <filter id="ribbonInkGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial node glow */}
          <radialGradient id="nodeGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5efe6" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#e5cdab" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c5a880" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient atmospheric backdrop trace line */}
        <path
          d={mainRibbonPath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 1. SECONDARY COUNTER-BRAID HAIRLINE (Intertwines & adds depth) */}
        <path
          d={secondaryRibbonPath}
          fill="none"
          stroke="url(#storyCounterRibbonGrad)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
          style={{
            strokeDashoffset: secondaryStrokeOffset,
            transition: "stroke-dashoffset 0.1s ease-out",
          }}
        />

        {/* 2. PRIMARY ANIMATED CALLIGRAPHIC INTERTWINING RIBBON (Scroll-Driven) */}
        <path
          ref={pathRef}
          id="main-story-ribbon-path"
          d={mainRibbonPath}
          fill="none"
          stroke="url(#storyGoldRibbonGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ribbonInkGlow)"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: strokeOffset,
            transition: "stroke-dashoffset 0.08s ease-out",
          }}
        />

        {/* 3. SACRED PERSIAN TALISMAN NODES (Illuminates when passed by scroll line) */}
        {milestoneNodes.map((node) => {
          const isPassed = scrollProgress >= node.threshold;
          const isNear = Math.abs(scrollProgress - node.threshold) < 0.08;

          return (
            <g
              key={node.id}
              className="transition-all duration-700"
              style={{
                opacity: isPassed ? 1 : 0.25,
                transform: `scale(${isPassed ? 1 : 0.8})`,
                transformOrigin: `${node.cx}px ${node.cy}px`,
              }}
            >
              {/* Outer Pulsing Halo */}
              {isPassed && (
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="24"
                  fill="url(#nodeGlowGrad)"
                  className="animate-pulse opacity-60"
                />
              )}

              {/* Concentric Persian Geometric Star Ring */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r="10"
                fill="none"
                stroke="#e5cdab"
                strokeWidth="1"
                strokeDasharray="2 3"
                className={isPassed ? "opacity-80" : "opacity-30"}
              />

              {/* Inner Diamond Knot (Rotated 45deg) */}
              <rect
                x={node.cx - 4}
                y={node.cy - 4}
                width="8"
                height="8"
                fill={isPassed ? "#f5efe6" : "#4a3a2a"}
                stroke="#e5cdab"
                strokeWidth="1"
                transform={`rotate(45 ${node.cx} ${node.cy})`}
                style={{
                  filter: isPassed ? "drop-shadow(0 0 8px #e5cdab)" : "none",
                }}
              />

              {/* Micro Core Spark */}
              {isPassed && (
                <circle cx={node.cx} cy={node.cy} r="1.5" fill="#ffffff" />
              )}
            </g>
          );
        })}

        {/* 4. TRAVELING GOLDEN INK NIB SPARK ON PATH TIP */}
        {tipPoint && scrollProgress > 0.01 && scrollProgress < 0.99 && (
          <g transform={`translate(${tipPoint.x}, ${tipPoint.y})`}>
            {/* Soft Outer Radiance */}
            <circle r="18" fill="url(#nodeGlowGrad)" className="animate-ping opacity-50" />
            <circle
              r="8"
              fill="#e5cdab"
              style={{
                filter: "drop-shadow(0 0 16px #ffffff)",
              }}
              className="opacity-80"
            />
            {/* Crisp Pure White Traveling Nib */}
            <circle r="3.5" fill="#ffffff" />
            <circle r="1.5" fill="#fdfbf7" />
          </g>
        )}

        {/* 5. FINIAL PERSION MEDALLION AT BOTTOM TERMINUS */}
        <g
          transform="translate(500, 2380)"
          className="transition-all duration-700"
          style={{
            opacity: scrollProgress > 0.9 ? 1 : 0.3,
            transform: `translate(500px, 2380px) scale(${scrollProgress > 0.9 ? 1 : 0.85})`,
          }}
        >
          <circle r="16" fill="none" stroke="#e5cdab" strokeWidth="1" strokeDasharray="3 3" />
          <circle r="9" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          <rect
            x="-4"
            y="-4"
            width="8"
            height="8"
            fill="#e5cdab"
            transform="rotate(45)"
          />
          <circle r="2" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};
