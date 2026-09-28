"use client";

import Image, { type StaticImageData } from "next/image";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useImageLightbox } from "@/components/shared/ImageLightbox";
import styles from "./CinematicHero.module.css";

gsap.registerPlugin(ScrollTrigger);

export type CinematicHeroTheme = {
  background: string;
  foreground: string;
  accent: string;
};

export type CinematicHeroProps = {
  partnerOne: string;
  partnerTwo: string;
  date: string;
  location?: string;
  image: string | StaticImageData;
  imageAlt: string;
  imagePosition?: string;
  eyebrow?: string;
  subtitle?: string;
  scrollLabel?: string;
  introductionLabel?: string;
  theme: CinematicHeroTheme;
  headingLevel?: "h1" | "h2" | "h3";
};

type HeroThemeProperties = CSSProperties & {
  "--h01-background": string;
  "--h01-foreground": string;
  "--h01-accent": string;
};

export function CinematicHero({
  partnerOne,
  partnerTwo,
  date,
  location,
  image,
  imageAlt,
  imagePosition = "center center",
  eyebrow,
  subtitle = "A Wedding Story",
  scrollLabel = "Scroll",
  introductionLabel,
  theme,
  headingLevel: Heading = "h1",
}: CinematicHeroProps) {
  const lightbox = useImageLightbox();
  const longestNameLength = Math.max(
    [...partnerOne].length,
    [...partnerTwo].length,
  );
  const namesClassName = [
    styles.names,
    longestNameLength > 10 ? styles.longNames : null,
    longestNameLength > 13 ? styles.veryLongNames : null,
  ]
    .filter(Boolean)
    .join(" ");

  const heroRef = useRef<HTMLElement>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const imageMotionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const partnerOneRef = useRef<HTMLSpanElement>(null);
  const ampersandRef = useRef<HTMLSpanElement>(null);
  const partnerTwoRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;

    if (!hero) {
      return;
    }

    const media = gsap.matchMedia();

    media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        compact: "(max-width: 767px)",
        full: "(min-width: 768px)",
      },
      (mediaContext) => {
        const { reduceMotion, compact } = mediaContext.conditions as {
          reduceMotion: boolean;
          compact: boolean;
        };

        let exitTrigger: ScrollTrigger | undefined;

        const context = gsap.context(() => {
          const nameParts = [
            partnerOneRef.current,
            ampersandRef.current,
            partnerTwoRef.current,
          ];
          const curtains = [curtainTopRef.current, curtainBottomRef.current];

          if (reduceMotion) {
            gsap.set(
              [
                imageScrollRef.current,
                imageMotionRef.current,
                overlayRef.current,
                metaRef.current,
                ...nameParts,
                subtitleRef.current,
                scrollCueRef.current,
              ],
              { clearProps: "all" },
            );
            gsap.set(curtainTopRef.current, { yPercent: -100 });
            gsap.set(curtainBottomRef.current, { yPercent: 100 });

            return;
          }

          gsap.set(curtains, { yPercent: 0, force3D: true });
          gsap.set(metaRef.current, { autoAlpha: 0, y: 7 });
          gsap.set(nameParts, { autoAlpha: 0, yPercent: 108 });
          gsap.set(subtitleRef.current, { autoAlpha: 0, y: 9 });
          gsap.set(scrollCueRef.current, { autoAlpha: 0, y: 6 });
          gsap.set(imageMotionRef.current, {
            scale: compact ? 1.04 : 1.065,
            force3D: true,
          });

          const intro = gsap.timeline({
            defaults: { ease: "power3.out" },
          });

          intro
            .to(
              metaRef.current,
              { autoAlpha: 1, duration: 0.46, y: 0 },
              0.34,
            )
            .to(
              curtainTopRef.current,
              {
                duration: compact ? 0.78 : 0.92,
                ease: "power3.inOut",
                yPercent: -100,
              },
              0.68,
            )
            .to(
              curtainBottomRef.current,
              {
                duration: compact ? 0.78 : 0.92,
                ease: "power3.inOut",
                yPercent: 100,
              },
              0.68,
            )
            .to(
              imageMotionRef.current,
              {
                duration: compact ? 1.08 : 1.28,
                ease: "power2.out",
                scale: compact ? 1.008 : 1.012,
              },
              0.66,
            )
            .to(
              partnerOneRef.current,
              {
                autoAlpha: 1,
                duration: compact ? 0.52 : 0.62,
                yPercent: 0,
              },
              compact ? 1.24 : 1.3,
            )
            .to(
              ampersandRef.current,
              {
                autoAlpha: 1,
                duration: compact ? 0.4 : 0.46,
                yPercent: 0,
              },
              compact ? 1.5 : 1.6,
            )
            .to(
              partnerTwoRef.current,
              {
                autoAlpha: 1,
                duration: compact ? 0.52 : 0.62,
                yPercent: 0,
              },
              compact ? 1.7 : 1.82,
            )
            .to(
              subtitleRef.current,
              { autoAlpha: 1, duration: 0.42, y: 0 },
              compact ? 2.04 : 2.2,
            )
            .to(
              scrollCueRef.current,
              { autoAlpha: 1, duration: 0.4, y: 0 },
              compact ? 2.34 : 2.5,
            );

          const exit = gsap.timeline({
            defaults: { ease: "none" },
            paused: true,
          });

          exit
            .to(
              scrollCueRef.current,
              { autoAlpha: 0, duration: 0.14, y: -6 },
              0,
            )
            .to(metaRef.current, { autoAlpha: 0, duration: 0.34, y: -6 }, 0)
            .to(
              subtitleRef.current,
              { autoAlpha: 0, duration: 0.4, y: 5 },
              0.06,
            )
            .to(ampersandRef.current, { autoAlpha: 0, duration: 0.26 }, 0.02)
            .to(
              partnerOneRef.current,
              {
                autoAlpha: 0.42,
                duration: 0.8,
                y: compact ? "-3vh" : "-4.2vh",
              },
              0.08,
            )
            .to(
              partnerTwoRef.current,
              {
                autoAlpha: 0.42,
                duration: 0.8,
                y: compact ? "3vh" : "4.2vh",
              },
              0.08,
            )
            .to(
              imageScrollRef.current,
              {
                scale: compact ? 1.025 : 1.038,
                duration: 1,
              },
              0,
            )
            .to(
              overlayRef.current,
              { duration: 1, opacity: 0.78 },
              0,
            );

          intro.eventCallback("onComplete", () => {
            exit.invalidate();
            exitTrigger = ScrollTrigger.create({
              animation: exit,
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: compact ? 0.3 : 0.55,
              invalidateOnRefresh: true,
            });
          });
        }, hero);

        return () => {
          exitTrigger?.kill();
          context.revert();
        };
      },
    );

    return () => media.revert();
  }, []);

  const themeProperties: HeroThemeProperties = {
    "--h01-background": theme.background,
    "--h01-foreground": theme.foreground,
    "--h01-accent": theme.accent,
  };

  return (
    <section
      aria-label={introductionLabel ?? `${partnerOne} and ${partnerTwo} wedding introduction`}
      className={styles.hero}
      ref={heroRef}
      style={themeProperties}
    >
      <div aria-hidden="true" className={styles.background} />

      <div className={styles.imageReveal}>
        <div className={styles.imageScroll} ref={imageScrollRef}>
          <div className={styles.imageMotion} ref={imageMotionRef}>
            {lightbox ? (
              <button
                aria-label={`Ampliar imagem: ${imageAlt}`}
                className={styles.imageButton}
                onClick={() => lightbox.open({ alt: imageAlt, position: imagePosition, src: image })}
                type="button"
              >
                <Image alt={imageAlt} className={styles.image} fill preload sizes="100vw" src={image} style={{ objectPosition: imagePosition }} />
              </button>
            ) : (
              <Image alt={imageAlt} className={styles.image} fill preload sizes="100vw" src={image} style={{ objectPosition: imagePosition }} />
            )}
          </div>
        </div>
      </div>

      <div aria-hidden="true" className={styles.overlay} ref={overlayRef} />

      <div aria-hidden="true" className={styles.curtains}>
        <div className={styles.curtainTop} ref={curtainTopRef} />
        <div className={styles.curtainBottom} ref={curtainBottomRef} />
      </div>

      <div className={styles.content}>
        <div className={styles.meta} ref={metaRef}>
          {eyebrow ? <span>{eyebrow}</span> : null}
          <span>{date}</span>
          {location ? <span>{location}</span> : null}
        </div>

        <Heading className={namesClassName}>
          <span className={styles.nameMask}>
            <span className={styles.nameLine} ref={partnerOneRef}>
              {partnerOne}
            </span>
          </span>
          <span className={`${styles.nameMask} ${styles.ampersandMask}`}>
            <span className={styles.ampersand} ref={ampersandRef}>
              &amp;
            </span>
          </span>
          <span className={styles.nameMask}>
            <span className={styles.nameLine} ref={partnerTwoRef}>
              {partnerTwo}
            </span>
          </span>
        </Heading>

        <p className={styles.subtitle} ref={subtitleRef}>
          {subtitle}
        </p>
      </div>

      <div aria-hidden="true" className={styles.scrollCue} ref={scrollCueRef}>
        <span>{scrollLabel}</span>
        <i />
      </div>
    </section>
  );
}
