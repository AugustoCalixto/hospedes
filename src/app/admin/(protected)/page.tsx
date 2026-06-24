import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { RESERVATION_STATUS_LABELS } from "@/lib/validations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const [recentReservations, totalAccommodations, pendingReservations, confirmedReservations] =
    await Promise.all([
      prisma.reservation.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { accommodation: true },
      }),
      prisma.accommodation.count(),
      prisma.reservation.count({ where: { status: "SOLICITADA" } }),
      prisma.reservation.count({ where: { status: "CONFIRMADA" } }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-stone-500">
              Acomodações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAccommodations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-stone-500">
              Solicitações pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{pendingReservations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-stone-500">
              Reservas confirmadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-700">{confirmedReservations}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Reservas recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-stone-500">
                  <th className="pb-2 pr-4">Código</th>
                  <th className="pb-2 pr-4">Hóspede</th>
                  <th className="pb-2 pr-4">Acomodação</th>
                  <th className="pb-2 pr-4">Período</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((r) => (
                  <tr key={r.id} className="border-b border-stone-100">
                    <td className="py-3 pr-4 font-mono text-xs">{r.code}</td>
                    <td className="py-3 pr-4">{r.guestName}</td>
                    <td className="py-3 pr-4">{r.accommodation.name}</td>
                    <td className="py-3 pr-4">
                      {formatDate(r.checkIn)} — {formatDate(r.checkOut)}
                    </td>
                    <td className="py-3">{RESERVATION_STATUS_LABELS[r.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            href="/admin/reservas"
            className="mt-4 inline-block text-sm text-emerald-700 hover:underline"
          >
            Ver todas →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
