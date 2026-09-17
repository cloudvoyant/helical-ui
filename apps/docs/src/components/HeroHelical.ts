// apps/docs/src/components/HeroHelical.ts
// Animated DNA/helical-ui hero background: two out-of-phase sine backbones with
// base-pair rungs, drifting over soft flowing gradient fields (in the spirit of
// the classic "gradient topography" pens). Theme-aware (reads --primary /
// --foreground / --accent so it adapts to light and dark), and respects
// prefers-reduced-motion by rendering a single static frame.

function oklchToRgb(oklch: string): { r: number; g: number; b: number } {
  const m = oklch.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!m) return { r: 128, g: 128, b: 128 };
  const L = parseFloat(m[1]);
  const C = parseFloat(m[2]);
  const H = (parseFloat(m[3]) * Math.PI) / 180;
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m2 = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const r = 4.0767416621 * l - 3.3077115913 * m2 + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m2 - 0.3413193965 * s;
  const bb = -0.0041960863 * l - 0.7034186147 * m2 + 1.707614701 * s;
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)));
  return { r: clamp(r), g: clamp(g), b: clamp(bb) };
}

export function initHeroHelical() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-helical-ui]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let primary = { r: 128, g: 128, b: 128 };
  // Purple palette for the base-pair rungs and background fields.
  const purpleDeep = oklchToRgb('oklch(0.5 0.24 300)');
  const purpleMid = oklchToRgb('oklch(0.62 0.22 308)');
  const purpleLight = oklchToRgb('oklch(0.78 0.13 306)');
  const readColors = () => {
    const v = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    primary = oklchToRgb(v('--primary'));
  };
  readColors();
  // Theme switchers toggle a class (e.g. `dark`) on <html>; re-read --primary
  // so the backbones follow the active theme (draw loop picks it up next frame).
  const themeObserver = new MutationObserver(() => readColors());
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  const mix = (c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }, t: number) => ({
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t),
  });

  let width = 0;
  let height = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  const rgba = (c: { r: number; g: number; b: number }, alpha: number) => `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;

  const blob = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  };

  const draw = (t: number) => {
    const time = t / 1000;
    ctx.clearRect(0, 0, width, height);
    const w = width;
    const h = height;

    // Soft flowing gradient fields — tinted with varying purple shades.
    blob(
      w * (0.2 + 0.12 * Math.sin(time * 0.4)),
      h * (0.2 + 0.1 * Math.cos(time * 0.3)),
      w * 0.5,
      rgba(purpleMid, 0.07),
    );
    blob(
      w * (0.82 + 0.1 * Math.cos(time * 0.35)),
      h * (0.3 + 0.12 * Math.sin(time * 0.5)),
      w * 0.45,
      rgba(purpleDeep, 0.06),
    );
    blob(w * 0.5, h * (0.86 + 0.06 * Math.sin(time * 0.25)), w * 0.55, rgba(purpleLight, 0.05));

    // Double helical-ui — drawn horizontally in a rotated coordinate system so it
    // runs at an angle across the canvas while staying perfectly symmetric.
    const angle = -0.28;
    const midY = h * 0.52;
    const amp = h * 0.16;
    const freq = (Math.PI * 2) / Math.max(1, w * 0.55);
    const phase = time * 0.6;
    const extent = Math.ceil((h / 2) * Math.abs(Math.tan(angle)) + amp) + 120;

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(angle);
    ctx.translate(-w / 2, -h / 2);

    // Base-pair rungs — each rung interpolates between deep and light purple,
    // with brightness varying with the rotation so the strand reads as turning
    // around its axis.
    ctx.lineWidth = 1;
    for (let x = -extent; x <= w + extent; x += 16) {
      const y1 = midY + amp * Math.sin(x * freq + phase);
      const y2 = midY + amp * Math.sin(x * freq + phase + Math.PI);
      const k = Math.abs(Math.sin(x * freq + phase));
      const hue = 0.5 + 0.5 * Math.sin(x * freq * 0.7 + phase * 1.2);
      ctx.strokeStyle = rgba(mix(purpleDeep, purpleLight, hue), 0.12 + 0.4 * k);
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.stroke();
    }

    // The two backbones — thicker, rounded strands in the theme primary color.
    ctx.lineCap = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = rgba(primary, 0.3);
    for (const offset of [0, Math.PI]) {
      ctx.beginPath();
      for (let x = -extent; x <= w + extent; x += 3) {
        const y = midY + amp * Math.sin(x * freq + phase + offset);
        if (x === -extent) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.restore();
  };

  const loop = (t: number) => {
    draw(t);
    if (!reduced) requestAnimationFrame(loop);
  };
  if (reduced) draw(0);
  else requestAnimationFrame(loop);
}
