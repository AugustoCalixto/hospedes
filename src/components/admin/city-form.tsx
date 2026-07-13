"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { City } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TagCombobox } from "@/components/ui/tag-combobox";
import { HeroImageField } from "@/components/admin/hero-image-field";
import { CityGalleryManager } from "@/components/admin/city-gallery-manager";
import { MapPin, Sparkles, Images } from "lucide-react";

const ATTRACTION_SUGGESTIONS = [
  "Centro histórico",
  "Gastronomia local",
  "Trilhas e cachoeiras",
  "Mirantes",
  "Compras e artesanato",
  "Eventos e festivais",
  "Parques naturais",
  "Vida noturna",
];

type Props = {
  city?: City;
  action: (formData: FormData) => Promise<void>;
};

export function CityForm({ city, action }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

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
          <MapPin className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-semibold">Informações básicas</h2>
        </div>

        <div className="grid gap-5">
          <div>
            <Label htmlFor="name">Nome da cidade</Label>
            <Input
              id="name"
              name="name"
              defaultValue={city?.name}
              placeholder="Ex: Monte Verde"
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={city?.description}
              placeholder="Descreva o destino, clima, experiências..."
              required
              className="mt-1.5"
            />
          </div>

          {city && (
            <p className="text-sm text-stone-500">
              URL pública:{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5">/cidades/{city.slug}</code>
            </p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-2">
          <Images className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-semibold">Imagens</h2>
        </div>

        <div className="space-y-8">
          <HeroImageField defaultValue={city?.heroImage} />
          <CityGalleryManager defaultValue={(city?.gallery as string[]) || []} />
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-semibold">Atrações</h2>
        </div>

        <TagCombobox
          name="attractions"
          label="Pontos de interesse"
          suggestions={ATTRACTION_SUGGESTIONS}
          defaultValue={(city?.attractions as string[]) || []}
          placeholder="Buscar ou adicionar atração..."
        />
      </section>

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Salvando..." : city ? "Salvar alterações" : "Criar cidade"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
