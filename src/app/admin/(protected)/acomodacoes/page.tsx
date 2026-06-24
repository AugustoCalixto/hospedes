import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { getAccommodationTypeLabel } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminAccommodationsPage() {
  const accommodations = await prisma.accommodation.findMany({
    include: { city: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Acomodações</h1>
        <Button asChild>
          <Link href="/admin/acomodacoes/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova acomodação
          </Link>
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Cidade</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {accommodations.map((acc) => (
              <tr key={acc.id} className="border-b border-stone-100">
                <td className="p-4 font-medium">{acc.name}</td>
                <td className="p-4">{acc.city.name}</td>
                <td className="p-4">{getAccommodationTypeLabel(acc.type)}</td>
                <td className="p-4">{formatCurrency(acc.pricePerNight.toString())}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      acc.published
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {acc.published ? "Publicado" : "Rascunho"}
                  </span>
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/acomodacoes/${acc.id}`}
                    className="text-emerald-700 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
