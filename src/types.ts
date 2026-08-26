export interface Artwork {
  id: string;
  titleFa: string;
  titleEn: string;
  subtitleFa: string;
  mediumFa: string;
  yearFa: string;
  yearEn: string;
  dimensionsFa: string;
  dimensionsEn: string;
  descriptionFa: string;
  descriptionEn: string;
  imageUrl: string;
  palette: string[];
  theme: string;
  featured?: boolean;
}

export interface StoryFragment {
  id: string;
  lineFa: string;
  sublineFa?: string;
  englishTranslation?: string;
  note?: string;
  accent?: boolean;
}

export interface ArtistProfile {
  nameFa: string;
  nameEn: string;
  titleFa: string;
  titleEn: string;
  locationFa: string;
  locationEn: string;
  bioFa: string[];
  statementFa: string;
  statementEn: string;
  portraitUrl: string;
  exhibitions: {
    year: string;
    titleFa: string;
    galleryFa: string;
    cityFa: string;
  }[];
}

export interface ParticleConfig {
  countDesktop: number;
  countMobile: number;
  baseSpeed: number;
  dustOpacity: number;
  accentOpacity: number;
  morphSpeed: number;
  interactionRadius: number;
}

export type DanceMode = "homing" | "cosmic" | "cubic" | "conic" | "torus";

export type ColorThemeKey =
  | "persianGold"
  | "pinkBlue"
  | "yellowRed"
  | "blueGray"
  | "yellowGreen"
  | "blackWhite";

export type AudioSourceType = "synth" | "paradise" | "persian" | "file" | "mic";

export interface VisualizerSettings {
  mode: DanceMode;
  theme: ColorThemeKey;
  radius: number; // Size/beat scale multiplier
  distance: number; // Audio dispersion distance
  sensitivity: number; // Beat reaction sensitivity
  soundWaveSpeed: number;
}
