/**
 * Design tokens for the Property Group intranet.
 * Source of truth: docs/design-handoff.md (repo root). Confirmed authoritative
 * over the older palette in CLAUDE.md — see docs/design-handoff.md's table.
 */
export const colors = {
  primary: '#4D1A63',
  accent: '#A01BD7',
  accentMid: '#C764F0',
  accentLight: '#E4A3FF',
  surfaceTint: '#F1D1FF',
  panelTint: '#F9EDFF',
  neutralPanel: '#F5F1F8',
  border: '#E3DCE9',
  textSecondary: '#6E6178',
  textPrimary: '#2E2136',
  signal: '#EBFF00'
} as const;

export const typography = {
  heading: "'Plus Jakarta Sans', sans-serif",
  body: "'DM Sans', sans-serif",
  googleFontsUrl:
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap'
} as const;

export const radii = {
  small: '10px',
  medium: '14px',
  large: '18px',
  hero: '22px',
  pill: '999px'
} as const;

export const layout = {
  sidebarWidth: '264px'
} as const;
