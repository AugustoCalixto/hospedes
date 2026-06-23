import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getPublishedAccommodations } from "@/lib/accommodations";
import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { AccommodationFilters } from "@/components/accommodation/accommodation-filters";

export const metadata: Metadata = {
  title: "Acomodações",
  description: "Chalés, casas e quartos disponíveis para locação",
};

type Props = {
  searchParams: Promise<{
    cidade?: string;
    tipo?: string;
    hospedes?: string;
    precoMin?: string;
    precoMax?: string;
  }>;
};

export default async function AccommodationsPage({ searchParams }: Props) {
  const params = await searchParams;
  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });

  const accommodations = await getPublishedAccommodations({
    citySlug: params.cidade,
    type: params.tipo,
    minGuests: params.hospedes ? parseInt(params.hospedes) : undefined,
    minPrice: params.precoMin ? parseFloat(params.precoMin) : undefined,
    maxPrice: params.precoMax ? parseFloat(params.precoMax) : undefined,
  });

  const grouped = cities
    .map((city) => ({
      city,
      items: accommodations.filter((a) => a.cityId === city.id),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Acomodações</h1>
      <p className="mt-2 text-stone-600">
        Encontre o imóvel ideal para sua estadia
      </p>

      <div className="mt-8">
        <Suspense fallback={<div>Carregando filtros...</div>}>
          <AccommodationFilters cities={cities} />
        </Suspense>
      </div>

      {grouped.length === 0 ? (
        <p className="mt-12 text-center text-stone-500">
          Nenhuma acomodação encontrada com os filtros selecionados.
        </p>
      ) : (
        grouped.map(({ city, items }) => (
          <section key={city.id} className="mt-12">
            <h2 className="text-xl font-semibold text-emerald-800">{city.name}</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((acc) => (
                <AccommodationCard key={acc.id} accommodation={acc} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
