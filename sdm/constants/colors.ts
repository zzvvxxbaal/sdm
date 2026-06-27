export const COLORS = {
  // Primary
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Secondary
  secondary: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
  },

  // Neutral
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },

  // Semantic
  success: {
    light: "#dcfce7",
    DEFAULT: "#22c55e",
    dark: "#15803d",
  },
  warning: {
    light: "#fef9c3",
    DEFAULT: "#eab308",
    dark: "#a16207",
  },
  danger: {
    light: "#fee2e2",
    DEFAULT: "#ef4444",
    dark: "#b91c1c",
  },
  info: {
    light: "#dbeafe",
    DEFAULT: "#3b82f6",
    dark: "#1d4ed8",
  },
} as const;

// Dark mode compatible semantic colors
export const THEME_COLORS = {
  background: {
    light: "#ffffff",
    dark: "#0a0a0a",
  },
  surface: {
    light: "#fafafa",
    dark: "#171717",
  },
  border: {
    light: "#e5e5e5",
    dark: "#262626",
  },
  text: {
    primary: {
      light: "#171717",
      dark: "#fafafa",
    },
    secondary: {
      light: "#737373",
      dark: "#a3a3a3",
    },
    muted: {
      light: "#a3a3a3",
      dark: "#525252",
    },
  },
} as const;
