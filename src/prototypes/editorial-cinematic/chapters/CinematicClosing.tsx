"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrototypeImage } from "../PrototypeImage";
import type { EditorialCinematicData } from "../prototype-data";
import styles from "../editorial-cinematic.module.css";

gsap.registerPlugin(ScrollTrigger);

type CinematicClosingProps = {
  closing: EditorialCinematicData["closing"];
  couple: string;
  date: string;
  location: string;
  photographer: EditorialCinematicData["photographer"];
};

export function CinematicClosing({ closing, couple, date, location, photographer }: CinematicClosingProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(
          "[data-closing-image]",
          { clipPath: "inset(10% 16% 10% 16%)", scale: 0.96, autoAlpha: 0.52 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            autoAlpha: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: "[data-closing-stage]",
              start: "top 88%",
              end: "bottom 34%",
              scrub: 0.7,
            },
          },
        );
        gsap.from("[data-closing-copy] > *", {
          autoAlpha: 0,
          y: 36,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-closing-copy]", start: "top 74%", once: true },
        });
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section aria-labelledby="closing-title" className={styles.closing} ref={sectionRef}>
      <div className={styles.closingImageStage} data-closing-stage>
        <figure className={styles.closingImage} data-closing-image>
          <div className={styles.closingImageFrame}>
            <PrototypeImage image={closing.image} sizes="(max-width: 899px) 88vw, 78vw" />
          </div>
          <figcaption>Um instante para guardar</figcaption>
        </figure>
      </div>
      <div className={styles.closingCopy} data-closing-copy>
        <h2 aria-label={closing.line} id="closing-title">
          {closing.lines.map((line) => <span aria-hidden="true" key={line}>{line}</span>)}
        </h2>
        <p className={styles.closingCouple}>{couple}</p>
        <p className={styles.closingDate}>{date}</p>
        <p className={styles.closingLocation}>{location}</p>
      </div>
      {photographer ? <footer className={styles.credits}>
        <p>Fotografia por</p>
        <div className={styles.monogram} aria-label={`Monograma de ${photographer.name}`}>
          <span>{photographer.monogram}</span>
        </div>
        <p className={styles.studioName}>{photographer.name}</p>
        <nav aria-label="Links do fotógrafo">
          <a href={photographer.instagram} rel="noreferrer" target="_blank">Instagram</a>
          <a href={photographer.website} rel="noreferrer" target="_blank">Site</a>
        </nav>
        <p className={styles.creditLine}>Uma fotografia se torna um lugar para onde voltar.</p>
      </footer> : null}
    </section>
  );
}
