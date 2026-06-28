export const tokens = {
  colors: {
    background: "#ffffff",
    backgroundMuted: "#f6f7f9",
    surface: "#ffffff",
    surfaceMuted: "#f8fafc",
    border: "#e5e7eb",
    text: "#111111",
    textMuted: "#6b7280",
    accent: "#1f2937",
    accentSoft: "#eff6ff",
    dockBorder: "rgba(255,255,255,0.5)",
    dockBackground: "rgba(255,255,255,0.72)",
  },
  spacing: {
    pageXMobile: "1rem",
    pageXTablet: "1.5rem",
    pageXDesktop: "2rem",
    sectionGap: "1rem",
  },
  radius: {
    card: "1.5rem",
    cardLg: "1.75rem",
    pill: "999px",
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  layout: {
    contentMaxWidth: "72rem",
    contentMaxWidthNarrow: "48rem",
  },
} as const;

export type DesignTokens = typeof tokens;
