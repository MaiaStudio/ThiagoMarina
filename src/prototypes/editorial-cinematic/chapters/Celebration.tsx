"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PrototypeImage } from "../prototype-data";
import { PrototypeImage as WeddingImage } from "../PrototypeImage";
import { Scanner } from "@/components/backgrounds/Scanner";
import styles from "../editorial-cinematic.module.css";

gsap.registerPlugin(ScrollTrigger);

type CelebrationProps = {
  couple: string;
  date: string;
  location: string;
  images: readonly PrototypeImage[];
};

export function Celebration({ couple, date, location, images }: CelebrationProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const photos = gsap.utils.toArray<HTMLElement>("[data-celebration-photo]", section);
        const xPaths = [-9, 7, -5, 8, -7, 6, -4];
        const yPaths = [-12, 10, -7, 8, -11, 9, -6];
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 84%",
            end: "bottom 12%",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .fromTo(
            "[data-celebration-title]",
            { yPercent: 45, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.22, ease: "power3.out" },
          )
          .fromTo(
            photos,
            {
              autoAlpha: 0,
              xPercent: (index) => xPaths[index] * 2,
              yPercent: (index) => 16 + Math.abs(yPaths[index]),
              scale: 0.94,
            },
            {
              autoAlpha: 1,
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              duration: 0.38,
              stagger: 0.018,
              ease: "power3.out",
            },
            0.12,
          )
          .to(
            "[data-celebration-title]",
            { autoAlpha: 0, yPercent: -50, duration: 0.18, ease: "power2.in" },
            0.43,
          )
          .to(
            photos,
            {
              xPercent: (index) => xPaths[index],
              yPercent: (index) => yPaths[index],
              scale: (index) => (index === 2 ? 1.055 : 1.015),
              duration: 0.46,
              stagger: 0.012,
              ease: "power1.inOut",
            },
            0.45,
          );
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section aria-labelledby="celebration-title" className={styles.celebration} ref={sectionRef}>
      <div aria-hidden="true" className={styles.celebrationScanner}>
        <Scanner
          bandDensity={7}
          brightness={0.74}
          color1="#080a08"
          color2="#574d34"
          color3="#c2a66d"
          colorSpread={0.12}
          contrast={1.05}
          frequency={1.25}
          glow={0.13}
          grain={false}
          opacity={0.42}
          ripple={0.12}
          scale={1.8}
          scanDirection="diagonal"
          scanline={false}
          softness={2.1}
          speed={0.14}
          sweepFalloff={3.6}
          sweepSpeed={0.08}
          sweepWidth={2.7}
          vignette={0.75}
        />
      </div>
      <header className={styles.celebrationHeader}>
        <h2 data-celebration-title id="celebration-title"><span>A</span><span>Festa</span></h2>
        <p className={styles.celebrationIntro}>Música alta. Luz suave. Alegria sem hora para acabar.</p>
      </header>
      <div className={styles.celebrationField}>
        <p className={styles.celebrationPulse}>{date}</p>
        {images.map((image, index) => (
          <figure
            className={`${styles.celebrationPhoto} ${styles[`celebrationPhoto${index + 1}`]}`}
            data-celebration-photo
            key={`${image.alt}-${index}`}
          >
            <WeddingImage image={image} sizes="(max-width: 899px) 78vw, 48vw" />
            {index === 2 ? <figcaption>A alegria tomou conta de tudo.</figcaption> : null}
          </figure>
        ))}
      </div>
      <div className={styles.decompression} aria-label={`${couple}, ${date}, ${location}`}>
        <p>{couple} <span aria-hidden="true">·</span> {date} <span aria-hidden="true">·</span> {location}</p>
      </div>
    </section>
  );
}
