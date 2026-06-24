import { NextRequest, NextResponse } from "next/server";
import { getOccupiedRanges } from "@/lib/accommodations";
import { getUnavailableDates, parseDateOnly } from "@/lib/availability";

export async function GET(request: NextRequest) {
  const accommodationId = request.nextUrl.searchParams.get("accommodationId");
  const from = request.nextUrl.searchParams.get("from");
  const to = request.nextUrl.searchParams.get("to");

  if (!accommodationId || !from || !to) {
    return NextResponse.json({ error: "Parâmetros obrigatórios" }, { status: 400 });
  }

  try {
    const { blocks, reservations } = await getOccupiedRanges(accommodationId);
    const unavailable = getUnavailableDates(
      blocks,
      reservations,
      parseDateOnly(from),
      parseDateOnly(to),
    );

    return NextResponse.json({ unavailableDates: unavailable });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
