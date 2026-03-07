"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import styles from "./emoji-particles.module.css";

export type EmojiList = string[];

type EmojiParticlesContextValue = {
  confetti: (emojis?: EmojiList) => void;
};

type Particle = {
  x: number;
  y: number;
  xv: number;
  yv: number;
  a: number;
  s: number;
  opacity: number;
  life: number;
  maxLife: number;
  emoji: string;
  flipH: boolean;
  fontSize: number;
  radius: number;
  gx: number;
  gy: number;
};

const EmojiParticlesContext = createContext<EmojiParticlesContextValue | null>(
  null,
);

const MAX_ACTIVE = 500;
const ANIM_FRAMES = 120;
const MAX_DPR = 2;
const DEFAULT_EMOJIS: EmojiList = ["✨", "🔥"];
const FLIPPABLE_EMOJIS = new Set(["🎉", "👍", "👎", "👈", "👉", "👋", "🤌"]);

const emojiCache = new Map<string, HTMLCanvasElement>();

export function useEmojiParticles() {
  const context = useContext(EmojiParticlesContext);
  if (!context) {
    throw new Error(
      "useEmojiParticles must be used within an EmojiParticlesProvider",
    );
  }

  return context;
}

function getEmojiCanvas(emoji: string): HTMLCanvasElement {
  const existing = emojiCache.get(emoji);
  if (existing) return existing;

  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const canonicalPx = 64;
  const fontSize = Math.ceil(canonicalPx * dpr);
  const size = Math.ceil(fontSize * 1.5);

  const offscreen = document.createElement("canvas");
  offscreen.width = size;
  offscreen.height = size;

  const ctx = offscreen.getContext("2d");
  if (!ctx) return offscreen;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${fontSize}px serif`;
  ctx.fillText(emoji, size / 2, size / 2);

  emojiCache.set(emoji, offscreen);
  return offscreen;
}

function updateParticle(particle: Particle): boolean {
  particle.a += particle.xv * 0.5;
  particle.yv *= 0.9;
  particle.y += particle.yv;
  particle.xv *= 0.98;
  particle.x += particle.xv;
  particle.s += (1 - particle.s) * 0.3;
  particle.xv += particle.gx * 0.1;
  particle.yv += (particle.gy + particle.yv) * 0.1;

  particle.radius = (particle.fontSize * particle.s) / 2;

  particle.life--;
  const lifeRatio = particle.life / particle.maxLife;
  if (lifeRatio < 0.25) {
    particle.opacity = lifeRatio / 0.25;
  }

  return particle.life > 0 && particle.opacity > 0.01;
}

function resolveCollisions(particles: Particle[]) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distSq = dx * dx + dy * dy;
      const minDist = a.radius + b.radius;

      if (distSq >= minDist * minDist || distSq <= 0.0001) continue;

      const dist = Math.sqrt(distSq);
      const nx = dx / dist;
      const ny = dy / dist;
      const overlap = minDist - dist;
      const separation = overlap * 0.5;

      a.x -= nx * separation;
      a.y -= ny * separation;
      b.x += nx * separation;
      b.y += ny * separation;

      const dvx = a.xv - b.xv;
      const dvy = a.yv - b.yv;
      const dvDotN = dvx * nx + dvy * ny;

      if (dvDotN > 0) {
        const restitution = 0.5;
        const impulse = dvDotN * restitution;
        a.xv -= impulse * nx;
        a.yv -= impulse * ny;
        b.xv += impulse * nx;
        b.yv += impulse * ny;
      }
    }
  }
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const targetWidth = Math.round(width * dpr);
  const targetHeight = Math.round(height * dpr);

  if (canvas.width === targetWidth && canvas.height === targetHeight) return;

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

function spawnBurst(
  particles: Particle[],
  x: number,
  y: number,
  emojis: EmojiList,
  gx: number,
  gy: number,
) {
  const amount = 4;
  if (particles.length + amount > MAX_ACTIVE) return;

  for (let i = 0; i < amount; i++) {
    const pick = emojis[Math.floor(Math.random() * emojis.length)];

    particles.push({
      x,
      y,
      xv: Math.random() * 16 - 8,
      yv:
        (i === 0 ? 4 : i === 1 ? 8 : i === 2 ? 8 : 0) *
        (0.25 + Math.random() * 0.25),
      a: 0,
      s: 0.2,
      opacity: 1,
      life: ANIM_FRAMES,
      maxLife: ANIM_FRAMES,
      emoji: pick || "✨",
      flipH: pick ? FLIPPABLE_EMOJIS.has(pick) && Math.random() < 0.5 : false,
      fontSize: 20 + Math.ceil(Math.random() * 40),
      radius: 0,
      gx,
      gy,
    });
  }
}

export function EmojiParticlesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafIdRef = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const lastTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d");
    resizeCanvas(canvas);

    const onResize = () => resizeCanvas(canvas);
    const updateOrigin = (event: PointerEvent) => {
      lastPointerRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      lastTargetRef.current =
        event.target instanceof HTMLElement ? event.target : null;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointerdown", updateOrigin, true);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerdown", updateOrigin, true);
    };
  }, []);

  function getOrigin() {
    const target = lastTargetRef.current;
    if (target) {
      const rect = target.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }

    return lastPointerRef.current;
  }

  function startLoop() {
    if (rafIdRef.current !== null) return;

    const canvas = canvasRef.current;
    if (!canvas || !ctxRef.current) return;
    const loopCanvas = canvas;

    function frame() {
      const ctx = ctxRef.current;
      if (!ctx) {
        rafIdRef.current = null;
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        if (!updateParticle(particles[i])) {
          particles[i] = particles[particles.length - 1];
          particles.pop();
        }
      }

      if (particles.length === 0) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, loopCanvas.width, loopCanvas.height);
        rafIdRef.current = null;
        return;
      }

      resolveCollisions(particles);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, loopCanvas.width, loopCanvas.height);

      ctx.globalAlpha = 1;
      for (let pass = 0; pass < 2; pass++) {
        for (const particle of particles) {
          const isFading = particle.opacity < 1;

          if ((pass === 0 && isFading) || (pass === 1 && !isFading)) continue;

          if (pass === 1) {
            ctx.globalAlpha = particle.opacity;
          }

          const emojiImage = getEmojiCanvas(particle.emoji);
          const drawSize = particle.fontSize * particle.s * 1.5;
          const halfSize = drawSize / 2;
          const radians = (particle.a * Math.PI) / 180;
          const cos = Math.cos(radians) * dpr;
          const sin = Math.sin(radians) * dpr;
          const flipX = particle.flipH ? -1 : 1;

          ctx.setTransform(
            cos * flipX,
            sin * flipX,
            -sin,
            cos,
            particle.x * dpr,
            particle.y * dpr,
          );
          ctx.drawImage(emojiImage, -halfSize, -halfSize, drawSize, drawSize);
        }
      }

      rafIdRef.current = requestAnimationFrame(frame);
    }

    rafIdRef.current = requestAnimationFrame(frame);
  }

  function confetti(emojis: EmojiList = DEFAULT_EMOJIS) {
    const origin = getOrigin();
    if (!origin) return;

    const particles = particlesRef.current;
    spawnBurst(particles, origin.x, origin.y, emojis, 0, -1.5);
    startLoop();
  }

  return (
    <EmojiParticlesContext.Provider value={{ confetti }}>
      {children}
      <canvas ref={canvasRef} className={styles.particles} />
    </EmojiParticlesContext.Provider>
  );
}
