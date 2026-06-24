import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  updateAccommodation,
  deleteAccommodation,
  addAccommodationPhoto,
  deleteAccommodationPhoto,
} from "@/lib/admin-actions";
import { AccommodationForm } from "@/components/admin/accommodation-form";
import { PhotoManager } from "@/components/admin/photo-manager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ novo?: string }>;
};

export default async function EditAccommodationPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { novo } = await searchParams;

  const accommodation = await prisma.accommodation.findUnique({
    where: { id },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });

  if (!accommodation) notFound();

  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/acomodacoes"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para acomodações
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Editar: {accommodation.name}</h1>

      {novo === "1" && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Acomodação criada com sucesso. Adicione as fotos abaixo para publicá-la no site.
        </div>
      )}

      <div className="mt-8 space-y-8">
        <AccommodationForm
          cities={cities}
          accommodation={accommodation}
          action={updateAccommodation.bind(null, id)}
        />

        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Fotos</h2>
          <p className="mt-1 text-sm text-stone-500">
            Arraste imagens para a área abaixo ou clique para selecionar arquivos.
          </p>
          <div className="mt-4">
            <PhotoManager
              accommodationId={id}
              photos={accommodation.photos}
              onAdd={addAccommodationPhoto}
              onDelete={deleteAccommodationPhoto}
            />
          </div>
        </section>
      </div>

      <form action={deleteAccommodation.bind(null, id)} className="mt-8">
        <Button type="submit" variant="destructive">
          Excluir acomodação
        </Button>
      </form>
    </div>
  );
}
