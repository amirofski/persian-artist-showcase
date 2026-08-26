import React, { useEffect, useRef } from "react";
import { audioVisualizer } from "../utils/audioSynth";
import { DanceMode, ColorThemeKey, VisualizerSettings } from "../types";

export const COLOR_THEMES: Record<
  ColorThemeKey,
  { nameFa: string; nameEn: string; colors: string[]; glow: string }
> = {
  persianGold: {
    nameFa: "طلایی و لاجورد ایرانی",
    nameEn: "Persian Gold & Lapis",
    colors: ["#e5cdab", "#d4af37", "#c5a880", "#48dbfb", "#ffffff"],
    glow: "rgba(229, 205, 171, 0.45)",
  },
  pinkBlue: {
    nameFa: "صورتی نئون و سایبر",
    nameEn: "Neon Pink & Cyan",
    colors: ["#ff0032", "#ff5c00", "#00ffb8", "#53ff00"],
    glow: "rgba(0, 255, 184, 0.5)",
  },
  yellowRed: {
    nameFa: "کهربایی و یاقوتی",
    nameEn: "Ruby & Sunset Amber",
    colors: ["#ecd078", "#d95b43", "#c02942", "#542437", "#53777a"],
    glow: "rgba(217, 91, 67, 0.5)",
  },
  blueGray: {
    nameFa: "فیروزه‌ای و اقیانوس",
    nameEn: "Turquoise & Oceanic Cyan",
    colors: ["#343838", "#005f6b", "#008c9e", "#00b4cc", "#00dffc"],
    glow: "rgba(0, 223, 252, 0.5)",
  },
  yellowGreen: {
    nameFa: "زمردی و زیتونی",
    nameEn: "Emerald & Olive Green",
    colors: ["#f7f6af", "#9bd6a3", "#4e8264", "#2ed573", "#d62822"],
    glow: "rgba(155, 214, 163, 0.5)",
  },
  blackWhite: {
    nameFa: "تک‌رنگ کیهانی (سیاه و سفید)",
    nameEn: "Monochrome Starfield",
    colors: ["#ffffff", "#c8c8c8", "#999999", "#ffffff", "#ffffff"],
    glow: "rgba(255, 255, 255, 0.4)",
  },
};

export const DANCE_MODES: Record<
  DanceMode,
  { nameFa: string; nameEn: string; desc: string }
> = {
  homing: {
    nameFa: "تعقیب و انفجار ماوس (Attractor Swarm)",
    nameEn: "Mouse Attractor",
    desc: "شتاب‌گیری و هجوم به سمت ماوس با انفجار در تماس",
  },
  cosmic: {
    nameFa: "کیهانی سه‌بعدی (Cosmic 3D)",
    nameEn: "Cosmic Depth",
    desc: "شناوری آزاد در عمق کیهان با امواج باس",
  },
  conic: {
    nameFa: "چرخش سماع (Conic Vortex)",
    nameEn: "Conic Vortex",
    desc: "گرداب و رقص مدور ذرات حول مرکز موسیقی",
  },
  cubic: {
    nameFa: "شبکه هارمونیک (Cubic Lattice)",
    nameEn: "Harmonic Cube",
    desc: "آرایش مکعبی و ارتعاش شبکه‌ای با ریتم",
  },
  torus: {
    nameFa: "حلقه اسلیمی (Sacred Mandala)",
    nameEn: "Sacred Torus",
    desc: "مدارهای متمرکز تپنده با فرکانس‌های صوتی",
  },
};

interface ParticleItem {
  // Coordinates
  x: number;
  y: number;
  z: number;
  xInit: number;
  yInit: number;
  zInit: number;

  // Velocity & Acceleration Physics
  velocity: number;
  baseVelocity: number;
  vx: number;
  vy: number;
  vz: number;

  // Homing & Burst State (exact as in user algorithm)
  changed: boolean;
  changedFrame: number;
  maxChangedFrames: number;
  burstRadius: number;

  // Interactive offsets & orbits
  mouseRad: number;
  orbitAngle: number;
  orbitSpeed: number;
  orbitRadius: number;

  // Visual Attributes
  hue: number;
  alpha: number;
  targetAlpha: number;
  size: number;
  initialSize: number;
  currScale: number;
  s: number;
  color: string;
  isBokeh: boolean;
  pulsePhase: number;
  pulseSpeed: number;

  // Audio frequency band
  indexBand: number;
}

interface ParticleFieldProps {
  scrollProgress?: number;
  settings?: VisualizerSettings;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  scrollProgress = 0,
  settings,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<ParticleItem[]>([]);
  const animationFrameRef = useRef<number>(0);
  const scrollProgressRef = useRef<number>(scrollProgress);
  const globalHueRef = useRef<number>(45);

  // Settings in ref to avoid recreating RAF
  const settingsRef = useRef<VisualizerSettings>({
    mode: settings?.mode || "homing",
    theme: settings?.theme || "persianGold",
    radius: settings?.radius ?? 3.2,
    distance: settings?.distance ?? 550,
    sensitivity: settings?.sensitivity ?? 1.5,
    soundWaveSpeed: settings?.soundWaveSpeed ?? 1.0,
  });

  const mouseRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    active: boolean;
  }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
  });

  const shockwaveRef = useRef<{ radius: number; maxRadius: number; strength: number }>({
    radius: 0,
    maxRadius: 0,
    strength: 0,
  });

  // Keep scroll progress updated
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Keep settings updated
  useEffect(() => {
    if (settings) {
      const prevMode = settingsRef.current.mode;
      const prevTheme = settingsRef.current.theme;
      settingsRef.current = { ...settings };

      if (prevMode !== settings.mode && canvasRef.current) {
        repositionParticles(
          particlesRef.current,
          settings.mode,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }

      if (prevTheme !== settings.theme) {
        applyTheme(particlesRef.current, settings.theme);
      }
    }
  }, [settings]);

  // Re-apply Theme colors to particles
  const applyTheme = (particles: ParticleItem[], themeKey: ColorThemeKey) => {
    const theme = COLOR_THEMES[themeKey] || COLOR_THEMES.persianGold;
    const colors = theme.colors;
    const pad = Math.max(1, Math.ceil(particles.length / colors.length));

    particles.forEach((p, i) => {
      const colorIdx = Math.floor(i / pad) % colors.length;
      p.color = colors[colorIdx];
      // Distribute frequency bands logarithmically
      const groupNorm = i / particles.length;
      p.indexBand = Math.min(255, Math.max(2, Math.floor(Math.pow(groupNorm, 1.3) * 240)));
      p.s = (Math.random() * 0.8 + 0.4) * (1 + (colors.length - colorIdx) * 0.15);
    });
  };

  // Reset a single particle (for homing respawns)
  const resetParticle = (
    p: ParticleItem,
    width: number,
    height: number,
    globalHue: number
  ) => {
    const isBokeh = Math.random() < 0.16;
    const size = isBokeh ? Math.random() * 3.5 + 2.0 : Math.random() * 2.8 + 1.2;

    p.hue = globalHue;
    p.alpha = 0;
    p.targetAlpha = isBokeh ? Math.random() * 0.4 + 0.2 : Math.random() * 0.8 + 0.35;
    p.size = size;
    p.initialSize = size;
    p.currScale = 1.0;

    // Spawn randomly across viewport or near borders
    p.x = Math.random() * width;
    p.y = Math.random() * height;
    p.z = (Math.random() - 0.5) * 400;

    p.xInit = p.x;
    p.yInit = p.y;
    p.zInit = p.z;

    p.baseVelocity = size * 0.45;
    p.velocity = p.baseVelocity;
    p.changed = false;
    p.changedFrame = 0;
    p.maxChangedFrames = Math.floor(Math.random() * 25 + 35);
    p.burstRadius = 50 + Math.random() * 20;
  };

  // Reposition particles for different geometric dance modes
  const repositionParticles = (
    particles: ParticleItem[],
    mode: DanceMode,
    width: number,
    height: number
  ) => {
    const cpX = width / 2;
    const cpY = height / 2;
    const spreadX = width * 1.3;
    const spreadY = height * 1.3;
    const size = Math.min(width, height) * 0.45;

    particles.forEach((p, i) => {
      p.changed = false;
      p.changedFrame = 0;
      p.velocity = p.baseVelocity;

      switch (mode) {
        case "homing": {
          // Distributed starting points
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.z = (Math.random() - 0.5) * 300;
          p.xInit = p.x;
          p.yInit = p.y;
          p.zInit = p.z;
          break;
        }
        case "cubic": {
          const cols = Math.ceil(Math.cbrt(particles.length));
          const ix = i % cols;
          const iy = Math.floor(i / cols) % cols;
          const iz = Math.floor(i / (cols * cols));
          const step = (size * 2) / cols;

          p.xInit = cpX + (ix - cols / 2) * step + (Math.random() - 0.5) * 20;
          p.yInit = cpY + (iy - cols / 2) * step + (Math.random() - 0.5) * 20;
          p.zInit = (iz - cols / 2) * step * 1.5;
          p.x = p.xInit;
          p.y = p.yInit;
          p.z = p.zInit;
          break;
        }
        case "conic": {
          const angle = (i / particles.length) * Math.PI * 8 + Math.random() * 0.5;
          const dist = Math.pow(i / particles.length, 0.6) * size * 1.3;
          p.xInit = cpX + Math.cos(angle) * dist;
          p.yInit = cpY + Math.sin(angle) * dist;
          p.zInit = (Math.random() - 0.5) * 600;
          p.orbitAngle = angle;
          p.orbitRadius = dist;
          p.orbitSpeed = 0.008 + (1 - i / particles.length) * 0.015;
          p.x = p.xInit;
          p.y = p.yInit;
          p.z = p.zInit;
          break;
        }
        case "torus": {
          const rings = 5;
          const ringIdx = i % rings;
          const angle = ((Math.floor(i / rings) * 1.0) / (particles.length / rings)) * Math.PI * 2;
          const ringRadius = (ringIdx + 1) * (size / rings);
          p.xInit = cpX + Math.cos(angle) * ringRadius;
          p.yInit = cpY + Math.sin(angle) * ringRadius;
          p.zInit = Math.sin(angle * 3) * 120;
          p.orbitAngle = angle;
          p.orbitRadius = ringRadius;
          p.orbitSpeed = 0.005 * (ringIdx % 2 === 0 ? 1 : -1);
          p.x = p.xInit;
          p.y = p.yInit;
          p.z = p.zInit;
          break;
        }
        case "cosmic":
        default: {
          p.xInit = cpX + (Math.random() - 0.5) * spreadX;
          p.yInit = cpY + (Math.random() - 0.5) * spreadY;
          p.zInit = (Math.random() - 0.5) * 1000;
          p.x = p.xInit;
          p.y = p.yInit;
          p.z = p.zInit;
          break;
        }
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initial mouse center position
    mouseRef.current.x = width / 2;
    mouseRef.current.y = height / 2;
    mouseRef.current.targetX = width / 2;
    mouseRef.current.targetY = height / 2;

    const isMobile = width < 768;
    const count = isMobile ? 220 : 380;

    const particles: ParticleItem[] = [];

    for (let i = 0; i < count; i++) {
      const isBokeh = Math.random() < 0.16;
      const size = isBokeh ? Math.random() * 3.5 + 2.0 : Math.random() * 2.8 + 1.2;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: (Math.random() - 0.5) * 400,
        xInit: 0,
        yInit: 0,
        zInit: 0,
        velocity: size * 0.45,
        baseVelocity: size * 0.45,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        vz: (Math.random() - 0.5) * 0.2,
        changed: false,
        changedFrame: 0,
        maxChangedFrames: Math.floor(Math.random() * 25 + 35),
        burstRadius: 50 + Math.random() * 20,
        mouseRad: Math.random(),
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: 0.008,
        orbitRadius: Math.random() * 300,
        hue: globalHueRef.current,
        alpha: 0,
        targetAlpha: isBokeh ? Math.random() * 0.4 + 0.2 : Math.random() * 0.8 + 0.35,
        size,
        initialSize: size,
        currScale: 1.0,
        s: 1.0,
        color: "#e5cdab",
        isBokeh,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        indexBand: Math.floor(Math.random() * 200),
      });
    }

    particlesRef.current = particles;
    applyTheme(particles, settingsRef.current.theme);
    repositionParticles(particles, settingsRef.current.mode, width, height);

    // Resize Handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      repositionParticles(particlesRef.current, settingsRef.current.mode, width, height);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Mouse & Touch Tracker (following user's requested touches logic)
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const m = mouseRef.current;
      if ("touches" in e && e.touches.length > 0) {
        m.targetX = e.touches[0].clientX;
        m.targetY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        m.targetX = (e as MouseEvent).clientX;
        m.targetY = (e as MouseEvent).clientY;
      }
      m.active = true;
    };

    const handlePointerLeave = () => {
      const m = mouseRef.current;
      m.active = false;
      m.targetX = width / 2;
      m.targetY = height / 2;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchstart", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    // Render loop
    let time = 0;

    const render = () => {
      time += 0.016;
      globalHueRef.current = (globalHueRef.current + 0.3) % 360;

      ctx.clearRect(0, 0, width, height);

      const m = mouseRef.current;
      // Smooth mouse lerp
      if (m.active) {
        m.x += (m.targetX - m.x) * 0.12;
        m.y += (m.targetY - m.y) * 0.12;
      } else {
        // Subtle autonomous breathing Lissajous orbit when mouse idle
        const idleX = width / 2 + Math.cos(time * 0.6) * (width * 0.25);
        const idleY = height / 2 + Math.sin(time * 0.8) * (height * 0.18);
        m.x += (idleX - m.x) * 0.03;
        m.y += (idleY - m.y) * 0.03;
      }

      // Audio Frequency Metrics
      const audioMetrics = audioVisualizer.getAudioMetrics();
      const isMusicPlaying = audioVisualizer.getState().isPlaying;
      const { bands, bass, mid, treble, energy, isBeat } = audioMetrics;

      const pSettings = settingsRef.current;
      const sensitivity = pSettings.sensitivity;
      const musicRadiusMult = pSettings.radius;
      const mode = pSettings.mode;

      // Trigger visual shockwave on beat kicks
      if (isBeat && isMusicPlaying) {
        shockwaveRef.current = {
          radius: 10,
          maxRadius: Math.min(width, height) * 0.6,
          strength: 1.0 + bass * 1.5,
        };
      }

      // Update shockwave
      const sw = shockwaveRef.current;
      if (sw.strength > 0.01) {
        sw.radius += (sw.maxRadius - sw.radius) * 0.12;
        sw.strength *= 0.92;
      }

      const pArr = particlesRef.current;
      const screenPoints: { sx: number; sy: number; alpha: number; color: string }[] = [];
      const trackLimit = isMobile ? 35 : 60;

      for (let i = 0; i < pArr.length; i++) {
        const p = pArr[i];
        p.pulsePhase += p.pulseSpeed;

        // Music frequency band reaction
        let bandVal = 0;
        if (isMusicPlaying && bands.length > 0) {
          bandVal = bands[p.indexBand] / 255;
        }

        // --- Homing & Chase Physics (Core User Algorithm) ---
        if (mode === "homing") {
          const pointX = m.x;
          const pointY = m.y;
          const dx = pointX - p.x;
          const dy = pointY - p.y;
          const dist = Math.hypot(dx, dy);

          // Audio-reactive impact radius boost
          const reactiveBurstRadius = p.burstRadius * (isMusicPlaying ? 1 + bass * 0.6 : 1);

          if (p.changed) {
            // Exploding state: expands and fades out smoothly
            p.alpha *= 0.92;
            p.size += 1.8 * (isMusicPlaying ? 1 + bandVal : 1);
            p.changedFrame++;
            if (p.changedFrame > p.maxChangedFrames || p.alpha < 0.01) {
              resetParticle(p, width, height, globalHueRef.current);
            }
          } else if (dist < reactiveBurstRadius) {
            // Trigger explosion on arrival
            p.changed = true;
          } else {
            // Chasing the mouse with velocity acceleration
            const angle = Math.atan2(dy, dx);
            p.alpha = Math.min(p.targetAlpha, p.alpha + 0.012);

            const speedMultiplier = isMusicPlaying ? 1 + bandVal * 1.5 + energy * 0.8 : 1.0;
            p.x += p.velocity * Math.cos(angle) * speedMultiplier;
            p.y += p.velocity * Math.sin(angle) * speedMultiplier;

            // Velocity accelerates towards the target
            p.velocity += 0.022 * speedMultiplier;

            // Boundary wrapping
            if (p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50) {
              resetParticle(p, width, height, globalHueRef.current);
            }
          }
        } else if (mode === "conic") {
          // Vortex orbiting around the center / mouse
          const rotSpeed = p.orbitSpeed * (isMusicPlaying ? 1 + energy * 3 : 1);
          p.orbitAngle += rotSpeed;
          const dynamicRad = p.orbitRadius * (isMusicPlaying ? 1 + bandVal * 0.6 + bass * 0.4 : 1);

          const targetX = m.x + Math.cos(p.orbitAngle) * dynamicRad;
          const targetY = m.y + Math.sin(p.orbitAngle) * dynamicRad;

          p.x += (targetX - p.x) * 0.1;
          p.y += (targetY - p.y) * 0.1;
          p.alpha = Math.min(p.targetAlpha, p.alpha + 0.02);
        } else if (mode === "cubic") {
          // Harmonic cubic lattice
          const waveX = Math.sin(p.xInit * 0.01 + time * 2) * (isMusicPlaying ? bandVal * 50 : 10);
          const waveY = Math.cos(p.yInit * 0.01 + time * 2) * (isMusicPlaying ? mid * 40 : 8);

          const dx = m.x - p.xInit;
          const dy = m.y - p.yInit;
          const angle = Math.atan2(dy, dx);
          const r = p.mouseRad * 120 + 20;

          const targetX = p.xInit + waveX - Math.cos(angle) * (r * 0.3);
          const targetY = p.yInit + waveY - Math.sin(angle) * (r * 0.3);

          p.x += (targetX - p.x) * 0.08;
          p.y += (targetY - p.y) * 0.08;
          p.alpha = Math.min(p.targetAlpha, p.alpha + 0.02);
        } else if (mode === "torus") {
          // Concentric mandala rings
          p.orbitAngle += p.orbitSpeed * (isMusicPlaying ? 1 + treble * 2 : 1);
          const dynamicRadius = p.orbitRadius * (isMusicPlaying ? 1 + bass * 0.5 : 1);

          const targetX = m.x + Math.cos(p.orbitAngle) * dynamicRadius;
          const targetY = m.y + Math.sin(p.orbitAngle) * dynamicRadius;

          p.x += (targetX - p.x) * 0.1;
          p.y += (targetY - p.y) * 0.1;
          p.alpha = Math.min(p.targetAlpha, p.alpha + 0.02);
        } else {
          // Cosmic 3D Floating
          const driftSpeed = isMusicPlaying ? 1 + energy * 2.5 : 1.0;
          p.x += p.vx * driftSpeed;
          p.y += p.vy * driftSpeed;

          if (p.x > width + 60) p.x = -60;
          else if (p.x < -60) p.x = width + 60;
          if (p.y > height + 60) p.y = -60;
          else if (p.y < -60) p.y = height + 60;

          // Repulsion from mouse
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 200) {
            const angle = Math.atan2(dy, dx);
            p.x -= Math.cos(angle) * (200 - dist) * 0.04;
            p.y -= Math.sin(angle) * (200 - dist) * 0.04;
          }
          p.alpha = Math.min(p.targetAlpha, p.alpha + 0.02);
        }

        // Beat Shockwave radial displacement
        if (sw.strength > 0.05) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const pDist = Math.hypot(dx, dy);
          const diff = Math.abs(pDist - sw.radius);
          if (diff < 70) {
            const push = (1 - diff / 70) * sw.strength * 18;
            const pushAngle = Math.atan2(dy, dx);
            p.x += Math.cos(pushAngle) * push;
            p.y += Math.sin(pushAngle) * push;
          }
        }

        // Render Scale with audio frequency
        let targetScale = 1.0;
        if (isMusicPlaying) {
          const bandBoost = bandVal * p.s * 2.5 * sensitivity;
          const bassBoost = (p.indexBand < 40 ? bass * 2.0 : 0) * sensitivity;
          targetScale = (0.3 + bandBoost + bassBoost) * (musicRadiusMult / 3.0);
        } else {
          targetScale = (0.85 + Math.sin(p.pulsePhase) * 0.15) * (musicRadiusMult / 3.0);
        }

        p.currScale += (targetScale - p.currScale) * 0.25;
        const renderSize = Math.max(0.8, p.size * p.currScale);
        const renderAlpha = Math.min(1, Math.max(0.04, p.alpha));

        // Sample screen points for constellation connections
        if (i < trackLimit && renderAlpha > 0.25 && !p.changed) {
          screenPoints.push({
            sx: p.x,
            sy: p.y,
            alpha: renderAlpha,
            color: p.color,
          });
        }

        // --- Draw Particle (Stroke & Fill as in user code) ---
        if (p.changed) {
          // Burst Halo Ring (Stroke style as in user code)
          ctx.beginPath();
          ctx.arc(p.x, p.y, renderSize, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = renderAlpha * 0.8;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // Glow Halo for large or high energy particles
          if (p.isBokeh || renderSize > 2.5 || (isMusicPlaying && bandVal > 0.55)) {
            const glowRad = renderSize * 2.4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowRad, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = renderAlpha * (isMusicPlaying ? 0.35 : 0.18);
            ctx.fill();
          }

          // Core Solid Fill
          ctx.beginPath();
          ctx.arc(p.x, p.y, renderSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = renderAlpha;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;

      // --- Neural Constellation Connection Lines ---
      const maxConnDist = isMusicPlaying ? 80 + bass * 30 : 65;
      const maxConnDistSq = maxConnDist * maxConnDist;

      for (let mIdx = 0; mIdx < screenPoints.length; mIdx++) {
        const p1 = screenPoints[mIdx];
        for (let nIdx = mIdx + 1; nIdx < screenPoints.length; nIdx++) {
          const p2 = screenPoints[nIdx];
          const ddx = p1.sx - p2.sx;
          const ddy = p1.sy - p2.sy;
          const distSq = ddx * ddx + ddy * ddy;

          if (distSq < maxConnDistSq) {
            const lineAlpha =
              (1 - distSq / maxConnDistSq) *
              Math.min(p1.alpha, p2.alpha) *
              (isMusicPlaying ? 0.45 + energy * 0.35 : 0.22);

            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = isMusicPlaying ? 0.8 + bass * 0.6 : 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchstart", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="cosmic-music-canvas-particles"
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{
        background: "transparent",
      }}
    />
  );
};
