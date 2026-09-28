"use client";

/**
 * Adapted from Sotnichenko's Infinite Canvas 3D, supplied for this project:
 * https://framer.com/m/Sotnichenko-InfiniteCanvas3D-06fB3Q.js@rg6UcAMMltj7dfL4TFh9
 * Preserves seeded placement, wrapped projection, depth fades and inertia.
 * Replaces Framer controls with typed props and the shared image viewer.
 */
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";
import { useImageLightbox } from "@/components/shared/ImageLightbox";
import styles from "./InfiniteCanvas3D.module.css";

type CanvasImage = { src: string; alt: string; position?: string };
type InfiniteCanvas3DProps = { images: readonly CanvasImage[]; label: string };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const mod = (value: number, span: number) => ((value % span) + span) % span;
const wrap = (value: number, span: number) => mod(value + span / 2, span) - span / 2;
const random = (seed: number) => { const n = Math.sin(seed * 12.9898 + 78.233) * 43758.5453; return n - Math.floor(n); };
const smoothstep = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start), 0, 1);
  return t * t * (3 - 2 * t);
};
const subscribeMotion = (callback: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function InfiniteCanvas3D({ images, label }: InfiniteCanvas3DProps) {
  const lightbox = useImageLightbox();
  const id = useId();
  const reducedMotion = useSyncExternalStore(subscribeMotion, getReducedMotion, () => true);
  const [paused, setPaused] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const grid = showGrid || reducedMotion;
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const runtime = useRef({
    x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, px: 0, py: 0, targetX: 0, targetY: 0,
    pointerId: -1, lastX: 0, lastY: 0, lastTime: 0, travel: 0,
  });
  const slots = useMemo(() => images.map((_, index) => {
    const seed = 14 * 1009 + index * 97;
    return { x: random(seed + 1) - 0.5, y: random(seed + 2) - 0.5,
      z: (index + random(seed + 3) * 0.72) / images.length, tilt: (random(seed + 4) - 0.5) * 5 };
  }), [images]);

  useEffect(() => {
    // Switching from the 3D scene to the full grid changes downstream chapter positions.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [grid]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || grid) return;
    let width = root.clientWidth;
    let height = root.clientHeight;
    let frame = 0;
    let lastTime = 0;
    let visible = false;
    const state = runtime.current;
    const render = () => {
      const cardWidth = Math.min(width < 600 ? 260 : 340, width * 0.68);
      const fieldWidth = Math.max(width * 2.5, width + cardWidth);
      const fieldHeight = height * 2.2;
      slots.forEach((slot, index) => {
        const node = cardRefs.current[index];
        if (!node) return;
        const depth = 12 + mod(slot.z * 1800 - state.z, 1800);
        const projection = 720 / (720 + depth);
        const ratio = depth / 1800;
        const x = (wrap(slot.x * fieldWidth + state.x, fieldWidth) - state.px * 34 * (0.25 + ratio * 0.75)) * projection;
        const y = (wrap(slot.y * fieldHeight + state.y, fieldHeight) - state.py * 34 * (0.25 + ratio * 0.75)) * projection;
        const opacity = smoothstep(12, 122, depth) * (1 - smoothstep(1224, 1812, depth));
        node.style.width = `${cardWidth}px`;
        node.style.opacity = `${opacity}`;
        node.style.zIndex = `${Math.round((1 - ratio) * 1000)}`;
        node.style.pointerEvents = opacity > 0.35 ? "auto" : "none";
        node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${projection}) rotate(${slot.tilt * (0.3 + projection * 0.7)}deg)`;
      });
    };
    const tick = (now: number) => {
      const dt = Math.min(0.04, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      const decay = Math.pow(0.92, dt * 60);
      // Do not apply inertia a second time while a pointer is dragging.
      if (state.pointerId === -1) {
        state.x += state.vx * dt;
        state.y += state.vy * dt;
        state.z += (state.vz + (paused ? 0 : 18)) * dt;
        state.vx *= decay; state.vy *= decay; state.vz *= decay;
      }
      state.px += (state.targetX - state.px) * Math.min(1, dt * 7);
      state.py += (state.targetY - state.py) * Math.min(1, dt * 7);
      state.x = wrap(state.x, Math.max(width * 2.5, width + 340));
      state.y = wrap(state.y, height * 2.2);
      state.z = mod(state.z, 1800);
      render();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const sync = () => {
      stop();
      if (visible && document.visibilityState !== "hidden") {
        lastTime = performance.now(); frame = requestAnimationFrame(tick);
      }
    };
    const resize = new ResizeObserver(() => { width = root.clientWidth; height = root.clientHeight; render(); });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.01 });
    resize.observe(root); observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    render();
    return () => { stop(); resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [grid, paused, slots]);

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    const state = runtime.current;
    state.pointerId = event.pointerId;
    state.lastX = event.clientX; state.lastY = event.clientY;
    state.lastTime = performance.now(); state.travel = 0;
    state.vx = 0; state.vy = 0; state.vz = 0;
    // Capture on the photo button to preserve click-to-enlarge after a tap.
    const target = (event.target as Element).closest("button") ?? event.currentTarget;
    target.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  };
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = runtime.current;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.pointerType === "mouse" && !paused) {
      state.targetX = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
      state.targetY = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
    }
    if (state.pointerId !== event.pointerId) return;
    const dx = event.clientX - state.lastX;
    // Vertical touch gestures remain native page scrolling.
    const dy = event.pointerType === "touch" ? 0 : event.clientY - state.lastY;
    const elapsed = Math.max(8, performance.now() - state.lastTime);
    state.x += dx; state.y += dy;
    state.vx = clamp(dx * 1000 / elapsed, -2400, 2400);
    state.vy = clamp(dy * 1000 / elapsed, -2400, 2400);
    state.travel += Math.hypot(dx, event.clientY - state.lastY);
    state.lastX = event.clientX; state.lastY = event.clientY; state.lastTime = performance.now();
  };
  const release = (event: PointerEvent<HTMLDivElement>) => {
    if (runtime.current.pointerId !== event.pointerId) return;
    runtime.current.pointerId = -1;
    event.currentTarget.dataset.dragging = "false";
    if (event.type === "pointercancel") { runtime.current.vx = 0; runtime.current.vy = 0; runtime.current.travel = 10; }
  };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const state = runtime.current;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => { state.x -= 100; }, ArrowRight: () => { state.x += 100; },
      ArrowUp: () => { state.y -= 100; }, ArrowDown: () => { state.y += 100; },
      "+": () => { state.z += 140; }, "=": () => { state.z += 140; }, "-": () => { state.z -= 140; },
    };
    if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
  };

  if (!images.length) return null;
  return (
    <div className={styles.gallery}>
      <div className={styles.toolbar}>
        <p id={`${id}-hint`} className={styles.hint}>{grid ? "Cada presença, uma lembrança. Toque para ampliar." : "Arraste para explorar · Toque para ampliar"}</p>
        <div className={styles.controls}>
          {!grid && <>
            <button type="button" aria-label="Recuar no espaço de fotos" onClick={() => { runtime.current.vz -= 520; }}>−</button>
            <button type="button" aria-label="Avançar no espaço de fotos" onClick={() => { runtime.current.vz += 520; }}>+</button>
            <button type="button" aria-pressed={paused} onClick={() => {
              runtime.current.vx = 0; runtime.current.vy = 0; runtime.current.vz = 0;
              setPaused(!paused);
            }}>{paused ? "Retomar" : "Pausar"}</button>
          </>}
          {!reducedMotion && <button type="button" aria-pressed={showGrid} onClick={() => setShowGrid(!showGrid)}>{showGrid ? "Explorar em 3D" : "Ver todas"}</button>}
        </div>
      </div>
      {grid ? (
        <div className={styles.grid} role="group" aria-label={label}>
          {images.map((image) => <button className={styles.gridCard} key={image.src} type="button" aria-label={`Ampliar: ${image.alt}`} onClick={() => lightbox?.open(image)}>
            <Image src={image.src} alt={image.alt} width={720} height={480} unoptimized loading="lazy" />
          </button>)}
        </div>
      ) : (
        <div className={styles.canvas} ref={rootRef} role="group" aria-label={`${label}. Use as setas para explorar e mais ou menos para percorrer a profundidade. Use Ver todas para acessar cada foto pelo teclado.`}
          aria-describedby={`${id}-hint`} tabIndex={0} onKeyDown={keyDown}
          onWheel={(event) => { if (!paused) runtime.current.vz += clamp(event.deltaY, -160, 160) * 1.6; }}
          onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={release} onPointerCancel={release}
          onPointerLeave={() => { runtime.current.targetX = 0; runtime.current.targetY = 0; }}>
          {images.map((image, index) => <button key={image.src} className={styles.card} ref={(node) => { cardRefs.current[index] = node; }} type="button" tabIndex={-1}
            aria-label={`Ampliar: ${image.alt}`} onClick={() => { if (runtime.current.travel <= 6) { setPaused(true); lightbox?.open(image); } }}>
            <Image src={image.src} alt={image.alt} width={720} height={480} unoptimized draggable={false} loading="lazy" />
          </button>)}
        </div>
      )}
    </div>
  );
}
