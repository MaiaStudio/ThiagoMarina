"use client";

import Image, { type StaticImageData } from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import styles from "./ImageLightbox.module.css";

export type LightboxImage = {
  src: string | StaticImageData;
  alt: string;
  position?: string;
};

type ImageLightboxContextValue = {
  open: (image: LightboxImage) => void;
};

const ImageLightboxContext = createContext<ImageLightboxContextValue | null>(null);

export function useImageLightbox() {
  return useContext(ImageLightboxContext);
}

export function ImageLightboxProvider({ children }: PropsWithChildren) {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const close = useCallback(() => setImage(null), []);
  const open = useCallback((nextImage: LightboxImage) => setImage(nextImage), []);

  useEffect(() => {
    if (!image) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, image]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ImageLightboxContext.Provider value={value}>
      {children}
      {image ? (
        <div className={styles.backdrop} onClick={close} role="presentation">
          <button
            aria-label="Fechar visualização ampliada ao clicar fora da imagem"
            className={styles.backdropClose}
            onClick={close}
            type="button"
          />
          <section
            aria-label={`Visualização ampliada: ${image.alt}`}
            aria-modal="true"
            className={styles.dialog}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button aria-label="Fechar visualização ampliada" className={styles.close} onClick={close} type="button">
              <span aria-hidden="true">×</span>
            </button>
            <Image
              alt={image.alt}
              className={styles.image}
              fill
              sizes="100vw"
              src={image.src}
              style={{ objectPosition: image.position ?? "center center" }}
            />
            <p className={styles.caption}>{image.alt}</p>
          </section>
        </div>
      ) : null}
    </ImageLightboxContext.Provider>
  );
}
