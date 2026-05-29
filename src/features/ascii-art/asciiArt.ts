import { asciify, DEFAULT_OPTIONS } from "asciify-engine";

export interface AsciiArtConfig {
  fontSize?: number
  artStyle?: string
  colorMode?: "grayscale" | "fullcolor" | "matrix" | "accent"
  hoverEffect?: boolean
  ditherStrength?: number
  brightness?: number
  contrast?: number
  invert?: boolean | "auto"
}

export async function createAsciiArt(
  canvas: HTMLCanvasElement,
  src: string,
  config: AsciiArtConfig = {},
) {
  const {
    fontSize = 10,
    artStyle = "classic",
    colorMode = "grayscale",
    hoverEffect = false,
    ditherStrength = 0,
    brightness = 0,
    contrast = 0,
    invert = "auto",
  } = config;

  const options = {
    ...DEFAULT_OPTIONS,
    fontSize,
    colorMode,
    ditherStrength,
    brightness,
    contrast,
    invert,
  };

  if (hoverEffect) {
    options.hoverStrength = 0.6;
    options.hoverRadius = 0.2;
    options.hoverEffect = "spotlight";
  }

  const stop = await asciify(src, canvas, {
    fontSize,
    artStyle: artStyle as never,
    options,
  });

  return () => {
    if (stop) stop();
  };
}
