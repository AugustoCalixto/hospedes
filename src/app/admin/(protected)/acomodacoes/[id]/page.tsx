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
};

export default async function EditAccommodationPage({ params }: Props) {
  const { id } = await params;
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

      <div className="mt-8 space-y-8">
        <AccommodationForm
          cities={cities}
          accommodation={accommodation}
          action={updateAccommodation.bind(null, id)}
        />

        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Fotos</h2>
          <PhotoManager
            accommodationId={id}
            photos={accommodation.photos}
            onAdd={addAccommodationPhoto}
            onDelete={deleteAccommodationPhoto}
          />
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
