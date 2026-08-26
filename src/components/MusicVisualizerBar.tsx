import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Upload,
  Mic,
  Sliders,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Radio,
  FileAudio,
} from "lucide-react";
import { audioVisualizer, AUDIO_TRACKS, AudioState } from "../utils/audioSynth";
import { DanceMode, ColorThemeKey, VisualizerSettings, AudioSourceType } from "../types";
import { COLOR_THEMES, DANCE_MODES } from "./ParticleField";

interface MusicVisualizerBarProps {
  settings: VisualizerSettings;
  onUpdateSettings: (newSettings: Partial<VisualizerSettings>) => void;
  pageProgress?: number;
}

export const MusicVisualizerBar: React.FC<MusicVisualizerBarProps> = ({
  settings,
  onUpdateSettings,
  pageProgress = 0,
}) => {
  const [audioState, setAudioState] = useState<AudioState>(audioVisualizer.getState());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>("");
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Determine if user is near the bottom of the page (storytelling/footer)
  const isNearBottom = pageProgress >= 0.75;

  // Equalizer visualizer live bars (16 bars)
  const eqCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subscribe to audio changes
  useEffect(() => {
    const unsub = audioVisualizer.subscribe((state) => {
      setAudioState(state);
    });
    return unsub;
  }, []);

  // Real-time mini Equalizer wave animation
  useEffect(() => {
    let animId: number;
    const canvas = eqCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderEq = () => {
      const { bands, bass, energy } = audioVisualizer.getAudioMetrics();
      const isPlaying = audioState.isPlaying;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const numBars = 18;
      const barWidth = canvas.width / numBars - 2;
      const step = Math.floor(bands.length / numBars);

      for (let i = 0; i < numBars; i++) {
        let height = 0;
        if (isPlaying && bands.length > 0) {
          const val = bands[i * step] || 0;
          height = (val / 255) * canvas.height * 0.95;
        } else {
          // Subtle resting wave
          height = (Math.sin(Date.now() * 0.003 + i * 0.4) * 0.5 + 0.5) * 4 + 2;
        }

        const x = i * (barWidth + 2);
        const y = canvas.height - height;

        // Gradient coloring
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, "rgba(229, 205, 171, 0.4)");
        grad.addColorStop(1, i < 4 ? "#e5cdab" : i < 12 ? "#48dbfb" : "#ff5c00");

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, height);
      }

      animId = requestAnimationFrame(renderEq);
    };

    animId = requestAnimationFrame(renderEq);

    return () => cancelAnimationFrame(animId);
  }, [audioState.isPlaying]);

  const handleTogglePlay = () => {
    audioVisualizer.togglePlay();
  };

  const handleSelectTrack = (type: AudioSourceType) => {
    audioVisualizer.setSource(type);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      audioVisualizer.setSource("file", file);
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      audioVisualizer.setSource("file", customUrlInput.trim());
      setShowUrlInput(false);
    }
  };

  return (
    <div
      id="music-visualizer-controller"
      className={`fixed left-6 sm:left-12 z-45 font-vazir select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isNearBottom ? "bottom-6 md:bottom-[235px]" : "bottom-6"
      }`}
      style={{ maxWidth: "calc(100vw - 3rem)" }}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* AI Smart Glowing Container with Rotating Border Beam */}
      <div className="relative p-[1.5px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] group">
        {/* Rotating Colored AI Beam (Conic Gradient) */}
        <div
          className={`absolute -inset-[180%] ${
            audioState.isPlaying ? "animate-ai-beam-fast" : "animate-ai-beam"
          }`}
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 200deg, rgba(229, 205, 171, 0.2) 240deg, #48dbfb 285deg, #e5cdab 325deg, #ff7675 350deg, #e5cdab 360deg)",
          }}
        />

        {/* Soft Ambient Glow Halo behind the border */}
        <div
          className={`absolute -inset-[180%] blur-md opacity-45 ${
            audioState.isPlaying ? "animate-ai-beam-fast" : "animate-ai-beam"
          }`}
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 220deg, rgba(72, 219, 251, 0.7) 285deg, rgba(229, 205, 171, 0.9) 330deg, rgba(255, 118, 117, 0.8) 360deg)",
          }}
        />

        {/* Inner Card Content */}
        <div className="relative rounded-[15px] bg-[#111111]/95 backdrop-blur-2xl overflow-hidden transition-all duration-300">
          {/* Subtle AI Particle/Audio Pulse Header Indicator */}
          <div
            className="absolute top-0 inset-x-0 h-[1.5px] opacity-80"
            style={{
              background:
                "linear-gradient(90deg, transparent, #e5cdab, #48dbfb, #ff7675, transparent)",
            }}
          />

          {/* 1. COMPACT DOCK BAR (Always Visible) */}
          <div className="flex items-center gap-3 sm:gap-4 px-4 py-3 min-w-[310px] sm:min-w-[360px]">
          {/* Play / Pause Main Trigger */}
          <button
            id="visualizer-play-btn"
            onClick={handleTogglePlay}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg ${
              audioState.isPlaying
                ? "bg-[#e5cdab] text-[#0c0c0c] shadow-[0_0_20px_rgba(229,205,171,0.5)]"
                : "bg-white/10 hover:bg-white/20 text-[#e0dcd5]"
            }`}
            title={audioState.isPlaying ? "توقف موقت" : "پخش موسیقی و رقص ذرات"}
          >
            {audioState.isLoading ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : audioState.isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} className="translate-x-[1px]" />
            )}
          </button>

          {/* Track Info & Live Frequency Meter */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#e5cdab] animate-pulse" />
              <p className="text-xs font-semibold text-[#f0ece1] truncate">
                {audioState.trackTitle}
              </p>
            </div>
            <div className="flex items-center justify-between mt-1 gap-2">
              <span className="text-[10px] text-[#9c978f] uppercase tracking-wider">
                {audioState.isPlaying ? "در حال همگام‌سازی ذرات..." : "موسیقی خاموش است"}
              </span>

              {/* Mini Spectrum Canvas */}
              <canvas
                ref={eqCanvasRef}
                width={70}
                height={14}
                className="opacity-80 rounded"
              />
            </div>
          </div>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-1.5 px-2">
            <button
              onClick={() =>
                audioVisualizer.setVolume(audioState.volume > 0 ? 0 : 0.8)
              }
              className="text-[#9c978f] hover:text-[#e0dcd5] transition-colors cursor-pointer"
            >
              {audioState.volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioState.volume}
              onChange={(e) => audioVisualizer.setVolume(parseFloat(e.target.value))}
              className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e5cdab]"
            />
          </div>

          {/* Expand / Customize Toggle */}
          <button
            id="toggle-visualizer-controls"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
              isExpanded
                ? "bg-[#e5cdab]/20 border-[#e5cdab]/40 text-[#e5cdab]"
                : "bg-white/5 hover:bg-white/10 border-white/10 text-[#9c978f]"
            }`}
            title="تنظیمات رقص و جلوه‌های ذرات"
          >
            <Sliders size={13} />
            <span className="hidden sm:inline">تنظیم رقص</span>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        {/* 2. EXPANDED CONTROL PANEL (Choreographies, Themes, Audio Inputs) */}
        {isExpanded && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0d0d0d]/95 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Audio Source Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#e5cdab] flex items-center gap-1.5">
                  <Music size={13} /> منبع پخش و موسیقی:
                </span>
                <button
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-[10px] text-[#48dbfb] hover:underline cursor-pointer"
                >
                  {showUrlInput ? "بستن پیوند" : "+ وارد کردن لینک موزیک"}
                </button>
              </div>

              {/* Custom URL Input Bar */}
              {showUrlInput && (
                <form
                  onSubmit={handleCustomUrlSubmit}
                  className="flex gap-2 mb-3 animate-fadeIn"
                >
                  <input
                    type="url"
                    placeholder="https://example.com/music.mp3"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e5cdab]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#e5cdab] text-black font-semibold text-xs rounded-lg hover:bg-white transition-colors cursor-pointer"
                  >
                    پخش
                  </button>
                </form>
              )}

              {/* Track Quick Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* 1. Paradise Circus */}
                <button
                  onClick={() => handleSelectTrack("paradise")}
                  className={`p-2 rounded-xl text-right border transition-all text-xs cursor-pointer flex flex-col ${
                    audioState.sourceType === "paradise"
                      ? "bg-[#e5cdab]/15 border-[#e5cdab] text-white"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-[#a09c95]"
                  }`}
                >
                  <span className="font-semibold text-[11px] text-[#e0dcd5]">
                    سیرک پردیس (Paradise)
                  </span>
                  <span className="text-[9px] opacity-60">الکترونیک داون‌تمپو</span>
                </button>

                {/* 2. Persian Meditative Setar */}
                <button
                  onClick={() => handleSelectTrack("persian")}
                  className={`p-2 rounded-xl text-right border transition-all text-xs cursor-pointer flex flex-col ${
                    audioState.sourceType === "persian"
                      ? "bg-[#e5cdab]/15 border-[#e5cdab] text-white"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-[#a09c95]"
                  }`}
                >
                  <span className="font-semibold text-[11px] text-[#e0dcd5]">
                    موسیقی سنتی و سه‌تار
                  </span>
                  <span className="text-[9px] opacity-60">نوای آرامش‌بخش شرق</span>
                </button>

                {/* 3. Generative Ambient Synth */}
                <button
                  onClick={() => handleSelectTrack("synth")}
                  className={`p-2 rounded-xl text-right border transition-all text-xs cursor-pointer flex flex-col ${
                    audioState.sourceType === "synth"
                      ? "bg-[#e5cdab]/15 border-[#e5cdab] text-white"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-[#a09c95]"
                  }`}
                >
                  <span className="font-semibold text-[11px] text-[#e0dcd5] flex items-center gap-1">
                    <Radio size={11} className="text-[#48dbfb]" /> سینت‌سایزر زنده
                  </span>
                  <span className="text-[9px] opacity-60">فرکانس‌های همایون</span>
                </button>

                {/* 4. Upload Custom File */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-xl text-right border transition-all text-xs cursor-pointer flex flex-col ${
                    audioState.sourceType === "file"
                      ? "bg-[#e5cdab]/15 border-[#e5cdab] text-white"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-[#a09c95]"
                  }`}
                >
                  <span className="font-semibold text-[11px] text-[#e0dcd5] flex items-center gap-1">
                    <Upload size={11} className="text-[#00ffb8]" /> آپلود آهنگ دلخواه
                  </span>
                  <span className="text-[9px] opacity-60">انتخاب MP3 از دستگاه</span>
                </button>

                {/* 5. Live Microphone Input */}
                <button
                  onClick={() => handleSelectTrack("mic")}
                  className={`p-2 rounded-xl text-right border transition-all text-xs cursor-pointer flex flex-col col-span-2 sm:col-span-1 ${
                    audioState.sourceType === "mic"
                      ? "bg-[#e5cdab]/15 border-[#e5cdab] text-white"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-[#a09c95]"
                  }`}
                >
                  <span className="font-semibold text-[11px] text-[#e0dcd5] flex items-center gap-1">
                    <Mic size={11} className="text-[#ff5c00]" /> رقص با میکروفون
                  </span>
                  <span className="text-[9px] opacity-60">واکنش به صدای شما</span>
                </button>
              </div>
            </div>

            {/* Dance Choreography Modes */}
            <div>
              <span className="text-[11px] font-semibold text-[#e5cdab] flex items-center gap-1.5 mb-2">
                <Sparkles size={13} /> الگوی رقص و چیدمان ذرات (Modes):
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(DANCE_MODES) as DanceMode[]).map((modeKey) => {
                  const m = DANCE_MODES[modeKey];
                  const isActive = settings.mode === modeKey;
                  return (
                    <button
                      key={modeKey}
                      onClick={() => onUpdateSettings({ mode: modeKey })}
                      className={`p-2.5 rounded-xl text-right border transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#e5cdab]/20 border-[#e5cdab] text-white shadow-[0_0_15px_rgba(229,205,171,0.2)]"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-[#a09c95]"
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#f0ece1]">
                        {m.nameFa}
                      </div>
                      <div className="text-[9px] opacity-65 mt-0.5">{m.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Themes Palette */}
            <div>
              <span className="text-[11px] font-semibold text-[#e5cdab] flex items-center gap-1.5 mb-2">
                🎨 تم رنگی ذرات (Themes):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(COLOR_THEMES) as ColorThemeKey[]).map((themeKey) => {
                  const t = COLOR_THEMES[themeKey];
                  const isActive = settings.theme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => onUpdateSettings({ theme: themeKey })}
                      className={`p-2 rounded-xl text-right border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isActive
                          ? "bg-white/15 border-white text-white"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-[#a09c95]"
                      }`}
                    >
                      <span className="text-[11px] font-medium truncate">{t.nameFa}</span>
                      <div className="flex -space-x-1 shrink-0">
                        {t.colors.slice(0, 3).map((col, idx) => (
                          <span
                            key={idx}
                            className="w-2.5 h-2.5 rounded-full border border-black/40"
                            style={{ backgroundColor: col }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Intensity & Physics Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/10">
              <div>
                <div className="flex justify-between text-[10px] text-[#9c978f] mb-1">
                  <span>حساسیت به بیس و ضرب‌آهنگ (Sensitivity)</span>
                  <span className="text-[#e5cdab] font-sans">
                    {settings.sensitivity.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.5"
                  step="0.1"
                  value={settings.sensitivity}
                  onChange={(e) =>
                    onUpdateSettings({ sensitivity: parseFloat(e.target.value) })
                  }
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e5cdab]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[#9c978f] mb-1">
                  <span>اندازه و انفجار ریتمیک (Radius / Scale)</span>
                  <span className="text-[#e5cdab] font-sans">
                    {settings.radius.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="7.0"
                  step="0.2"
                  value={settings.radius}
                  onChange={(e) =>
                    onUpdateSettings({ radius: parseFloat(e.target.value) })
                  }
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e5cdab]"
                />
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
