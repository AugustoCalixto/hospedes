"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getAccommodationTypeLabel } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type AdminAccommodationRow = {
  id: string;
  name: string;
  type: string;
  pricePerNight: string;
  published: boolean;
  featured: boolean;
  city: { id: string; name: string };
};

type Props = {
  accommodations: AdminAccommodationRow[];
  cities: { id: string; name: string }[];
  types: string[];
};

export function AccommodationsList({ accommodations, cities, types }: Props) {
  const [search, setSearch] = useState("");
  const [cityId, setCityId] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return accommodations.filter((acc) => {
      if (cityId !== "all" && acc.city.id !== cityId) return false;
      if (type !== "all" && acc.type !== type) return false;
      if (status === "published" && !acc.published) return false;
      if (status === "draft" && acc.published) return false;
      if (status === "featured" && !acc.featured) return false;

      if (!query) return true;

      return (
        acc.name.toLowerCase().includes(query) ||
        acc.city.name.toLowerCase().includes(query) ||
        getAccommodationTypeLabel(acc.type).toLowerCase().includes(query)
      );
    });
  }, [accommodations, search, cityId, type, status]);

  function clearFilters() {
    setSearch("");
    setCityId("all");
    setType("all");
    setStatus("all");
  }

  const hasActiveFilters =
    search.trim() !== "" || cityId !== "all" || type !== "all" || status !== "all";

  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative mt-1.5">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome, cidade ou tipo..."
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label>Cidade</Label>
            <Select value={cityId} onValueChange={setCityId}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {getAccommodationTypeLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="draft">Rascunhos</SelectItem>
                <SelectItem value="featured">Em destaque</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-stone-500">
            {filtered.length} de {accommodations.length}{" "}
            {accommodations.length === 1 ? "acomodação" : "acomodações"}
          </p>
          {hasActiveFilters && (
            <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            Nenhuma acomodação encontrada com os filtros selecionados.
          </div>
        ) : (
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
              {filtered.map((acc) => (
                <tr key={acc.id} className="border-b border-stone-100 last:border-0">
                  <td className="p-4 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      {acc.name}
                      {acc.featured && (
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-label="Destaque" />
                      )}
                    </span>
                  </td>
                  <td className="p-4">{acc.city.name}</td>
                  <td className="p-4">{getAccommodationTypeLabel(acc.type)}</td>
                  <td className="p-4">{formatCurrency(acc.pricePerNight)}</td>
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
        )}
      </div>
    </div>
  );
}
