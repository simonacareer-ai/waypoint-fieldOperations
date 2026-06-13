export const BREAKPOINTS = {
  mobile: 390,
  tablet: 1024,
  desktop: 1440,
} as const;

export const SPACING = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;

export const RADIUS = {
  xs: "8px",
  sm: "10px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  pill: "999px",
} as const;

export const SHADOWS = {
  sm: "0 1px 2px rgba(15,23,42,0.06)",
  md: "0 4px 12px rgba(15,23,42,0.08)",
  lg: "0 10px 24px rgba(15,23,42,0.10)",
} as const;

export const CONTROL_SIZES = {
  standard: 48,
  cta: 56,
  iconButton: 40,
  minTapTarget: 48,
  wizardButton: 64,
} as const;
