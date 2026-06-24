import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { formatInclusivePeriod } from "@/lib/availability";
import { deleteAvailabilityBlock } from "@/lib/admin-actions";
import { BlockForm } from "@/components/admin/block-form";
import { Button } from "@/components/ui/button";
import { RESERVATION_STATUS_LABELS } from "@/lib/validations";

export default async function AdminCalendarPage() {
  const accommodations = await prisma.accommodation.findMany({
    include: {
      blocks: { orderBy: { startDate: "asc" } },
      reservations: {
        where: { status: { in: ["PENDENTE", "CONFIRMADA"] } },
        orderBy: { checkIn: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Calendário</h1>
      <p className="mt-2 text-stone-600">Gerencie bloqueios e visualize ocupação</p>

      <div className="mt-8">
        <BlockForm
          accommodations={accommodations.map((a) => ({ id: a.id, name: a.name }))}
        />
      </div>

      <div className="mt-12 space-y-8">
        {accommodations.map((acc) => (
          <div key={acc.id} className="rounded-xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-semibold">{acc.name}</h2>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-stone-500">Bloqueios manuais</h3>
              {acc.blocks.length === 0 ? (
                <p className="mt-2 text-sm text-stone-400">Nenhum bloqueio</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {acc.blocks.map((block) => (
                    <li key={block.id} className="flex items-center justify-between text-sm">
                      <span>
                        {formatInclusivePeriod(block.startDate, block.endDate)}
                        {block.reason && ` (${block.reason})`}
                      </span>
                      <form action={deleteAvailabilityBlock.bind(null, block.id)}>
                        <Button type="submit" size="sm" variant="ghost">
                          Remover
                        </Button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-stone-500">Reservas ativas</h3>
              {acc.reservations.length === 0 ? (
                <p className="mt-2 text-sm text-stone-400">Nenhuma reserva</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {acc.reservations.map((res) => (
                    <li key={res.id} className="text-sm">
                      {formatDate(res.checkIn)} — {formatDate(res.checkOut)} · {res.guestName} ·{" "}
                      {RESERVATION_STATUS_LABELS[res.status]}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
