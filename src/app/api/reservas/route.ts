import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validations";
import { checkAvailability } from "@/lib/accommodations";
import { notifyNewReservation } from "@/lib/notifications";
import { parseDateOnly } from "@/lib/availability";

const rateLimit = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = 5;
  const timestamps = (rateLimit.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) return true;
  timestamps.push(now);
  rateLimit.set(ip, timestamps);
  return false;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Muitas tentativas. Tente novamente." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = reservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    if (parsed.data.website) {
      return NextResponse.json({ error: "Requisição rejeitada" }, { status: 400 });
    }

    const accommodation = await prisma.accommodation.findUnique({
      where: { id: parsed.data.accommodationId, published: true },
    });

    if (!accommodation) {
      return NextResponse.json({ error: "Acomodação não encontrada" }, { status: 404 });
    }

    if (parsed.data.guestCount > accommodation.maxGuests) {
      return NextResponse.json(
        { error: `Máximo de ${accommodation.maxGuests} hóspedes` },
        { status: 400 },
      );
    }

    const checkIn = parseDateOnly(parsed.data.checkIn);
    const checkOut = parseDateOnly(parsed.data.checkOut);

    if (checkOut <= checkIn) {
      return NextResponse.json({ error: "Check-out deve ser após check-in" }, { status: 400 });
    }

    const available = await checkAvailability(
      parsed.data.accommodationId,
      parsed.data.checkIn,
      parsed.data.checkOut,
    );

    if (!available) {
      return NextResponse.json({ error: "Período indisponível" }, { status: 409 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        accommodationId: parsed.data.accommodationId,
        checkIn,
        checkOut,
        guestName: parsed.data.guestName,
        guestPhone: parsed.data.guestPhone,
        guestEmail: parsed.data.guestEmail,
        guestCount: parsed.data.guestCount,
        notes: parsed.data.notes,
        status: "SOLICITADA",
      },
      include: { accommodation: true },
    });

    await notifyNewReservation({
      accommodationName: reservation.accommodation.name,
      guestName: reservation.guestName,
      guestEmail: reservation.guestEmail,
      guestPhone: reservation.guestPhone,
      checkIn: format(reservation.checkIn, "dd/MM/yyyy"),
      checkOut: format(reservation.checkOut, "dd/MM/yyyy"),
      guestCount: reservation.guestCount,
    });

    return NextResponse.json({ id: reservation.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
