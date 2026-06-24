import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createAccommodation } from "@/lib/admin-actions";
import { AccommodationForm } from "@/components/admin/accommodation-form";
import { ArrowLeft } from "lucide-react";

export default async function NewAccommodationPage() {
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
      <h1 className="mt-4 text-2xl font-bold">Nova acomodação</h1>
      <p className="mt-2 text-stone-600">
        Preencha as informações abaixo para cadastrar um novo imóvel
      </p>
      <div className="mt-8">
        <AccommodationForm cities={cities} action={createAccommodation} />
      </div>
    </div>
  );
}
