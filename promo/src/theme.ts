import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadLilita } from "@remotion/google-fonts/LilitaOne";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";

/** ShipNLearn palette (same tokens as the app). */
export const C = {
  ocean: "#1E90FF",
  oceanDeep: "#0B5FC4",
  oceanLight: "#7CC4FF",
  sand: "#FFD66B",
  sandDeep: "#E8A93A",
  coral: "#FF5D73",
  lime: "#7ED957",
  ink: "#1B1F3B",
  inkSoft: "#3A4170",
  foam: "#F4F7FF",
  grape: "#8B5CF6",
  lava: "#E8590C",
};

export const FONT = {
  display: loadLilita("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  body: loadNunito("normal", { weights: ["700", "800", "900"], subsets: ["latin"] }).fontFamily,
  mono: loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily,
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;
