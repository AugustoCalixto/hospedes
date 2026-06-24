import { prisma } from "./prisma";
import { parseDateOnly, isDateRangeAvailable, toExclusiveEnd } from "./availability";
import type { ReservationStatus } from "@prisma/client";

const BLOCKING_STATUSES: ReservationStatus[] = ["PENDENTE", "CONFIRMADA"];

export async function getOccupiedRanges(accommodationId: string) {
  const [blocks, reservations] = await Promise.all([
    prisma.availabilityBlock.findMany({ where: { accommodationId } }),
    prisma.reservation.findMany({
      where: {
        accommodationId,
        status: { in: BLOCKING_STATUSES },
      },
    }),
  ]);

  return {
    blocks: blocks.map((b) => {
      const end =
        b.endDate.getTime() <= b.startDate.getTime()
          ? toExclusiveEnd(b.startDate)
          : b.endDate;
      return { startDate: b.startDate, endDate: end };
    }),
    reservations: reservations.map((r) => ({
      startDate: r.checkIn,
      endDate: r.checkOut,
    })),
  };
}

export async function checkAvailability(
  accommodationId: string,
  checkIn: string,
  checkOut: string,
): Promise<boolean> {
  const { blocks, reservations } = await getOccupiedRanges(accommodationId);
  return isDateRangeAvailable(blocks, reservations, {
    startDate: parseDateOnly(checkIn),
    endDate: parseDateOnly(checkOut),
  });
}

export async function getPublishedAccommodations(filters?: {
  citySlug?: string;
  type?: string;
  minGuests?: number;
  minPrice?: number;
  maxPrice?: number;
}) {
  return prisma.accommodation.findMany({
    where: {
      published: true,
      ...(filters?.citySlug && { city: { slug: filters.citySlug } }),
      ...(filters?.type && { type: filters.type }),
      ...(filters?.minGuests && { maxGuests: { gte: filters.minGuests } }),
      ...(filters?.minPrice && { pricePerNight: { gte: filters.minPrice } }),
      ...(filters?.maxPrice && { pricePerNight: { lte: filters.maxPrice } }),
    },
    include: {
      city: true,
      photos: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
}

export async function getAccommodationBySlug(slug: string) {
  return prisma.accommodation.findUnique({
    where: { slug, published: true },
    include: {
      city: true,
      photos: { orderBy: { sortOrder: "asc" } },
    },
  });
}
