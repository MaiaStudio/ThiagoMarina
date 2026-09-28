"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrototypeImage } from "../PrototypeImage";
import type { PrototypeImage as PrototypeImageData } from "../prototype-data";
import styles from "../editorial-cinematic.module.css";

gsap.registerPlugin(ScrollTrigger);

type DetailsCompositionProps = {
  images: readonly PrototypeImageData[];
};

export function DetailsComposition({ images }: DetailsCompositionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const photos = gsap.utils.toArray<HTMLElement>("[data-detail-photo]", section);
        const canvas = section.querySelector<HTMLElement>("[data-details-canvas]");
        if (!canvas) return;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            end: "bottom 18%",
            scrub: 0.75,
            invalidateOnRefresh: true,
          },
        });
        timeline.fromTo(
          photos,
          { autoAlpha: 0, scale: 0.92, y: (index) => 70 + index * 14 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.34,
            stagger: 0.035,
            ease: "power3.out",
          },
        ).fromTo(
          "[data-detail-dominant]",
          { clipPath: "inset(20% 12% 24% 18%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.3,
            ease: "power2.inOut",
          },
          0.05,
        ).to(
          photos,
          {
            x: (index: number, target: HTMLElement) =>
              (index + 0.5) * (canvas.offsetWidth / photos.length) -
              (target.offsetLeft + target.offsetWidth / 2),
            y: (_index: number, target: HTMLElement) =>
              canvas.offsetHeight - 62 - (target.offsetTop + target.offsetHeight / 2),
            scale: 0.2,
            rotate: 0,
            duration: 0.44,
            stagger: 0.012,
            ease: "power2.inOut",
          },
          0.56,
        ).fromTo(
          "[data-details-axis]",
          { scaleX: 0, autoAlpha: 0 },
          { scaleX: 1, autoAlpha: 1, duration: 0.3, ease: "power2.out" },
          0.68,
        );
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section aria-labelledby="details-title" className={styles.details} ref={sectionRef}>
      <div className={styles.detailsHeading}>
        <h2 id="details-title">Os detalhes guardam memórias.</h2>
      </div>
      <div className={styles.detailsCanvas} data-details-canvas>
        {images.slice(0, 4).map((item, index) => (
          <figure
            className={`${styles.detailPhoto} ${styles[`detailPhoto${index + 1}`]}`}
            data-detail-dominant={index === 0 ? "" : undefined}
            data-detail-photo
            key={`${item.alt}-${index}`}
          >
            <PrototypeImage image={item} sizes="(max-width: 767px) 72vw, 36vw" />
            {index === 0 ? <figcaption>Pequenas lembranças · Nº 01</figcaption> : null}
          </figure>
        ))}
      </div>
      <p className={styles.detailsAside}>Uma coleção de gestos, texturas e afetos que ficam.</p>
      <div aria-hidden="true" className={styles.detailsAxis} data-details-axis />
      <p className={styles.ceremonyCue}>A cerimônia · O nosso sim</p>
    </section>
  );
}
