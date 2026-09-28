"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrototypeImage } from "../PrototypeImage";
import type { PrototypeImage as PrototypeImageData } from "../prototype-data";
import styles from "../editorial-cinematic.module.css";

gsap.registerPlugin(ScrollTrigger);

type CeremonyHorizontalProps = {
  images: readonly PrototypeImageData[];
};

export function CeremonyHorizontal({ images }: CeremonyHorizontalProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const media = gsap.matchMedia();
    media.add(
      {
        animate: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (!context.conditions?.animate) return;
        const scope = gsap.context(() => {
          const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);
          const timeline = gsap.timeline({ defaults: { ease: "none" } });
          timeline
            .to(track, { x: () => -getDistance(), duration: 1 }, 0)
            .fromTo(
              "[data-ceremony-final]",
              { scale: 0.9 },
              { scale: 1.045, duration: 0.2, ease: "power2.out" },
              0.8,
            )
            .to("[data-ceremony-line]", { scaleX: 0.2, autoAlpha: 0, duration: 0.16 }, 0.05);
          ScrollTrigger.create({
              animation: timeline,
              trigger: section,
              start: "top top",
              end: () => `+=${Math.max(window.innerHeight * 4.2, getDistance() * 0.72)}`,
              pin: true,
              scrub: 0.65,
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
    <section aria-labelledby="ceremony-title" className={styles.ceremony} ref={sectionRef}>
      <div aria-hidden="true" className={styles.ceremonyEntryLine} data-ceremony-line />
      <div className={styles.ceremonyTrack} ref={trackRef}>
        <header className={styles.ceremonyOpening}>
          <h2 id="ceremony-title"><span>A</span><span>Cerimônia</span></h2>
          <p>Um caminho. Duas promessas.<br />Tudo ao redor silencia.</p>
        </header>

        <figure className={styles.ceremonyTall}>
          <PrototypeImage image={images[0]} sizes="(max-width: 899px) 88vw, 40vw" />
          <figcaption>01 · A chegada</figcaption>
        </figure>

        <figure className={styles.ceremonyLandscape}>
          <PrototypeImage image={images[1]} sizes="(max-width: 899px) 88vw, 78vw" />
          <figcaption>Todos os olhares voltados para o mesmo instante.</figcaption>
        </figure>

        <div className={styles.ceremonyPair}>
          <figure><PrototypeImage image={images[2]} sizes="(max-width: 899px) 70vw, 31vw" /></figure>
          <figure><PrototypeImage image={images[3]} sizes="(max-width: 899px) 52vw, 24vw" /></figure>
          <p>Entre a espera<br />e o encontro.</p>
        </div>

        <blockquote className={styles.ceremonyQuote}>“Por todos os dias que ainda nos esperam.”</blockquote>

        <figure className={styles.ceremonyFull}>
          <PrototypeImage image={images[4]} sizes="(max-width: 899px) 100vw, 92vw" />
          <figcaption>A promessa</figcaption>
        </figure>

        <div className={styles.ceremonyRelease}>
          <p>Dois caminhos.<br />Uma vida.</p>
          <figure data-ceremony-final>
            <PrototypeImage image={images[5]} sizes="(max-width: 899px) 82vw, 36vw" />
          </figure>
          <span>Continue rolando ↓</span>
        </div>
      </div>
    </section>
  );
}
