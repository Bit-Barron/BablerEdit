export interface ColorScheme {
  id: string;
  label: string;
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  ring: string;
  ringDark: string;
  swatch: string;
}

export interface BorderRadiusOption {
  id: string;
  label: string;
  value: string;
}

export interface FontOption {
  id: string;
  label: string;
  fontHead: string;
  fontSans: string;
  preview: string;
}

export interface DesignSettings {
  colorScheme: string;
  borderRadius: string;
  font: string;
  dialogShake: boolean;
}

export const DEFAULT_DESIGN_SETTINGS: DesignSettings = {
  colorScheme: "yellow",
  borderRadius: "sharp",
  font: "retro",
  dialogShake: true,
};

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: "yellow",
    label: "Retro Yellow",
    primary: "#ffdb33",
    primaryHover: "#ffcc00",
    primaryForeground: "#000",
    accent: "#fae583",
    accentForeground: "#000",
    ring: "#000",
    ringDark: "#ffdb33",
    swatch: "#ffdb33",
  },
  {
    id: "blue",
    label: "Ocean Blue",
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    primaryForeground: "#fff",
    accent: "#bfdbfe",
    accentForeground: "#000",
    ring: "#3b82f6",
    ringDark: "#60a5fa",
    swatch: "#3b82f6",
  },
  {
    id: "green",
    label: "Forest Green",
    primary: "#22c55e",
    primaryHover: "#16a34a",
    primaryForeground: "#000",
    accent: "#bbf7d0",
    accentForeground: "#000",
    ring: "#22c55e",
    ringDark: "#4ade80",
    swatch: "#22c55e",
  },
  {
    id: "rose",
    label: "Rose Pink",
    primary: "#f43f5e",
    primaryHover: "#e11d48",
    primaryForeground: "#fff",
    accent: "#fecdd3",
    accentForeground: "#000",
    ring: "#f43f5e",
    ringDark: "#fb7185",
    swatch: "#f43f5e",
  },
  {
    id: "orange",
    label: "Sunset Orange",
    primary: "#f97316",
    primaryHover: "#ea580c",
    primaryForeground: "#000",
    accent: "#fed7aa",
    accentForeground: "#000",
    ring: "#f97316",
    ringDark: "#fb923c",
    swatch: "#f97316",
  },
  {
    id: "purple",
    label: "Royal Purple",
    primary: "#a855f7",
    primaryHover: "#9333ea",
    primaryForeground: "#fff",
    accent: "#e9d5ff",
    accentForeground: "#000",
    ring: "#a855f7",
    ringDark: "#c084fc",
    swatch: "#a855f7",
  },
];

export const BORDER_RADIUS_OPTIONS: BorderRadiusOption[] = [
  { id: "sharp", label: "Sharp", value: "0" },
  { id: "subtle", label: "Subtle", value: "0.25rem" },
  { id: "rounded", label: "Rounded", value: "0.5rem" },
  { id: "pill", label: "Pill", value: "0.75rem" },
];

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "retro",
    label: "Retro",
    fontHead: '"Archivo Black", sans-serif',
    fontSans: '"Space Grotesk", sans-serif',
    preview: "Archivo Black",
  },
  {
    id: "modern",
    label: "Modern",
    fontHead: '"Inter", sans-serif',
    fontSans: '"Inter", sans-serif',
    preview: "Inter",
  },
  {
    id: "serif",
    label: "Serif",
    fontHead: '"Merriweather", serif',
    fontSans: '"Merriweather", serif',
    preview: "Merriweather",
  },
  {
    id: "mono",
    label: "Mono",
    fontHead: '"JetBrains Mono", monospace',
    fontSans: '"JetBrains Mono", monospace',
    preview: "JetBrains Mono",
  },
];
