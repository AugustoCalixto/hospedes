import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { RESERVATION_STATUS_LABELS } from "@/lib/validations";
import { updateReservationStatus } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReservationStatus } from "@prisma/client";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminReservationsPage({ searchParams }: Props) {
  const { status } = await searchParams;

  const reservations = await prisma.reservation.findMany({
    where: status ? { status: status as ReservationStatus } : undefined,
    include: { accommodation: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses = Object.keys(RESERVATION_STATUS_LABELS) as ReservationStatus[];

  return (
    <div>
      <h1 className="text-2xl font-bold">Reservas</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/reservas"
          className={`rounded-full px-3 py-1 text-sm ${!status ? "bg-emerald-700 text-white" : "bg-stone-200"}`}
        >
          Todas
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/reservas?status=${s}`}
            className={`rounded-full px-3 py-1 text-sm ${status === s ? "bg-emerald-700 text-white" : "bg-stone-200"}`}
          >
            {RESERVATION_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {reservations.map((r) => (
          <div key={r.id} className="rounded-xl border border-stone-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{r.guestName}</p>
                <p className="text-sm text-stone-600">{r.accommodation.name}</p>
                <p className="mt-2 text-sm">
                  {formatDate(r.checkIn)} — {formatDate(r.checkOut)} · {r.guestCount} hóspedes
                </p>
                <p className="text-sm text-stone-500">
                  {r.guestEmail} · {r.guestPhone}
                </p>
                {r.notes && <p className="mt-2 text-sm text-stone-600">{r.notes}</p>}
              </div>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm">
                {RESERVATION_STATUS_LABELS[r.status]}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {r.status === "SOLICITADA" && (
                <>
                  <form action={updateReservationStatus.bind(null, r.id, "PENDENTE")}>
                    <Button type="submit" size="sm" variant="outline">Marcar pendente</Button>
                  </form>
                  <form action={updateReservationStatus.bind(null, r.id, "CONFIRMADA")}>
                    <Button type="submit" size="sm">Confirmar</Button>
                  </form>
                  <form action={updateReservationStatus.bind(null, r.id, "CANCELADA")}>
                    <Button type="submit" size="sm" variant="destructive">Cancelar</Button>
                  </form>
                </>
              )}
              {r.status === "PENDENTE" && (
                <>
                  <form action={updateReservationStatus.bind(null, r.id, "CONFIRMADA")}>
                    <Button type="submit" size="sm">Confirmar</Button>
                  </form>
                  <form action={updateReservationStatus.bind(null, r.id, "CANCELADA")}>
                    <Button type="submit" size="sm" variant="destructive">Cancelar</Button>
                  </form>
                </>
              )}
              {r.status === "CONFIRMADA" && (
                <form action={updateReservationStatus.bind(null, r.id, "FINALIZADA")}>
                  <Button type="submit" size="sm" variant="outline">Finalizar</Button>
                </form>
              )}
            </div>
          </div>
        ))}

        {reservations.length === 0 && (
          <p className="text-stone-500">Nenhuma reserva encontrada.</p>
        )}
      </div>
    </div>
  );
}
