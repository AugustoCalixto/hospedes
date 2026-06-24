import { prisma } from "./prisma";
import { generateReservationCode } from "./reservation-code";

export async function createUniqueReservationCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateReservationCode();
    const existing = await prisma.reservation.findUnique({ where: { code } });
    if (!existing) return code;
  }
  throw new Error("Não foi possível gerar código único para a reserva");
}

export async function getReservationByCode(code: string) {
  return prisma.reservation.findUnique({
    where: { code },
    include: {
      accommodation: {
        include: { city: true },
      },
    },
  });
}
