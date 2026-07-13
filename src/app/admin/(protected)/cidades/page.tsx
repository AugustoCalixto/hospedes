import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CitiesList } from "@/components/admin/cities-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminCitiesPage() {
  const cities = await prisma.city.findMany({
    include: { _count: { select: { accommodations: true } } },
    orderBy: { name: "asc" },
  });

  const rows = cities.map((city) => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
    accommodationCount: city._count.accommodations,
    attractionCount: (city.attractions as string[]).length,
    galleryCount: (city.gallery as string[]).length,
    hasHeroImage: Boolean(city.heroImage),
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cidades</h1>
          <p className="mt-1 text-sm text-stone-500">
            Gerencie destinos, atrações e galerias de fotos
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/cidades/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova cidade
          </Link>
        </Button>
      </div>

      <CitiesList cities={rows} />
    </div>
  );
}
