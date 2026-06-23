"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { City } from "@prisma/client";

type Props = {
  cities: City[];
};

export function AccommodationFilters({ cities }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/acomodacoes?${params.toString()}`);
  }

  return (
    <form
      className="grid gap-4 rounded-xl border border-stone-200 bg-white p-4 md:grid-cols-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <Label>Cidade</Label>
        <Select
          defaultValue={searchParams.get("cidade") || ""}
          onValueChange={(v) => updateFilter("cidade", v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.slug}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Tipo</Label>
        <Select
          defaultValue={searchParams.get("tipo") || ""}
          onValueChange={(v) => updateFilter("tipo", v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="CHALE">Chalé</SelectItem>
            <SelectItem value="CASA">Casa</SelectItem>
            <SelectItem value="QUARTO">Quarto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="hospedes">Hóspedes (mín.)</Label>
        <Input
          id="hospedes"
          type="number"
          min={1}
          defaultValue={searchParams.get("hospedes") || ""}
          onChange={(e) => updateFilter("hospedes", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="precoMin">Preço mín.</Label>
        <Input
          id="precoMin"
          type="number"
          min={0}
          defaultValue={searchParams.get("precoMin") || ""}
          onChange={(e) => updateFilter("precoMin", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="precoMax">Preço máx.</Label>
        <Input
          id="precoMax"
          type="number"
          min={0}
          defaultValue={searchParams.get("precoMax") || ""}
          onChange={(e) => updateFilter("precoMax", e.target.value)}
        />
      </div>

      <div className="md:col-span-5">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/acomodacoes")}
        >
          Limpar filtros
        </Button>
      </div>
    </form>
  );
}
