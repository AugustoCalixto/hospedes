"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Accommodation, City } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { CreatableSelect, type SelectOption } from "@/components/ui/creatable-select";
import { TagCombobox } from "@/components/ui/tag-combobox";
import { MapPicker } from "@/components/admin/map-picker";
import {
  DEFAULT_AMENITIES,
  DEFAULT_ACCOMMODATION_TYPES,
} from "@/lib/formatters";
import { createCityQuick } from "@/lib/admin-actions";
import { Building2, MapPin, Sparkles, BedDouble } from "lucide-react";

type Props = {
  cities: City[];
  accommodation?: Accommodation;
  action: (formData: FormData) => Promise<void>;
};

function cityToOption(city: City): SelectOption {
  return { value: city.id, label: city.name };
}

function getTypeOptions(currentType?: string): SelectOption[] {
  const base = [...DEFAULT_ACCOMMODATION_TYPES];
  if (
    currentType &&
    !base.some((t) => t.value === currentType || t.label === currentType)
  ) {
    base.push({ value: currentType, label: currentType });
  }
  return base;
}

export function AccommodationForm({ cities, accommodation, action }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [cityOptions, setCityOptions] = useState<SelectOption[]>(
    cities.map(cityToOption),
  );
  const [typeOptions, setTypeOptions] = useState<SelectOption[]>(
    getTypeOptions(accommodation?.type),
  );
  const [lat, setLat] = useState<number | null>(accommodation?.lat ?? null);
  const [lng, setLng] = useState<number | null>(accommodation?.lng ?? null);

  const defaultPrice = accommodation
    ? parseFloat(accommodation.pricePerNight.toString())
    : 0;

  async function handleCreateCity(name: string): Promise<SelectOption | null> {
    try {
      const city = await createCityQuick(name);
      return cityToOption(city);
    } catch {
      setError("Não foi possível criar a cidade");
      return null;
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    if (lat != null) formData.set("lat", lat.toString());
    if (lng != null) formData.set("lng", lng.toString());

    startTransition(async () => {
      try {
        await action(formData);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-semibold">Informações básicas</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="name">Nome da acomodação</Label>
            <Input
              id="name"
              name="name"
              defaultValue={accommodation?.name}
              placeholder="Ex: Chalé Pinheiro"
              required
              className="mt-1.5"
            />
          </div>

          <CreatableSelect
            name="cityId"
            label="Cidade"
            options={cityOptions}
            defaultValue={accommodation?.cityId}
            placeholder="Selecione a cidade"
            required
            onCreateOption={handleCreateCity}
            onOptionsChange={setCityOptions}
          />

          <CreatableSelect
            name="type"
            label="Tipo de acomodação"
            options={typeOptions}
            defaultValue={accommodation?.type || "CHALE"}
            placeholder="Selecione o tipo"
            required
            allowCreate
            onOptionsChange={setTypeOptions}
          />

          <div className="md:col-span-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={accommodation?.description}
              placeholder="Descreva a acomodação, diferenciais e experiência..."
              required
              className="mt-1.5"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-2">
          <BedDouble className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-semibold">Capacidade e preço</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="maxGuests">Hóspedes (máx.)</Label>
            <Input
              id="maxGuests"
              name="maxGuests"
              type="number"
              min={1}
              defaultValue={accommodation?.maxGuests || 2}
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="bedrooms">Quartos</Label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min={0}
              defaultValue={accommodation?.bedrooms || 1}
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="beds">Camas</Label>
            <Input
              id="beds"
              name="beds"
              type="number"
              min={1}
              defaultValue={accommodation?.beds || 1}
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="bathrooms">Banheiros</Label>
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              min={1}
              defaultValue={accommodation?.bathrooms || 1}
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Preço por noite</Label>
            <div className="mt-1.5">
              <CurrencyInput
                name="pricePerNight"
                defaultValue={defaultPrice}
                required
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-semibold">Comodidades e regras</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TagCombobox
            name="amenities"
            label="Comodidades"
            suggestions={DEFAULT_AMENITIES}
            defaultValue={(accommodation?.amenities as string[]) || []}
            placeholder="Buscar ou adicionar comodidade..."
          />
          <TagCombobox
            name="rules"
            label="Regras da hospedagem"
            suggestions={[
              "Não permitido fumar",
              "Silêncio após 22h",
              "Não aceita pets",
              "Check-out às 11h",
              "Festas não permitidas",
            ]}
            defaultValue={(accommodation?.rules as string[]) || []}
            placeholder="Buscar ou adicionar regra..."
          />
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-semibold">Localização</h2>
        </div>

        <MapPicker
          lat={lat}
          lng={lng}
          defaultLat={accommodation?.lat}
          defaultLng={accommodation?.lng}
          onLatLngChange={(newLat, newLng) => {
            setLat(newLat);
            setLng(newLng);
          }}
        />
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Publicação</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={accommodation?.featured}
              className="h-4 w-4 rounded border-stone-300 text-emerald-700"
            />
            Destaque na página inicial
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={accommodation?.published ?? true}
              className="h-4 w-4 rounded border-stone-300 text-emerald-700"
            />
            Publicado no site
          </label>
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Salvando..." : accommodation ? "Salvar alterações" : "Criar acomodação"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
