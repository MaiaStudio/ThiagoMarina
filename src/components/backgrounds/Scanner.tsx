"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import styles from "./Scanner.module.css";

type ScanDirection = "vertical" | "horizontal" | "diagonal";

type ScannerProps = {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  sweepSpeed?: number;
  sweepWidth?: number;
  sweepFalloff?: number;
  scale?: number;
  frequency?: number;
  ripple?: number;
  bandDensity?: number;
  lineSharpness?: number;
  glow?: number;
  scanDirection?: ScanDirection;
  colorSpread?: number;
  brightness?: number;
  contrast?: number;
  softness?: number;
  vignette?: number;
  scanline?: boolean;
  grain?: boolean;
  grainIntensity?: number;
  opacity?: number;
  className?: string;
};

type ScannerSettings = Required<Omit<ScannerProps, "className">>;

const defaults: ScannerSettings = {
  color1: "#5227FF",
  color2: "#FF9FFC",
  color3: "#FFFFFF",
  speed: 0.5,
  sweepSpeed: 0.25,
  sweepWidth: 1.6,
  sweepFalloff: 6,
  scale: 1.5,
  frequency: 2,
  ripple: 0.22,
  bandDensity: 11,
  lineSharpness: 5.5,
  glow: 0.22,
  scanDirection: "vertical",
  colorSpread: 0.7,
  brightness: 1,
  contrast: 1.15,
  softness: 1.4,
  vignette: 0.45,
  scanline: true,
  grain: true,
  grainIntensity: 0.05,
  opacity: 1,
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    Number.parseInt(result[1], 16) / 255,
    Number.parseInt(result[2], 16) / 255,
    Number.parseInt(result[3], 16) / 255,
  ];
};

const directionToFloat = (direction: ScanDirection) =>
  direction === "horizontal" ? 1 : direction === "diagonal" ? 2 : 0;

const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed, uSweepSpeed, uSweepWidth, uSweepFalloff, uScale, uFrequency, uRipple;
uniform float uBandDensity, uLineSharpness, uGlow, uColorSpread, uBrightness, uContrast, uSoftness, uVignette, uOpacity;
uniform float uScanline, uGrain, uGrainIntensity, uDirection;
uniform vec3 uColor1, uColor2, uColor3;
out vec4 fragColor;
const float TAU = 6.2831853;

float signalField(vec2 p, float t) {
  float w = sin(p.x * 1.3 + t * 0.7);
  w += sin(p.y * 1.7 - t * 0.52) * 0.8;
  w += sin((p.x + p.y) * 0.9 + t * 0.91) * 0.6;
  w += sin((p.x - p.y) * 1.53 - t * 0.63) * 0.42;
  return w * 0.35;
}

vec3 palette(float f) {
  f = pow(clamp(f, 0.0, 1.0), uContrast);
  vec3 color = mix(uColor1, uColor2, smoothstep(0.08, 0.6, f));
  return mix(color, uColor3, smoothstep(0.68, 1.0, f));
}

float scanBand(float x, float aa, float sharp) {
  return pow(mix(0.5, 0.5 + 0.5 * cos(x * TAU), aa), sharp);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
  vec2 p = uv / max(uScale, 0.001);
  float time = iTime * uSpeed;
  float axis = uDirection < 0.5 ? p.y : uDirection < 1.5 ? p.x : (p.x + p.y) * 0.70710678;
  float signal = signalField(p * uFrequency, time);
  float coordinate = axis + signal * uRipple;
  float phase = coordinate / max(uSweepWidth, 0.05) - time * uSweepSpeed;
  float sweep = pow(0.5 + 0.5 * cos(phase * TAU), max(uSweepFalloff, 0.1));
  float lineCoordinate = coordinate * uBandDensity;
  float aa = clamp(1.0 / (1.0 + uSoftness * fwidth(lineCoordinate) * 3.0), 0.0, 1.0);
  float body = pow(clamp(0.5 + 0.5 * signal, 0.0, 1.0), 2.0) * uGlow * sweep;
  float split = uColorSpread * 0.16;
  float red = clamp(scanBand(lineCoordinate + split, aa, uLineSharpness) * sweep + body, 0.0, 1.0);
  float green = clamp(scanBand(lineCoordinate, aa, uLineSharpness) * sweep + body, 0.0, 1.0);
  float blue = clamp(scanBand(lineCoordinate - split, aa, uLineSharpness) * sweep + body, 0.0, 1.0);
  vec3 color = vec3(palette(red).r, palette(green).g, palette(blue).b);
  float intensity = (red + green + blue) * 0.3333333 * uBrightness;
  if (uScanline > 0.5) intensity *= 1.0 - 0.18 * (0.5 + 0.5 * cos(gl_FragCoord.y * 1.7));
  if (uGrain > 0.5) intensity += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
  intensity *= clamp(1.0 - uVignette * smoothstep(0.55, 1.65, length(uv)), 0.0, 1.0);
  float alpha = clamp(intensity * uOpacity, 0.0, 1.0);
  fragColor = vec4(clamp(color, 0.0, 1.0) * alpha, alpha);
}
`;

export function Scanner(props: ScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const settings = { ...defaults, ...props };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: settings.speed },
        uSweepSpeed: { value: settings.sweepSpeed },
        uSweepWidth: { value: settings.sweepWidth },
        uSweepFalloff: { value: settings.sweepFalloff },
        uScale: { value: settings.scale },
        uFrequency: { value: settings.frequency },
        uRipple: { value: settings.ripple },
        uBandDensity: { value: settings.bandDensity },
        uLineSharpness: { value: settings.lineSharpness },
        uGlow: { value: settings.glow },
        uColorSpread: { value: settings.colorSpread },
        uBrightness: { value: settings.brightness },
        uContrast: { value: settings.contrast },
        uSoftness: { value: settings.softness },
        uVignette: { value: settings.vignette },
        uOpacity: { value: settings.opacity },
        uScanline: { value: settings.scanline ? 1 : 0 },
        uGrain: { value: settings.grain ? 1 : 0 },
        uGrainIntensity: { value: settings.grainIntensity },
        uDirection: { value: directionToFloat(settings.scanDirection) },
        uColor1: { value: new Float32Array(hexToRgb(settings.color1)) },
        uColor2: { value: new Float32Array(hexToRgb(settings.color2)) },
        uColor3: { value: new Float32Array(hexToRgb(settings.color3)) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const canvas = gl.canvas;
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    const render = (time = 0) => {
      program.uniforms.iTime.value = time * 0.001;
      renderer.render({ scene: mesh });
    };
    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
      program.uniforms.iResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.iResolution.value[1] = gl.drawingBufferHeight;
      render();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        resizeObserver.disconnect();
        canvas.remove();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    let animationFrame = 0;
    let visible = true;
    let pageVisible = !document.hidden;
    const stop = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };
    const loop = (time: number) => {
      render(time);
      animationFrame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (visible && pageVisible && !animationFrame) animationFrame = requestAnimationFrame(loop);
    };
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        start();
      } else {
        stop();
      }
    });
    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (pageVisible) {
        start();
      } else {
        stop();
      }
    };
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    settings.bandDensity, settings.brightness, settings.color1, settings.color2, settings.color3,
    settings.colorSpread, settings.contrast, settings.frequency, settings.glow, settings.grain,
    settings.grainIntensity, settings.lineSharpness, settings.opacity, settings.ripple,
    settings.scale, settings.scanDirection, settings.scanline, settings.softness, settings.speed,
    settings.sweepFalloff, settings.sweepSpeed, settings.sweepWidth, settings.vignette,
  ]);

  return <div className={[styles.scanner, props.className].filter(Boolean).join(" ")} ref={containerRef} />;
}
