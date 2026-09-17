// libs/helical-ui/src/themes.ts
// Theme registry for helical-ui's shadcn-compatible theme presets.
// Ported from diffbook — each name maps to a `.theme-{name}` / `.theme-{name}.dark`
// block in `src/themes/{name}.css` (all imported by `@cloudvoyant/helical-ui/themes.css`).
export interface ThemeMeta {
  name: string;
  label: string;
}

export const THEMES: ThemeMeta[] = [
  { name: 'amber-minimal', label: 'Amber Minimal' },
  { name: 'amethyst-haze', label: 'Amethyst Haze' },
  { name: 'anthropic', label: 'Anthropic' },
  { name: 'anyscale', label: 'Anyscale' },
  { name: 'bold-tech', label: 'Bold Tech' },
  { name: 'bubblegum', label: 'Bubblegum' },
  { name: 'caffeine', label: 'Caffeine' },
  { name: 'candyland', label: 'Candyland' },
  { name: 'catppuccin', label: 'Catppuccin' },
  { name: 'claude', label: 'Claude' },
  { name: 'claymorphism', label: 'Claymorphism' },
  { name: 'clean-slate', label: 'Clean Slate' },
  { name: 'cosmic-night', label: 'Cosmic Night' },
  { name: 'cyberpunk', label: 'Cyberpunk' },
  { name: 'darkmatter', label: 'Darkmatter' },
  { name: 'default', label: 'Default' },
  { name: 'doom-64', label: 'Doom 64' },
  { name: 'elegant-luxury', label: 'Elegant Luxury' },
  { name: 'graphite', label: 'Graphite' },
  { name: 'green', label: 'Green' },
  { name: 'kodama-grove', label: 'Kodama Grove' },
  { name: 'lambda', label: 'Lambda' },
  { name: 'mdbook', label: 'mdBook' },
  { name: 'midnight-bloom', label: 'Midnight Bloom' },
  { name: 'mocha-mousse', label: 'Mocha Mousse' },
  { name: 'modern-minimal', label: 'Modern Minimal' },
  { name: 'mono', label: 'Mono' },
  { name: 'nature', label: 'Nature' },
  { name: 'neo-brutalism', label: 'Neo Brutalism' },
  { name: 'northern-lights', label: 'Northern Lights' },
  { name: 'notebook', label: 'Notebook' },
  { name: 'ocean-breeze', label: 'Ocean Breeze' },
  { name: 'openai', label: 'Openai' },
  { name: 'pastel-dreams', label: 'Pastel Dreams' },
  { name: 'perpetuity', label: 'Perpetuity' },
  { name: 'quantum-rose', label: 'Quantum Rose' },
  { name: 'retro-arcade', label: 'Retro Arcade' },
  { name: 'rose', label: 'Rose' },
  { name: 'sage-garden', label: 'Sage Garden' },
  { name: 'slate', label: 'Slate' },
  { name: 'soft-pop', label: 'Soft Pop' },
  { name: 'solar-dusk', label: 'Solar Dusk' },
  { name: 'starry-night', label: 'Starry Night' },
  { name: 'sunset-horizon', label: 'Sunset Horizon' },
  { name: 'supabase', label: 'Supabase' },
  { name: 't3-chat', label: 'T3 Chat' },
  { name: 'tangerine', label: 'Tangerine' },
  { name: 'twitter', label: 'Twitter' },
  { name: 'vercel', label: 'Vercel' },
  { name: 'vintage-paper', label: 'Vintage Paper' },
  { name: 'violet-bloom', label: 'Violet Bloom' },
  { name: 'vitepress', label: 'Vitepress' },
  { name: 'helical-ui', label: 'Helical UI' },
];

export const THEME_NAMES: string[] = THEMES.map((t) => t.name);
