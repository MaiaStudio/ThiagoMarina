import { ImageLightboxProvider } from "@/components/shared/ImageLightbox";
import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body><ImageLightboxProvider>{children}</ImageLightboxProvider></body>
    </html>
  );
}
