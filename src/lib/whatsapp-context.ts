import { prisma } from "./prisma";
import { getAccommodationTypeLabel } from "./validations";
import type { WhatsAppPageContext } from "./whatsapp";

export async function resolveWhatsAppContext(
  pathname: string,
  siteName: string,
): Promise<WhatsAppPageContext> {
  const path = pathname.split("?")[0];

  if (path === "/") {
    return { page: "home", siteName, placeName: siteName };
  }

  if (path === "/acomodacoes") {
    return { page: "accommodations", siteName, placeName: "Acomodações" };
  }

  if (path === "/reserva") {
    return { page: "reservation", siteName, placeName: "Consulta de reserva" };
  }

  if (path === "/sobre") {
    return { page: "about", siteName, placeName: siteName };
  }

  if (path === "/contato") {
    return { page: "contact", siteName, placeName: siteName };
  }

  const accommodationMatch = path.match(/^\/acomodacoes\/([^/]+)$/);
  if (accommodationMatch) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { slug: accommodationMatch[1], published: true },
      include: { city: true },
    });

    if (accommodation) {
      return {
        page: "accommodation",
        siteName,
        placeName: accommodation.name,
        city: accommodation.city.name,
        type: getAccommodationTypeLabel(accommodation.type),
        pricePerNight: accommodation.pricePerNight.toString(),
      };
    }
  }

  const cityMatch = path.match(/^\/cidades\/([^/]+)$/);
  if (cityMatch) {
    const city = await prisma.city.findUnique({
      where: { slug: cityMatch[1] },
    });

    if (city) {
      return { page: "city", siteName, placeName: city.name };
    }
  }

  return { page: "default", siteName, placeName: siteName };
}
