"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type AdminCityRow = {
  id: string;
  name: string;
  slug: string;
  accommodationCount: number;
  attractionCount: number;
  galleryCount: number;
  hasHeroImage: boolean;
};

type Props = {
  cities: AdminCityRow[];
};

export function CitiesList({ cities }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return cities;

    return cities.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.slug.toLowerCase().includes(query),
    );
  }, [cities, search]);

  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <Label htmlFor="search">Buscar</Label>
        <div className="relative mt-1.5 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nome ou slug..."
            className="pl-9"
          />
        </div>
        <p className="mt-3 text-sm text-stone-500">
          {filtered.length} de {cities.length} {cities.length === 1 ? "cidade" : "cidades"}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-500">Nenhuma cidade encontrada.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-stone-50 text-left text-stone-500">
              <tr>
                <th className="p-4">Cidade</th>
                <th className="p-4">Acomodações</th>
                <th className="p-4">Conteúdo</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((city) => (
                <tr key={city.id} className="border-b border-stone-100 last:border-0">
                  <td className="p-4">
                    <p className="font-medium">{city.name}</p>
                    <p className="text-xs text-stone-400">/cidades/{city.slug}</p>
                  </td>
                  <td className="p-4">{city.accommodationCount}</td>
                  <td className="p-4 text-stone-600">
                    {city.hasHeroImage ? "Capa" : "Sem capa"}
                    {" · "}
                    {city.galleryCount} foto{city.galleryCount !== 1 ? "s" : ""}
                    {" · "}
                    {city.attractionCount} atração{city.attractionCount !== 1 ? "s" : ""}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/cidades/${city.id}`}
                        className="text-emerald-700 hover:underline"
                      >
                        Editar
                      </Link>
                      <a
                        href={`/cidades/${city.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-stone-500 hover:text-emerald-700"
                      >
                        Ver
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
