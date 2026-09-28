import { CinematicHero } from "@/components/heroes/CinematicHero";
import type { EditorialCinematicData } from "./prototype-data";
import { EditorialPrologue } from "./chapters/EditorialPrologue";
import { DetailsComposition } from "./chapters/DetailsComposition";
import { CeremonyHorizontal } from "./chapters/CeremonyHorizontal";
import { IntimateInterlude } from "./chapters/IntimateInterlude";
import { CoupleGallery } from "./chapters/CoupleGallery";
import { PortraitStack } from "./chapters/PortraitStack";
import { Celebration } from "./chapters/Celebration";
import { MessageWall } from "./chapters/MessageWall";
import { Guests } from "./chapters/Guests";
import { CinematicClosing } from "./chapters/CinematicClosing";
import { PrototypeSmoothScroll } from "./PrototypeSmoothScroll";
import styles from "./editorial-cinematic.module.css";

type EditorialCinematicExperienceProps = {
  data: EditorialCinematicData;
};

export function EditorialCinematicExperience({ data }: EditorialCinematicExperienceProps) {
  return (
    <PrototypeSmoothScroll>
      <main className={styles.experience} lang="pt-BR">
        <div className={styles.heroScene}>
          <CinematicHero
            date={data.date}
            location={data.location}
            eyebrow="Nosso casamento · 01"
            scrollLabel="Role para descobrir"
            introductionLabel={`Casamento de ${data.couple.partnerOne} e ${data.couple.partnerTwo}`}
            image={data.hero.src}
            imageAlt={data.hero.alt}
            imagePosition={data.hero.position}
            partnerOne={data.couple.partnerOne}
            partnerTwo={data.couple.partnerTwo}
            subtitle="Uma história de amor"
            theme={{
              background: data.theme.black,
              foreground: data.theme.ivory,
              accent: data.theme.gold,
            }}
          />
        </div>

        <EditorialPrologue content={data.editorialIntro} />
        <DetailsComposition images={data.detailsImages} />
        <CeremonyHorizontal images={data.ceremonyImages} />
        <IntimateInterlude image={data.coupleImages[0]} />
        <CoupleGallery images={data.coupleImages} />
        <PortraitStack images={data.portraitImages} />
        <Celebration
          couple={`${data.couple.partnerOne} & ${data.couple.partnerTwo}`}
          date={data.date}
          location={data.location}
          images={data.celebrationImages}
        />
        {data.guests && <Guests content={data.guests} />}
        <MessageWall
          couple={`${data.couple.partnerOne} e ${data.couple.partnerTwo}`}
          guestbook={data.guestbook}
        />
        <CinematicClosing
          closing={data.closing}
          couple={`${data.couple.partnerOne} & ${data.couple.partnerTwo}`}
          date={data.date}
          location={data.location}
          photographer={data.photographer}
        />
      </main>
    </PrototypeSmoothScroll>
  );
}
