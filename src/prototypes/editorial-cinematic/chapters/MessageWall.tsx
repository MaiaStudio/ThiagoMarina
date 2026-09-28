"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { EditorialCinematicData } from "../prototype-data";
import { TestimonialsColumn, type Testimonial } from "../react-bits/TestimonialsColumns";
import styles from "./MessageWall.module.css";

type MessageWallProps = {
  couple: string;
  guestbook: EditorialCinematicData["guestbook"];
};

export function MessageWall({ couple, guestbook }: MessageWallProps) {
  const [testimonials, setTestimonials] = useState<readonly Testimonial[]>(guestbook.messages);
  const [status, setStatus] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (mediaQuery.matches) {
        video.pause();
      } else {
        void video.play().catch(() => undefined);
      }
    };

    syncPlayback();
    mediaQuery.addEventListener("change", syncPlayback);
    return () => mediaQuery.removeEventListener("change", syncPlayback);
  }, []);

  const columns = useMemo(() => {
    const result: Testimonial[][] = [[], [], []];
    testimonials.forEach((testimonial, index) => result[index % result.length].push(testimonial));
    return result.map((column) => column.length ? column : testimonials.slice(0, 1));
  }, [testimonials]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const relationship = String(data.get("relationship") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !message) return;

    setTestimonials((current) => [{
      name,
      relationship: relationship || "Com carinho",
      message,
    }, ...current]);
    setStatus("Seu recado já apareceu no mural.");
    form.reset();
  };

  return (
    <section aria-labelledby="message-wall-title" className={styles.wall}>
      <div aria-hidden="true" className={styles.videoLayer}>
        <video autoPlay className={styles.video} loop muted playsInline preload="metadata" ref={videoRef} src="/images/lab/background%20mural.mp4" />
        <div className={styles.videoMask} />
      </div>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Mural de carinho</p>
        <h2 className={styles.title} id="message-wall-title">Deixe uma lembrança para {couple}</h2>
        <p className={styles.intro}>Palavras, memórias e desejos de quem tornou esse dia ainda mais especial.</p>
      </header>

      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formHeading}>Escreva um recado</h3>
          <p className={styles.formLead}>Sua mensagem aparecerá no mural durante esta visita.</p>

          <div className={styles.field}>
            <label htmlFor="guest-name">Seu nome</label>
            <input autoComplete="name" id="guest-name" name="name" placeholder="Como quer assinar?" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="guest-relationship">Sua relação com o casal</label>
            <input id="guest-relationship" name="relationship" placeholder="Ex.: amiga, padrinho, família" />
          </div>
          <div className={styles.field}>
            <label htmlFor="guest-message">Sua mensagem</label>
            <textarea id="guest-message" name="message" placeholder="Compartilhe uma lembrança ou um desejo para o casal..." required />
          </div>
          <button className={styles.submit} type="submit">Adicionar ao mural</button>
          <p aria-live="polite" className={styles.status}>{status}</p>
        </form>

        <div aria-label="Mensagens de amigos e familiares" className={styles.messages}>
          <TestimonialsColumn duration={38} testimonials={columns[0]} />
          <TestimonialsColumn direction="down" duration={46} testimonials={columns[1]} />
          <TestimonialsColumn duration={42} testimonials={columns[2]} />
        </div>
      </div>
    </section>
  );
}
