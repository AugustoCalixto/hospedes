import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Accommodation, City } from "@prisma/client";

type Props = {
  cities: City[];
  accommodation?: Accommodation;
  action: (formData: FormData) => Promise<void>;
};

export function AccommodationForm({ cities, accommodation, action }: Props) {
  const amenities = accommodation
    ? (accommodation.amenities as string[]).join("\n")
    : "";
  const rules = accommodation ? (accommodation.rules as string[]).join("\n") : "";

  return (
    <form action={action} className="space-y-4 rounded-xl border border-stone-200 bg-white p-6">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" defaultValue={accommodation?.name} required />
      </div>

      <div>
        <Label htmlFor="cityId">Cidade</Label>
        <select
          id="cityId"
          name="cityId"
          defaultValue={accommodation?.cityId}
          className="flex h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
          required
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="type">Tipo</Label>
        <select
          id="type"
          name="type"
          defaultValue={accommodation?.type || "CHALE"}
          className="flex h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
        >
          <option value="CHALE">Chalé</option>
          <option value="CASA">Casa</option>
          <option value="QUARTO">Quarto</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maxGuests">Hóspedes máx.</Label>
          <Input id="maxGuests" name="maxGuests" type="number" defaultValue={accommodation?.maxGuests || 2} required />
        </div>
        <div>
          <Label htmlFor="pricePerNight">Preço/noite (R$)</Label>
          <Input id="pricePerNight" name="pricePerNight" type="number" step="0.01" defaultValue={accommodation?.pricePerNight.toString()} required />
        </div>
        <div>
          <Label htmlFor="bedrooms">Quartos</Label>
          <Input id="bedrooms" name="bedrooms" type="number" defaultValue={accommodation?.bedrooms || 1} required />
        </div>
        <div>
          <Label htmlFor="beds">Camas</Label>
          <Input id="beds" name="beds" type="number" defaultValue={accommodation?.beds || 1} required />
        </div>
        <div>
          <Label htmlFor="bathrooms">Banheiros</Label>
          <Input id="bathrooms" name="bathrooms" type="number" defaultValue={accommodation?.bathrooms || 1} required />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" rows={5} defaultValue={accommodation?.description} required />
      </div>

      <div>
        <Label htmlFor="amenities">Comodidades (uma por linha)</Label>
        <Textarea id="amenities" name="amenities" rows={4} defaultValue={amenities} />
      </div>

      <div>
        <Label htmlFor="rules">Regras (uma por linha)</Label>
        <Textarea id="rules" name="rules" rows={3} defaultValue={rules} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lat">Latitude</Label>
          <Input id="lat" name="lat" type="number" step="any" defaultValue={accommodation?.lat ?? ""} />
        </div>
        <div>
          <Label htmlFor="lng">Longitude</Label>
          <Input id="lng" name="lng" type="number" step="any" defaultValue={accommodation?.lng ?? ""} />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={accommodation?.featured} />
          Destaque na home
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={accommodation?.published ?? true} />
          Publicado
        </label>
      </div>

      <Button type="submit">Salvar</Button>
    </form>
  );
}
