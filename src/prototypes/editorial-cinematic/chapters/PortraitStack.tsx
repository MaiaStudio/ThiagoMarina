"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrototypeImage } from "../PrototypeImage";
import type { PrototypeImage as PrototypeImageData } from "../prototype-data";
import styles from "../editorial-cinematic.module.css";

gsap.registerPlugin(ScrollTrigger);

type PortraitStackProps = {
  images: readonly PrototypeImageData[];
};

export function PortraitStack({ images }: PortraitStackProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const media = gsap.matchMedia();
    media.add(
      {
        animate: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (!context.conditions?.animate) return;
        const scope = gsap.context(() => {
          const cards = gsap.utils.toArray<HTMLElement>("[data-portrait-card]", stage);
          const offsets = [-6, 8, 0, -5, 4];
          const rotations = [-0.35, 0.45, 0, -0.3, 0.18];
          const timeline = gsap.timeline({ defaults: { ease: "none" } });
          cards.forEach((card, index) => {
            if (index === 0) return;
            timeline.fromTo(
              card,
              {
                yPercent: 112,
                xPercent: offsets[index] * 1.5,
                rotate: index % 2 ? 0.9 : -0.7,
                scale: 1.025,
              },
              {
                yPercent: index * 1.1,
                xPercent: offsets[index],
                rotate: rotations[index],
                scale: 1,
                duration: 0.82,
                ease: "power2.out",
              },
              index - 0.8,
            );
            timeline.to(
              cards[index - 1],
              {
                scale: 0.94 - index * 0.006,
                xPercent: offsets[index - 1] * 0.72,
                yPercent: -index * 1.1,
                duration: 0.82,
              },
              index - 0.8,
            );
          });
          timeline
            .to(cards.at(-1) ?? null, { scale: 1.1, duration: 0.7, ease: "power2.inOut" }, "-=0.35")
            .to("[data-portrait-heading]", { autoAlpha: 0, y: -24, duration: 0.48 }, "<0.12")
            .to("[data-portrait-tone]", { opacity: 1, duration: 0.7 }, "<");
          ScrollTrigger.create({
            animation: timeline,
            trigger: section,
            start: "top top",
            end: `+=${window.innerHeight * 2.65}`,
            pin: stage,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });
        }, section);
        return () => scope.revert();
      },
    );
    return () => media.revert();
  }, []);

  return (
    <section aria-labelledby="portraits-title" className={styles.portraits} ref={sectionRef}>
      <div className={styles.portraitStage} ref={stageRef}>
        <div className={styles.portraitHeader} data-portrait-heading>
          <h2 id="portraits-title"><span>Além</span><span>do tempo</span></h2>
        </div>
        <div className={styles.portraitStack}>
          {images.map((item, index) => (
            <figure
              className={`${styles.portraitCard} ${styles[`portraitCard${index + 1}`]}`}
              data-portrait-card
              key={`${item.alt}-${index}`}
            >
              <PrototypeImage image={item} sizes="(max-width: 899px) 86vw, 44vw" />
              <figcaption>{String(index + 1).padStart(2, "0")}</figcaption>
            </figure>
          ))}
        </div>
        <div aria-hidden="true" className={styles.portraitTone} data-portrait-tone />
        <p className={styles.portraitNote}>Cinco retratos · Uma história</p>
      </div>
    </section>
  );
}
