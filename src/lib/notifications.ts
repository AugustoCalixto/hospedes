import { prisma } from "./prisma";

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
}

export function buildWhatsAppLink(
  phone: string,
  message: string,
): string {
  const cleaned = phone.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export async function sendNotificationEmail(
  subject: string,
  html: string,
): Promise<boolean> {
  const settings = await getSiteSettings();
  const to = settings.notificationEmail || settings.contactEmail;
  if (!to) return false;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[email stub]", { to, subject, html });
    return true;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.NOTIFICATION_FROM_EMAIL || "noreply@example.com",
      to: [to],
      subject,
      html,
    }),
  });

  return res.ok;
}

export async function notifyNewReservation(data: {
  accommodationName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
}) {
  const settings = await getSiteSettings();
  const subject = `Nova solicitação de reserva — ${data.accommodationName}`;
  const html = `
    <h2>Nova solicitação de reserva</h2>
    <p><strong>Acomodação:</strong> ${data.accommodationName}</p>
    <p><strong>Hóspede:</strong> ${data.guestName}</p>
    <p><strong>E-mail:</strong> ${data.guestEmail}</p>
    <p><strong>Telefone:</strong> ${data.guestPhone}</p>
    <p><strong>Check-in:</strong> ${data.checkIn}</p>
    <p><strong>Check-out:</strong> ${data.checkOut}</p>
    <p><strong>Hóspedes:</strong> ${data.guestCount}</p>
  `;

  await sendNotificationEmail(subject, html);

  if (settings.contactWhatsapp) {
    const message = `Nova reserva: ${data.accommodationName}\n${data.guestName} — ${data.checkIn} a ${data.checkOut}`;
    return buildWhatsAppLink(settings.contactWhatsapp, message);
  }

  return null;
}

export async function notifyContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const subject = `Contato via site — ${data.name}`;
  const html = `
    <h2>Nova mensagem de contato</h2>
    <p><strong>Nome:</strong> ${data.name}</p>
    <p><strong>E-mail:</strong> ${data.email}</p>
    <p><strong>Telefone:</strong> ${data.phone || "—"}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${data.message.replace(/\n/g, "<br>")}</p>
  `;
  await sendNotificationEmail(subject, html);
}
