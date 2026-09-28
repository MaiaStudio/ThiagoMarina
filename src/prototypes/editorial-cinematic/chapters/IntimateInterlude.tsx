"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrototypeImage } from "../PrototypeImage";
import type { PrototypeImage as PrototypeImageData } from "../prototype-data";
import styles from "../editorial-cinematic.module.css";

gsap.registerPlugin(ScrollTrigger);

type IntimateInterludeProps = {
  image: PrototypeImageData;
};

export function IntimateInterlude({ image }: IntimateInterludeProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(
          "[data-interlude-image]",
          { scale: 0.86, clipPath: "inset(8% 8% 8% 8%)" },
          {
            scale: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom 22%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section aria-label="Um instante a dois" className={styles.interlude} ref={sectionRef}>
      <p className={styles.interludeIndex}>Depois dos votos</p>
      <figure className={styles.interludeImage} data-interlude-image>
        <PrototypeImage image={image} sizes="(max-width: 767px) 88vw, 64vw" />
      </figure>
      <p className={styles.interludeLine}>E então,<br />tudo ganhou sentido.</p>
    </section>
  );
}
