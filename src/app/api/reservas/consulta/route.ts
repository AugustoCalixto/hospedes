import { NextRequest, NextResponse } from "next/server";
import { formatDate } from "@/lib/utils";
import { formatDateOnly } from "@/lib/availability";
import { getReservationByCode } from "@/lib/reservations";
import {
  isValidReservationCodeFormat,
  normalizeReservationCode,
} from "@/lib/reservation-code";

const rateLimit = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimit.get(ip) || []).filter((t) => now - t < 60_000);
  if (timestamps.length >= 10) return true;
  timestamps.push(now);
  rateLimit.set(ip, timestamps);
  return false;
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Muitas tentativas. Tente novamente." }, { status: 429 });
  }

  const raw = request.nextUrl.searchParams.get("code");
  if (!raw) {
    return NextResponse.json({ error: "Código obrigatório" }, { status: 400 });
  }

  const code = normalizeReservationCode(raw);
  if (!isValidReservationCodeFormat(code)) {
    return NextResponse.json({ error: "Código inválido" }, { status: 400 });
  }

  const reservation = await getReservationByCode(code);
  if (!reservation) {
    return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
  }

  return NextResponse.json({
    code: reservation.code,
    status: reservation.status,
    guestName: reservation.guestName,
    guestCount: reservation.guestCount,
    checkIn: formatDateOnly(reservation.checkIn),
    checkOut: formatDateOnly(reservation.checkOut),
    createdAt: reservation.createdAt.toISOString(),
    accommodation: {
      name: reservation.accommodation.name,
      slug: reservation.accommodation.slug,
      city: reservation.accommodation.city.name,
    },
  });
}
