"use client";

import { useEffect, useRef } from "react";

const TOKENS = ["--color-lime", "--color-sand", "--color-coral", "--color-ocean", "--color-grape", "--color-foam"];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
};

/**
 * Lightweight canvas confetti: two side cannons and a top burst, ~2.5 s.
 * Renders nothing for prefers-reduced-motion.
 */
export function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = (canvas.width = canvas.clientWidth * dpr);
    const H = (canvas.height = canvas.clientHeight * dpr);
    const root = getComputedStyle(document.documentElement);
    const colors = TOKENS.map((t) => root.getPropertyValue(t).trim()).filter(Boolean);
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const parts: Particle[] = [];
    const burst = (x: number, y: number, angle: number, spread: number, n: number, speed: number) => {
      for (let i = 0; i < n; i++) {
        const a = angle + rand(-spread, spread);
        const s = rand(speed * 0.5, speed) * dpr;
        parts.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          rot: rand(0, Math.PI),
          vr: rand(-0.3, 0.3),
          w: rand(6, 12) * dpr,
          h: rand(10, 18) * dpr,
          color: colors[i % colors.length] ?? "white",
        });
      }
    };
    burst(0, H * 0.75, -Math.PI / 3, 0.45, 60, 22);
    burst(W, H * 0.75, (-2 * Math.PI) / 3, 0.45, 60, 22);
    burst(W / 2, H * 0.3, -Math.PI / 2, Math.PI, 50, 14);

    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const age = t - start;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = Math.max(0, Math.min(1, (3000 - age) / 600));
      for (const p of parts) {
        p.vy += 0.45 * dpr;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.rot * 2));
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (age < 3000) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 h-dvh w-screen" />;
}
