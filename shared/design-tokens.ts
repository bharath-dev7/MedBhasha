/**
 * MedBhasha Design Tokens
 * Strictly follows ref/04-design-system.md
 * Contrast ratios compliant with WCAG 2.1 AA (4.5:1 text, 3:1 non-text/borders)
 */

export const colors = {
  ink: '#112A3A', // Primary text, strong lines, dark alarm surface backdrop
  paper: '#F6F9FA', // App background (cool, slightly blue-white)
  care: '#0B6E6E', // Primary actions, focus ring base
  verified: '#1F7A3F', // Verified content, taken doses
  caution: '#B35C00', // Unverified content, near-expiry, postponed
  danger: '#B3261E', // Expired, missed, destructive
  surface: '#FFFFFF', // Card/sheet surfaces
  quiet: '#5B6B77', // Secondary text
  lineStrong: '#6F8190', // Component borders (>= 3:1 contrast)
  lineSoft: '#D5DEE3', // Decorative dividers only

  // Supporting tints
  careTint: '#DDEFEF',
  verifiedTint: '#E1F2E6',
  cautionTint: '#FBEBD6',
  dangerTint: '#F9E1DF',
  quietTint: '#ECEFF1',
};

export const typography = {
  fonts: {
    latin: '"Atkinson Hyperlegible", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    telugu: '"Noto Sans Telugu", "Gautami", "Vani", sans-serif',
  },
  lineHeight: {
    latin: 1.45,
    telugu: 1.65, // More vertical room for stacked conjuncts and descenders
  },
  scale: {
    display: { size: '36px', weight: 700, lineHeight: '1.2' },
    title: { size: '28px', weight: 700, lineHeight: '1.3' },
    bodyLg: { size: '22px', weight: 500, lineHeight: '1.45' },
    body: { size: '20px', weight: 400, lineHeight: '1.45' }, // Minimum body size is 20px
    label: { size: '18px', weight: 600, lineHeight: '1.3' },
  },
};

export const spacing = {
  s1: '4px',
  s2: '8px',
  s3: '12px',
  s4: '16px',
  s5: '24px',
  s6: '32px',
  s7: '48px',
};

export const radius = {
  field: '8px',
  panel: '16px',
  action: '28px',
  pill: '9999px',
};

export const targets = {
  minInteractive: '56px',
  primaryAction: '72px',
  minGap: '12px',
};

export const motion = {
  quick: '120ms ease-out',
  base: '200ms ease-out',
};
