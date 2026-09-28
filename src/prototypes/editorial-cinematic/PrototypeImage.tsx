"use client";

import Image from "next/image";
import { useImageLightbox } from "@/components/shared/ImageLightbox";
import type { PrototypeImage as PrototypeImageData } from "./prototype-data";

type PrototypeImageProps = {
  image: PrototypeImageData;
  className?: string;
  sizes?: string;
  preload?: boolean;
};

export function PrototypeImage({
  image,
  className,
  sizes = "100vw",
  preload = false,
}: PrototypeImageProps) {
  const lightbox = useImageLightbox();
  const imageElement = (
    <Image
      alt={image.alt}
      className={className}
      fill
      preload={preload}
      sizes={sizes}
      src={image.src}
      style={{ objectPosition: image.position }}
    />
  );

  if (!lightbox) return imageElement;

  return (
    <button
      aria-label={`Ampliar imagem: ${image.alt}`}
      onClick={() => lightbox.open(image)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        padding: 0,
        border: 0,
        background: "transparent",
        cursor: "zoom-in",
      }}
      type="button"
    >
      {imageElement}
    </button>
  );
}
