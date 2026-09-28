"use client";

/*
 * Adapted from the free React Bits Circular Gallery component.
 * Upstream: https://www.reactbits.dev/components/circular-gallery
 * License: MIT + Commons Clause License Condition v1.0, Copyright David Haz.
 */

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";
import { useImageLightbox } from "@/components/shared/ImageLightbox";
import type { PrototypeImage } from "../prototype-data";
import styles from "./CircularGallery.module.css";

type CircularGalleryProps = {
  images: readonly PrototypeImage[];
  ariaLabel: string;
};

type GalleryPlane = {
  mesh: Mesh;
  texture: Texture;
  index: number;
};

const vertex = `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uLoaded;
  varying vec2 vUv;
  void main() {
    vec2 uv = vec2(vUv.x, mix(0.08, 0.92, vUv.y));
    vec4 color = texture2D(tMap, uv);
    float vignette = smoothstep(0.92, 0.30, distance(vUv, vec2(0.5)));
    gl_FragColor = vec4(color.rgb * mix(0.94, 1.04, vignette), uLoaded);
  }
`;

const wrap = (value: number, length: number) =>
  ((value + length / 2) % length + length) % length - length / 2;

export function CircularGallery({ images, ariaLabel }: CircularGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lightbox = useImageLightbox();
  const openImage = lightbox?.open;

  useEffect(() => {
    const root = rootRef.current;

    if (
      !root ||
      root.clientWidth < 900 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let renderer: Renderer | undefined;
    let frame = 0;
    let destroyed = false;
    let pointerStart = 0;
    let scrollStart = 0;
    let dragging = false;
    let pointerMoved = false;
    let current = 0;
    let target = 0;

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });
    } catch {
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.className = styles.canvas;
    canvas.setAttribute("aria-hidden", "true");
    root.appendChild(canvas);
    root.dataset.enhanced = "true";

    const camera = new Camera(gl);
    camera.fov = 42;
    camera.position.z = 6;
    const scene = new Transform();
    const geometry = new Plane(gl, { widthSegments: 16, heightSegments: 12 });
    const planes: GalleryPlane[] = images.map((item, index) => {
      const texture = new Texture(gl, { generateMipmaps: false });
      const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        depthTest: false,
        uniforms: {
          tMap: { value: texture },
          uLoaded: { value: 0 },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);
      const source = new window.Image();
      source.decoding = "async";
      source.src = item.src;
      source.onload = () => {
        if (destroyed) return;
        texture.image = source;
        program.uniforms.uLoaded.value = 1;
      };
      return { mesh, texture, index };
    });

    let spacing = 3.05;
    let planeWidth = 2.7;
    let planeHeight = 3.5;

    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      renderer?.setSize(Math.max(1, width), Math.max(1, height));
      camera.perspective({ aspect: width / Math.max(1, height) });
      spacing = 3.05;
      planeWidth = 2.7;
      planeHeight = 3.5;
      planes.forEach(({ mesh }) => mesh.scale.set(planeWidth, planeHeight, 1));
    };

    const render = () => {
      current += (target - current) * 0.075;
      const total = Math.max(spacing, spacing * planes.length);
      planes.forEach(({ mesh, index }) => {
        const x = wrap(index * spacing - current, total);
        const distance = Math.abs(x);
        mesh.position.x = x;
        mesh.position.y = -0.045 * distance * distance;
        mesh.position.z = -0.12 * distance;
        mesh.rotation.y = -x * 0.055;
        mesh.rotation.z = -x * 0.006;
      });
      renderer?.render({ scene, camera });
      frame = window.requestAnimationFrame(render);
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      pointerMoved = false;
      pointerStart = event.clientX;
      scrollStart = target;
      root.setPointerCapture(event.pointerId);
      root.dataset.dragging = "true";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      if (Math.abs(pointerStart - event.clientX) > 8) pointerMoved = true;
      target = scrollStart + (pointerStart - event.clientX) * 0.008;
    };
    const onPointerUp = (event: PointerEvent) => {
      const shouldOpen = event.type === "pointerup" && !pointerMoved;
      dragging = false;
      root.dataset.dragging = "false";
      if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
      target = Math.round(target / spacing) * spacing;
      if (shouldOpen && planes.length) {
        const closest = planes.reduce((nearest, plane) =>
          Math.abs(plane.mesh.position.x) < Math.abs(nearest.mesh.position.x) ? plane : nearest,
        );
        const image = images[closest.index];
        if (image) openImage?.(image);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") target += spacing;
      if (event.key === "ArrowLeft") target -= spacing;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);
    root.addEventListener("keydown", onKeyDown);
    resize();
    render();

    return () => {
      destroyed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
      root.removeEventListener("keydown", onKeyDown);
      planes.forEach(({ mesh }) => mesh.setParent(null));
      canvas.remove();
      delete root.dataset.enhanced;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [images, openImage]);

  return (
    <div
      aria-label={ariaLabel}
      className={styles.gallery}
      ref={rootRef}
      role="region"
      tabIndex={0}
    >
      <div className={styles.fallback}>
        {images.slice(0, 4).map((item, index) => (
          <button
            aria-label={`Ampliar imagem: ${item.alt}`}
            className={styles.fallbackImage}
            key={`${item.alt}-${index}`}
            onClick={() => openImage?.(item)}
            type="button"
          >
            {/* A native image is intentional here: it is the no-motion/WebGL fallback. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={item.alt} src={item.src} style={{ objectPosition: item.position }} />
          </button>
        ))}
      </div>
      <p className={styles.srOnly}>Arraste ou use as teclas de seta para navegar pelas fotografias</p>
      <ul className={styles.srOnly}>
        {images.map((item, index) => (
          <li key={`${item.alt}-description-${index}`}>{item.alt}</li>
        ))}
      </ul>
    </div>
  );
}
