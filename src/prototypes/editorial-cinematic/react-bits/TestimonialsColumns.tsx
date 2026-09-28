"use client";

import styles from "./TestimonialsColumns.module.css";

export type Testimonial = {
  name: string;
  relationship: string;
  message: string;
};

type TestimonialsColumnProps = {
  testimonials: readonly Testimonial[];
  duration?: number;
  direction?: "up" | "down";
  className?: string;
};

export function TestimonialsColumn({
  testimonials,
  duration = 36,
  direction = "up",
  className,
}: TestimonialsColumnProps) {
  const cards = [...testimonials, ...testimonials];

  return (
    <div
      className={[styles.column, className].filter(Boolean).join(" ")}
      style={{
        "--testimonial-duration": `${duration}s`,
        "--testimonial-direction": direction === "up" ? "normal" : "reverse",
      } as React.CSSProperties}
    >
      <div className={styles.track}>
        {cards.map((testimonial, index) => (
          <article
            aria-hidden={index >= testimonials.length}
            className={styles.card}
            key={`${testimonial.name}-${testimonial.message}-${index}`}
          >
            <p className={styles.message}>“{testimonial.message}”</p>
            <footer className={styles.author}>
              <span className={styles.name}>{testimonial.name}</span>
              <span className={styles.relation}>{testimonial.relationship}</span>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
