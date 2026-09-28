import type { EditorialCinematicData, PrototypeImage } from "@/prototypes/editorial-cinematic/prototype-data";

const image = (file: string, alt: string, position = "50% 50%"): PrototypeImage => ({
  src: `/images/lab/${["Marina e Thiago", ...file.split("/")].map(encodeURIComponent).join("/")}`,
  alt,
  position,
});

export const marinaEThiago = {
  couple: { partnerOne: "Marina", partnerTwo: "Thiago" },
  date: "04/04/2025",
  location: "Cumbuco-CE",
  photographer: null,
  theme: {
    ivory: "#f2eee4",
    paper: "#e6dfd1",
    charcoal: "#24231f",
    black: "#090a08",
    olive: "#60634e",
    gold: "#b29a68",
  },
  hero: image("Celebração/IMG_0130.webp", "Marina e Thiago no altar à beira-mar, sob as luzes da cerimônia"),
  editorialIntro: {
    eyebrow: "Capítulo I",
    title: "O começo",
    titleLines: ["O", "começo"],
    body: "Algumas histórias chegam de mansinho. Outras parecem fazer parte de nós desde o primeiro instante.",
    caption: "Os primeiros instantes de um novo capítulo",
    primary: image("Preparação/IMG_9460.webp", "Marina com seu buquê durante os preparativos"),
    secondary: image("Preparação/IMG_9232.webp", "Thiago ajustando o traje antes da cerimônia"),
  },
  detailsImages: [
    image("Decoração/IMG_0069.webp", "Mesa de doces e flores com o mar ao fundo"),
    image("Decoração/15.webp", "Bolo de casamento entre flores brancas"),
    image("Decoração/GAB06449.webp", "Placa de boas-vindas ao casamento de Marina e Thiago"),
    image("Decoração/GAB06455.webp", "Mesa posta com taças, pratos e arranjos florais"),
  ],
  ceremonyImages: [
    image("Celebração/IMG_9981.webp", "Marina entrando na cerimônia acompanhada"),
    image("Celebração/IMG_9914.webp", "Convidados reunidos sob as palmeiras para a cerimônia"),
    image("Celebração/IMG_9895.webp", "Thiago aguardando a chegada de Marina"),
    image("Celebração/IMG_0182.webp", "Marina e Thiago de mãos dadas diante do altar"),
    image("Celebração/GAB07176.webp", "Detalhe em preto e branco das mãos dos noivos na cerimônia"),
    image("Beijo/IMG_0590.webp", "O beijo de Marina e Thiago após o sim"),
  ],
  coupleImages: [
    image("Nossos passos/164.webp", "Marina e Thiago abraçados em um retrato noturno", "50% 65%"),
    image("Nossos passos/160.webp", "Os noivos caminhando de mãos dadas à noite", "50% 70%"),
    image("Nossos passos/159.webp", "Marina e Thiago juntos sob a luz na areia", "50% 70%"),
    image("Nossos passos/161.webp", "O casal caminhando com a cauda do vestido sobre a areia", "50% 70%"),
    image("Nossos passos/162.webp", "Marina e Thiago trocando olhares durante a caminhada", "50% 70%"),
  ],
  portraitImages: [
    image("Preparação/IMG_9359.webp", "Marina de costas, com a cauda do vestido sobre o gramado"),
    image("Preparação/IMG_9364.webp", "Retrato de Marina com o buquê no jardim"),
    image("Nossos passos/167.webp", "Detalhe do vestido e dos passos dos noivos na areia"),
    image("Saída/113.webp", "Marina e Thiago saindo da cerimônia entre os convidados"),
    image("Beijo/IMG_0636.webp", "Marina e Thiago se beijando sob as luzes da noite"),
  ],
  celebrationImages: [
    image("Festa/187.webp", "Marina e Thiago juntos na pista de dança"),
    image("Festa/189.webp", "Os noivos abraçados durante a festa"),
    image("Festa/183.webp", "Marina e Thiago celebrando com os braços erguidos"),
    image("Festa/188.webp", "Um beijo dos noivos no meio da celebração"),
    image("Festa/IMG_1797.webp", "Marina comemorando ao lado de uma convidada"),
    image("Festa/IMG_1574.webp", "Convidados e noivos celebrando juntos"),
    image("Festa/186.webp", "Amigos reunidos ao redor do casal na pista"),
  ],
  guestbook: {
    messages: [
      {
        name: "Padrinhos",
        relationship: "Com amor",
        message: "Que a alegria desta noite acompanhe vocês em todos os dias que virão.",
      },
      {
        name: "Amigos da praia",
        relationship: "Amigos dos noivos",
        message: "Foi lindo celebrar um amor tão leve, cheio de presença e de verdade.",
      },
      {
        name: "Família",
        relationship: "Para Marina e Thiago",
        message: "Que nunca faltem abraço, parceria e motivos para comemorar juntos.",
      },
      {
        name: "Amigos de longa data",
        relationship: "Com carinho",
        message: "Uma noite para guardar no coração. Que a história de vocês siga ainda mais bonita.",
      },
      {
        name: "Quem esteve presente",
        relationship: "Neste dia especial",
        message: "Entre o mar, as luzes e tantos sorrisos, vimos o começo de uma vida inteira.",
      },
      {
        name: "Com muito carinho",
        relationship: "Para o casal",
        message: "Que cada novo capítulo tenha a mesma beleza e alegria deste encontro.",
      },
    ],
  },
  closing: {
    image: image("Saída/IMG_0684.webp", "Marina e Thiago celebrando a saída da cerimônia"),
    line: "E assim, a história continua",
    lines: ["E assim,", "a história continua"],
  },
} satisfies EditorialCinematicData;
