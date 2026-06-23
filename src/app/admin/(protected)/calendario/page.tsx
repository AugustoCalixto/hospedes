import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { createAvailabilityBlock, deleteAvailabilityBlock } from "@/lib/admin-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

      <form
        action={createAvailabilityBlock}
        className="mt-8 grid gap-4 rounded-xl border border-stone-200 bg-white p-6 md:grid-cols-5"
      >
        <div>
          <Label htmlFor="accommodationId">Acomodação</Label>
          <select
            id="accommodationId"
            name="accommodationId"
            className="flex h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
            required
          >
            {accommodations.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="startDate">Início</Label>
          <Input id="startDate" name="startDate" type="date" required />
        </div>
        <div>
          <Label htmlFor="endDate">Fim</Label>
          <Input id="endDate" name="endDate" type="date" required />
        </div>
        <div>
          <Label htmlFor="reason">Motivo</Label>
          <Input id="reason" name="reason" placeholder="Manutenção, etc." />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full">Bloquear</Button>
        </div>
      </form>

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
                        {formatDate(block.startDate)} — {formatDate(block.endDate)}
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
