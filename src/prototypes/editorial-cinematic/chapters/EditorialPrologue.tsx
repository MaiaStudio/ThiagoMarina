"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrototypeImage } from "../PrototypeImage";
import type { EditorialCinematicData } from "../prototype-data";
import styles from "../editorial-cinematic.module.css";

gsap.registerPlugin(ScrollTrigger);

type EditorialPrologueProps = {
  content: EditorialCinematicData["editorialIntro"];
};

export function EditorialPrologue({ content }: EditorialPrologueProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = gsap.matchMedia();
    media.add({
      animate: "(prefers-reduced-motion: no-preference)",
      compact: "(max-width: 899px)",
    }, (mediaContext) => {
      if (!mediaContext.conditions?.animate) return;
      const compact = mediaContext.conditions.compact;
      const context = gsap.context(() => {
        gsap.fromTo(
          "[data-prologue-copy]",
          { autoAlpha: 0, y: compact ? 14 : 22 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "[data-prologue-copy]",
              start: "top 94%",
              end: "top 62%",
              scrub: 0.6,
            },
          },
        );

        // Keep touch scrolling natural; desktop photographs drift only slightly.
        if (!compact) {
          gsap.timeline({
            defaults: { ease: "sine.inOut" },
            scrollTrigger: {
              trigger: "[data-prologue-primary]",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          })
            .fromTo("[data-prologue-primary]", { y: 18 }, { y: -18 }, 0)
            .fromTo("[data-prologue-secondary]", { y: -10 }, { y: 10 }, 0);
        }
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section aria-labelledby="editorial-prologue-title" className={styles.prologue} ref={sectionRef}>
      <div className={styles.prologueRule} aria-hidden="true" />
      <div className={styles.prologueGrid}>
        <div className={styles.prologueCopy} data-prologue-copy>
          <h2 id="editorial-prologue-title">
            {content.titleLines.map((line) => <span key={line}>{line}</span>)}
          </h2>
          <p className={styles.prologueBody}>{content.body}</p>
        </div>
        <figure className={styles.prologuePrimary} data-prologue-primary>
          <PrototypeImage image={content.primary} sizes="(max-width: 767px) 86vw, 52vw" />
          <figcaption>{content.caption}</figcaption>
        </figure>
        <figure className={styles.prologueSecondary} data-prologue-secondary>
          <PrototypeImage image={content.secondary} sizes="(max-width: 767px) 42vw, 20vw" />
        </figure>
      </div>
    </section>
  );
}
