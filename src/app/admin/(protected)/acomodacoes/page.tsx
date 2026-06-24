import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AccommodationsList } from "@/components/admin/accommodations-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminAccommodationsPage() {
  const [accommodations, cities] = await Promise.all([
    prisma.accommodation.findMany({
      include: { city: true },
      orderBy: { name: "asc" },
    }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
  ]);

  const types = [...new Set(accommodations.map((acc) => acc.type))].sort();

  const rows = accommodations.map((acc) => ({
    id: acc.id,
    name: acc.name,
    type: acc.type,
    pricePerNight: acc.pricePerNight.toString(),
    published: acc.published,
    featured: acc.featured,
    city: { id: acc.city.id, name: acc.city.name },
  }));

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

      <AccommodationsList
        accommodations={rows}
        cities={cities.map((c) => ({ id: c.id, name: c.name }))}
        types={types}
      />
    </div>
  );
}
