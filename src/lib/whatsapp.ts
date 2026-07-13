/** Número padrão: +55 35 98433-8063 */
export const DEFAULT_WHATSAPP_PHONE = "5535984338063";

export function normalizeWhatsAppPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function resolveWhatsAppPhone(settingsPhone?: string | null): string {
  const cleaned = settingsPhone ? normalizeWhatsAppPhone(settingsPhone) : "";
  return cleaned || DEFAULT_WHATSAPP_PHONE;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${normalizeWhatsAppPhone(phone)}?text=${encodeURIComponent(message)}`;
}

/** Formatação nativa do WhatsApp: *negrito*, _itálico_, ~riscado~ */
export const wa = {
  bold: (text: string) => `*${text}*`,
  italic: (text: string) => `_${text}_`,
  strike: (text: string) => `~${text}~`,
};

export type WhatsAppPageContext = {
  page:
    | "home"
    | "accommodations"
    | "accommodation"
    | "city"
    | "reservation"
    | "about"
    | "contact"
    | "default";
  siteName: string;
  placeName?: string;
  city?: string;
  type?: string;
  pricePerNight?: string;
};

export function buildWhatsAppMessage(ctx: WhatsAppPageContext): string {
  const place = ctx.placeName || ctx.siteName;

  switch (ctx.page) {
    case "home":
      return [
        "Olá!",
        "",
        `Vim pelo site da *${ctx.siteName}* e gostaria de mais informações.`,
        "",
        "Pode me ajudar?",
      ].join("\n");

    case "accommodations":
      return [
        "Olá!",
        "",
        `Vim pela página de *${place}* e gostaria de ajuda para escolher um imóvel.`,
        "",
        "Pode me ajudar?",
      ].join("\n");

    case "accommodation":
      return buildWhatsAppAccommodationMessage(ctx);

    case "city":
      return [
        "Olá!",
        "",
        `Tenho interesse em hospedagem em *${place}*.`,
        "",
        "Gostaria de saber sobre disponibilidade e opções.",
      ].join("\n");

    case "reservation":
      return [
        "Olá!",
        "",
        `Vim pela página de *${place}* e preciso de ajuda com minha reserva.`,
        "",
        "Pode me ajudar?",
      ].join("\n");

    case "about":
      return [
        "Olá!",
        "",
        `Vim pela página *Sobre nós* do site *${ctx.siteName}*.`,
        "",
        "Gostaria de mais informações.",
      ].join("\n");

    case "contact":
      return [
        "Olá!",
        "",
        `Vim pela página de *contato* do site *${ctx.siteName}*.`,
        "",
        "Gostaria de mais informações.",
      ].join("\n");

    default:
      return [
        "Olá!",
        "",
        `Vim pelo site *${place}* e gostaria de mais informações.`,
        "",
        "Pode me ajudar?",
      ].join("\n");
  }
}

function buildWhatsAppAccommodationMessage(ctx: WhatsAppPageContext): string {
  const lines = [
    "Olá!",
    "",
    "Tenho interesse na acomodação:",
    "",
    `*${ctx.placeName}*`,
  ];

  if (ctx.city) lines.push(`Cidade: ${ctx.city}`);
  if (ctx.type) lines.push(`Tipo: ${ctx.type}`);
  if (ctx.pricePerNight) {
    lines.push(`Valor: R$ ${formatPrice(ctx.pricePerNight)}/noite`);
  }

  lines.push("", "Gostaria de saber sobre *disponibilidade* e condições.");

  return lines.join("\n");
}

function formatPrice(value: string): string {
  const num = parseFloat(value);
  if (Number.isNaN(num)) return value;
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function whatsAppReservationStatusMessage(code: string): string {
  return [
    "Olá!",
    "",
    "Gostaria de consultar minha reserva:",
    "",
    `Código: ${wa.bold(code)}`,
  ].join("\n");
}

export function whatsAppNewReservationMessage(params: {
  code: string;
  accommodationName: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
}): string {
  return [
    "Olá!",
    "",
    "Acabei de enviar uma *solicitação de reserva* pelo site:",
    "",
    `Código: ${wa.bold(params.code)}`,
    `Acomodação: ${params.accommodationName}`,
    `Check-in: ${params.checkIn}`,
    `Check-out: ${params.checkOut}`,
    `Hóspedes: ${params.guestCount}`,
    "",
    "Aguardo retorno. Obrigado!",
  ].join("\n");
}

export function whatsAppAdminNewReservationMessage(params: {
  code: string;
  accommodationName: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
}): string {
  return [
    wa.bold("Nova solicitação de reserva"),
    "",
    `Código: ${params.code}`,
    `Acomodação: ${params.accommodationName}`,
    `Hóspede: ${params.guestName}`,
    `Período: ${params.checkIn} a ${params.checkOut}`,
  ].join("\n");
}

/** @deprecated Use buildWhatsAppMessage */
export function whatsAppGeneralMessage(siteName = "nosso site"): string {
  return buildWhatsAppMessage({ page: "home", siteName, placeName: siteName });
}

/** @deprecated Use buildWhatsAppMessage */
export function whatsAppAccommodationMessage(params: {
  name: string;
  city: string;
  type: string;
  pricePerNight?: string;
}): string {
  return buildWhatsAppMessage({
    page: "accommodation",
    siteName: "",
    placeName: params.name,
    city: params.city,
    type: params.type,
    pricePerNight: params.pricePerNight?.replace(/[^\d,.-]/g, "").replace(",", "."),
  });
}

/** @deprecated Use buildWhatsAppMessage */
export function whatsAppContactMessage(siteName = "nosso site"): string {
  return buildWhatsAppMessage({ page: "contact", siteName, placeName: siteName });
}
