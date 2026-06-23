import { prisma } from "@/lib/prisma";
import { createAccommodation } from "@/lib/admin-actions";
import { AccommodationForm } from "@/components/admin/accommodation-form";

export default async function NewAccommodationPage() {
  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold">Nova acomodação</h1>
      <div className="mt-8 max-w-2xl">
        <AccommodationForm cities={cities} action={createAccommodation} />
      </div>
    </div>
  );
}
