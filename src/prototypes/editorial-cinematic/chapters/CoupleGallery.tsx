import type { PrototypeImage } from "../prototype-data";
import { CircularGallery } from "../react-bits/CircularGallery";
import styles from "../editorial-cinematic.module.css";

type CoupleGalleryProps = {
  images: readonly PrototypeImage[];
};

export function CoupleGallery({ images }: CoupleGalleryProps) {
  return (
    <section aria-labelledby="couple-gallery-title" className={styles.coupleChapter}>
      <div className={styles.coupleGalleryHeading}>
        <h2 id="couple-gallery-title">Só nós dois</h2>
        <span>Cinco instantes a dois</span>
      </div>
      <CircularGallery ariaLabel="Galeria interativa dos noivos" images={images} />
    </section>
  );
}
