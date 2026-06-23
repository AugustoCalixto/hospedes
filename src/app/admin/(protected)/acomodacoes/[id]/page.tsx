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
    <div>
      <h1 className="text-2xl font-bold">Editar: {accommodation.name}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <AccommodationForm
          cities={cities}
          accommodation={accommodation}
          action={updateAccommodation.bind(null, id)}
        />

        <div>
          <h2 className="text-lg font-semibold">Fotos</h2>
          <PhotoManager
            accommodationId={id}
            photos={accommodation.photos}
            onAdd={addAccommodationPhoto}
            onDelete={deleteAccommodationPhoto}
          />
        </div>
      </div>

      <form action={deleteAccommodation.bind(null, id)} className="mt-8">
        <Button type="submit" variant="destructive">
          Excluir acomodação
        </Button>
      </form>
    </div>
  );
}
