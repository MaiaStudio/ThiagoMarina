import type { Metadata } from "next";
import { EditorialCinematicExperience } from "@/prototypes/editorial-cinematic/EditorialCinematicExperience";
import { marinaEThiago } from "@/content/weddings/marina-e-thiago";

export const metadata: Metadata = {
  title: "Marina e Thiago — Nossa história",
  description: "Reviva o casamento de Marina e Thiago em uma experiência fotográfica, dos preparativos à festa.",
};

export default function EditorialCinematicPrototypePage() {
  return <EditorialCinematicExperience data={marinaEThiago} />;
}
