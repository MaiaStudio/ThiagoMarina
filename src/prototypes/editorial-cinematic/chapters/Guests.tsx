import { InfiniteCanvas3D } from "@/components/galleries/InfiniteCanvas3D";
import type { EditorialCinematicData } from "../prototype-data";
import styles from "./Guests.module.css";

export function Guests({ content }: { content: NonNullable<EditorialCinematicData["guests"]> }) {
  return (
    <section id="convidados" aria-labelledby="guests-title" className={styles.section}>
      <header className={styles.heading}>
        <span className={styles.rule} aria-hidden="true" />
        <h2 id="guests-title">{content.headline}</h2>
      </header>
      <InfiniteCanvas3D images={content.images} label="Fotografias dos convidados" />
    </section>
  );
}
