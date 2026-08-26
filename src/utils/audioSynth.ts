import { AudioSourceType } from "../types";

export interface AudioState {
  isPlaying: boolean;
  sourceType: AudioSourceType;
  trackTitle: string;
  volume: number;
  duration: number;
  currentTime: number;
  isLoading: boolean;
  error: string | null;
}

export const AUDIO_TRACKS: Record<
  string,
  { titleFa: string; titleEn: string; url?: string; description: string }
> = {
  paradise: {
    titleFa: "سیرک پردیس (Paradise Circus)",
    titleEn: "Paradise Circus - Massive Attack",
    url: "https://ma77os-media-assets.s3.us-east-2.amazonaws.com/audio/paradise_circus.mp3",
    description: "موسیقی پرطرفدار الکترونیک و داون‌تمپو",
  },
  persian: {
    titleFa: "نوای مراقبه و سه‌تار ایرانی",
    titleEn: "Persian Meditative Ambient & Setar",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-spiritual-ambient-112191.mp3",
    description: "ملودی سنتی و امواج عرفانی شرق",
  },
  synth: {
    titleFa: "سینت‌سایزر هارمونیک زنده (دستگاه همایون)",
    titleEn: "Generative Persian Microtonal Drone",
    description: "تولید لحظه‌ای صوت با فرکانس‌های کوک شرقی و LFO",
  },
  file: {
    titleFa: "آهنگ انتخابی شما",
    titleEn: "Custom Uploaded Track",
    description: "فایل صوتی بارگذاری‌شده از دستگاه شما",
  },
  mic: {
    titleFa: "میکروفون زنده (صدای محیط)",
    titleEn: "Live Microphone Input",
    description: "واکنش مستقیم و زنده ذرات به صدای شما و محیط",
  },
};

export class UniversalAudioVisualizerEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private freqData: Uint8Array = new Uint8Array(256);

  // Sources
  private audioElement: HTMLAudioElement | null = null;
  private mediaElementSource: MediaElementAudioSourceNode | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private synthOscillators: OscillatorNode[] = [];

  // Beat detection state
  private beatCutOff: number = 0;
  private beatDecayRate: number = 0.98;
  private beatHold: number = 0;
  private beatHoldTimer: number = 0;

  // Track State
  private state: AudioState = {
    isPlaying: false,
    sourceType: "paradise",
    trackTitle: AUDIO_TRACKS.paradise.titleFa,
    volume: 0.8,
    duration: 0,
    currentTime: 0,
    isLoading: false,
    error: null,
  };

  private listeners: Set<(state: AudioState) => void> = new Set();
  private customBlobUrl: string | null = null;

  constructor() {
    // Frequency bin buffer initialized
    this.freqData = new Uint8Array(256);
  }

  private emitState() {
    const s = { ...this.state };
    this.listeners.forEach((fn) => fn(s));
  }

  public subscribe(fn: (state: AudioState) => void): () => void {
    this.listeners.add(fn);
    fn({ ...this.state });
    return () => {
      this.listeners.delete(fn);
    };
  }

  public getState(): AudioState {
    return { ...this.state };
  }

  private ensureAudioContext(): boolean {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512; // 256 frequency bins
      this.analyser.smoothingTimeConstant = 0.82;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.state.volume, this.ctx.currentTime);

      this.analyser.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return true;
  }

  public async setSource(
    type: AudioSourceType,
    customFile?: File | string
  ): Promise<boolean> {
    this.stopCurrent();
    this.state.sourceType = type;
    this.state.isLoading = true;
    this.state.error = null;
    this.emitState();

    if (!this.ensureAudioContext() || !this.ctx || !this.analyser) {
      this.state.isLoading = false;
      this.state.error = "Web Audio API پشتیبانی نمی‌شود.";
      this.emitState();
      return false;
    }

    try {
      if (type === "synth") {
        this.state.trackTitle = AUDIO_TRACKS.synth.titleFa;
        this.startSynth();
        this.state.isPlaying = true;
        this.state.isLoading = false;
        this.emitState();
        return true;
      }

      if (type === "mic") {
        this.state.trackTitle = AUDIO_TRACKS.mic.titleFa;
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: false },
        });
        this.micStream = stream;
        this.micSource = this.ctx.createMediaStreamSource(stream);
        this.micSource.connect(this.analyser);
        // Note: do not connect mic to masterGain to prevent feedback loop
        this.state.isPlaying = true;
        this.state.isLoading = false;
        this.emitState();
        return true;
      }

      // Audio file / URL stream
      let audioUrl = "";
      if (type === "file") {
        if (customFile instanceof File) {
          if (this.customBlobUrl) URL.revokeObjectURL(this.customBlobUrl);
          this.customBlobUrl = URL.createObjectURL(customFile);
          audioUrl = this.customBlobUrl;
          this.state.trackTitle = customFile.name || AUDIO_TRACKS.file.titleFa;
        } else if (typeof customFile === "string" && customFile.trim()) {
          audioUrl = customFile.trim();
          this.state.trackTitle = "موسیقی پیوندی آنلاین";
        }
      } else {
        const track = AUDIO_TRACKS[type];
        if (track && track.url) {
          audioUrl = track.url;
          this.state.trackTitle = track.titleFa;
        }
      }

      if (!audioUrl) {
        throw new Error("آدرس فایل صوتی یافت نشد.");
      }

      return await this.loadAndPlayAudio(audioUrl);
    } catch (err: unknown) {
      console.warn("Audio load error:", err);
      this.state.isLoading = false;
      this.state.isPlaying = false;
      this.state.error =
        err instanceof Error ? err.message : "خطا در برقراری اتصال صوتی";
      this.emitState();
      return false;
    }
  }

  private loadAndPlayAudio(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.ctx || !this.analyser) {
        resolve(false);
        return;
      }

      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.src = url;
      audio.preload = "auto";
      audio.volume = 1.0;

      this.audioElement = audio;

      const onCanPlay = () => {
        try {
          if (!this.ctx || !this.analyser) return;

          if (!this.mediaElementSource) {
            this.mediaElementSource = this.ctx.createMediaElementSource(audio);
            this.mediaElementSource.connect(this.analyser);
          }

          audio.play().then(() => {
            this.state.isPlaying = true;
            this.state.isLoading = false;
            this.state.duration = audio.duration || 0;
            this.emitState();
            resolve(true);
          }).catch((e) => {
            console.warn("Auto-play prevented:", e);
            this.state.isLoading = false;
            this.state.isPlaying = false;
            this.emitState();
            resolve(false);
          });
        } catch (e) {
          console.warn("Source connection error:", e);
          resolve(false);
        }
      };

      audio.addEventListener("canplay", onCanPlay, { once: true });
      audio.addEventListener("timeupdate", () => {
        if (this.audioElement) {
          this.state.currentTime = this.audioElement.currentTime;
          this.state.duration = this.audioElement.duration || this.state.duration;
        }
      });
      audio.addEventListener("ended", () => {
        this.state.isPlaying = false;
        this.emitState();
      });
      audio.addEventListener("error", (e) => {
        console.warn("Audio element error", e);
        this.state.isLoading = false;
        this.state.isPlaying = false;
        this.state.error = "عدم امکان بارگذاری فایل صوتی.";
        this.emitState();
        resolve(false);
      });

      audio.load();
    });
  }

  private startSynth() {
    if (!this.ctx || !this.analyser) return;

    this.cleanupSynth();

    const freqs = [73.42, 110.0, 146.83, 220.0, 293.66, 440.0];
    const synthGain = this.ctx.createGain();
    synthGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    synthGain.connect(this.analyser);

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400 + idx * 70, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08 / (idx + 1), this.ctx.currentTime);

      // Vibrato / breathing LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.12 + idx * 0.04, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(1.2, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(synthGain);

      osc.start();
      this.synthOscillators.push(osc, lfo);
    });
  }

  private cleanupSynth() {
    this.synthOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.synthOscillators = [];
  }

  public stopCurrent() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.removeAttribute("src");
      this.audioElement.load();
      this.audioElement = null;
    }
    if (this.mediaElementSource) {
      try {
        this.mediaElementSource.disconnect();
      } catch {}
      this.mediaElementSource = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      try {
        this.micSource.disconnect();
      } catch {}
      this.micSource = null;
    }
    this.cleanupSynth();
    this.state.isPlaying = false;
    this.emitState();
  }

  public togglePlay(): boolean {
    if (this.state.isPlaying) {
      if (this.audioElement) {
        this.audioElement.pause();
      } else if (this.state.sourceType === "synth") {
        this.cleanupSynth();
      }
      this.state.isPlaying = false;
      this.emitState();
      return false;
    } else {
      if (this.audioElement && this.audioElement.src) {
        if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
        this.audioElement.play().then(() => {
          this.state.isPlaying = true;
          this.emitState();
        }).catch(() => {});
        return true;
      } else {
        this.setSource(this.state.sourceType);
        return true;
      }
    }
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.state.volume = clamped;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
    this.emitState();
  }

  public seek(time: number) {
    if (this.audioElement && Number.isFinite(time)) {
      this.audioElement.currentTime = Math.max(0, Math.min(this.state.duration, time));
    }
  }

  /**
   * Reads the current real-time frequency spectrum & energy metrics
   */
  public getAudioMetrics(): {
    bands: Uint8Array;
    bass: number; // 0 to 1
    mid: number; // 0 to 1
    treble: number; // 0 to 1
    energy: number; // 0 to 1
    isBeat: boolean;
    peak: number;
  } {
    if (!this.analyser || !this.state.isPlaying) {
      return {
        bands: this.freqData,
        bass: 0,
        mid: 0,
        treble: 0,
        energy: 0,
        isBeat: false,
        peak: 0,
      };
    }

    this.analyser.getByteFrequencyData(this.freqData);

    const length = this.freqData.length; // 256
    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;
    let totalSum = 0;
    let peak = 0;

    const bassCount = Math.floor(length * 0.12); // ~30 bins (sub-bass & bass)
    const midCount = Math.floor(length * 0.45); // ~115 bins (mids)

    for (let i = 0; i < length; i++) {
      const val = this.freqData[i];
      if (val > peak) peak = val;
      totalSum += val;

      if (i < bassCount) {
        bassSum += val;
      } else if (i < midCount) {
        midSum += val;
      } else {
        trebleSum += val;
      }
    }

    const bass = bassSum / (bassCount * 255);
    const mid = midSum / ((midCount - bassCount) * 255);
    const treble = trebleSum / ((length - midCount) * 255);
    const energy = totalSum / (length * 255);

    // Dynamic Beat Detection with decay
    let isBeat = false;
    if (bass > this.beatCutOff && bass > 0.3) {
      if (this.beatHoldTimer <= 0) {
        isBeat = true;
        this.beatCutOff = bass * 1.15;
        this.beatHoldTimer = 8; // hold for ~8 frames
      }
    } else {
      this.beatCutOff *= this.beatDecayRate;
      this.beatCutOff = Math.max(this.beatCutOff, 0.25);
    }

    if (this.beatHoldTimer > 0) {
      this.beatHoldTimer--;
    }

    return {
      bands: this.freqData,
      bass,
      mid,
      treble,
      energy,
      isBeat,
      peak: peak / 255,
    };
  }
}

// Global Singleton Instance for high-performance direct binding
export const audioVisualizer = new UniversalAudioVisualizerEngine();
export const soundEngine = audioVisualizer;
