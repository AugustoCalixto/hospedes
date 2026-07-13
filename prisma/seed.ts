import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "changeme123",
    12,
  );

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@example.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      passwordHash,
      name: process.env.ADMIN_NAME || "Administrador",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      contactPhone: "(35) 98433-8063",
      contactWhatsapp: "5535984338063",
    },
    create: {
      id: "default",
      siteName: "Pousada Vale Verde",
      homeHeroTitle: "Sua estadia perfeita na natureza",
      homeHeroSubtitle:
        "Chalés aconchegantes e casas completas em Campos do Jordão e Monte Verde",
      aboutTitle: "Nossa História",
      aboutContent:
        "Há mais de 15 anos recebendo hóspedes com carinho e hospitalidade. Nossa pousada nasceu do sonho de compartilhar os melhores destinos serranos de Minas Gerais e São Paulo.",
      contactPhone: "(35) 98433-8063",
      contactWhatsapp: "5535984338063",
      contactEmail: "contato@pousadavaleverde.com.br",
      contactAddress: "Estrada da Serra, km 12 — Monte Verde, MG",
      notificationEmail: "admin@example.com",
      mapLat: -22.863,
      mapLng: -46.033,
    },
  });

  const campos = await prisma.city.upsert({
    where: { slug: "campos-do-jordao" },
    update: {},
    create: {
      name: "Campos do Jordão",
      slug: "campos-do-jordao",
      description:
        "A Suíça brasileira, com clima frio, gastronomia refinada e paisagens deslumbrantes da Serra da Mantiqueira.",
      heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
      attractions: [
        "Capivari",
        "Morro do Elefante",
        "Parque Amantikir",
        "Festival de Inverno",
      ],
      gallery: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
      ],
    },
  });

  const monteVerde = await prisma.city.upsert({
    where: { slug: "monte-verde" },
    update: {},
    create: {
      name: "Monte Verde",
      slug: "monte-verde",
      description:
        "Vila europeia em Minas Gerais, ideal para casais e famílias que buscam tranquilidade e contato com a natureza.",
      heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
      attractions: [
        "Centro gastronômico",
        "Trilha da Pedra Partida",
        "Vila Suíça",
        "Cachoeira dos Pretos",
      ],
      gallery: [
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        "https://images.unsplash.com/photo-1518173946687-a4c036bc2b2c?w=800",
      ],
    },
  });

  const accommodations = [
    {
      cityId: campos.id,
      name: "Chalé Pinheiro",
      slug: "chale-pinheiro",
      type: "CHALE" as const,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      pricePerNight: 450,
      featured: true,
      lat: -22.739,
      lng: -45.591,
      description:
        "Chalé aconchegante com lareira, varanda com vista para a mata e cozinha completa. Perfeito para casais ou família pequena.",
      amenities: ["Lareira", "Wi-Fi", "Churrasqueira", "Estacionamento", "Cozinha completa"],
      rules: ["Não permitido fumar", "Silêncio após 22h", "Não aceita pets"],
      photo: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    },
    {
      cityId: campos.id,
      name: "Chalé Lavanda",
      slug: "chale-lavanda",
      type: "CHALE" as const,
      maxGuests: 6,
      bedrooms: 3,
      beds: 3,
      bathrooms: 2,
      pricePerNight: 680,
      featured: true,
      lat: -22.741,
      lng: -45.588,
      description:
        "Chalé espaçoso com hidromassagem, deck privativo e aquecimento central. Ideal para grupos e famílias.",
      amenities: ["Hidromassagem", "Wi-Fi", "Aquecimento", "Deck privativo", "Smart TV"],
      rules: ["Não permitido fumar", "Check-out às 11h"],
      photo: "https://images.unsplash.com/photo-1582268611954-ebfd161ef9cf?w=800",
    },
    {
      cityId: monteVerde.id,
      name: "Casa da Serra",
      slug: "casa-da-serra",
      type: "CASA" as const,
      maxGuests: 8,
      bedrooms: 4,
      beds: 5,
      bathrooms: 3,
      pricePerNight: 890,
      featured: true,
      lat: -22.863,
      lng: -46.033,
      description:
        "Casa completa com amplo jardim, lareira e vista panorâmica para a serra. Acomoda até 8 hóspedes com conforto.",
      amenities: ["Lareira", "Jardim", "Churrasqueira", "Wi-Fi", "4 vagas"],
      rules: ["Festas não permitidas", "Pets sob consulta"],
      photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    },
    {
      cityId: monteVerde.id,
      name: "Quarto Master",
      slug: "quarto-master",
      type: "QUARTO" as const,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      pricePerNight: 280,
      featured: false,
      lat: -22.865,
      lng: -46.031,
      description:
        "Suíte master dentro da pousada principal, com café da manhã incluso e acesso à área comum.",
      amenities: ["Café da manhã", "Wi-Fi", "Ar-condicionado", "Frigobar"],
      rules: ["Não permitido fumar", "Horário do café: 7h-10h"],
      photo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    },
  ];

  for (const acc of accommodations) {
    const { photo, ...data } = acc;
    const accommodation = await prisma.accommodation.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });

    const existingPhoto = await prisma.accommodationPhoto.findFirst({
      where: { accommodationId: accommodation.id },
    });

    if (!existingPhoto) {
      await prisma.accommodationPhoto.create({
        data: {
          accommodationId: accommodation.id,
          url: photo,
          alt: data.name,
          sortOrder: 0,
        },
      });
    }
  }

  const reviews = [
    {
      guestName: "Mariana S.",
      rating: 5,
      content:
        "Estadia maravilhosa! O chalé era ainda mais bonito que nas fotos. Recomendo demais.",
      published: true,
    },
    {
      guestName: "Carlos R.",
      rating: 5,
      content:
        "Localização perfeita, atendimento excelente e café da manhã delicioso. Voltaremos!",
      published: true,
    },
    {
      guestName: "Ana Paula M.",
      rating: 4,
      content:
        "Casa muito confortável para nossa família. Apenas o Wi-Fi poderia ser mais rápido.",
      published: true,
    },
  ];

  for (const review of reviews) {
    const exists = await prisma.review.findFirst({
      where: { guestName: review.guestName },
    });
    if (!exists) {
      await prisma.review.create({ data: review });
    }
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
