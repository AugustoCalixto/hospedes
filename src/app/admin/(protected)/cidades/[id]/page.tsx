import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCity, deleteCity } from "@/lib/admin-actions";
import { CityForm } from "@/components/admin/city-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ novo?: string }>;
};

export default async function EditCityPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { novo } = await searchParams;

  const city = await prisma.city.findUnique({
    where: { id },
    include: { _count: { select: { accommodations: true } } },
  });

  if (!city) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/cidades"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para cidades
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Editar: {city.name}</h1>

      {novo === "1" && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Cidade criada com sucesso. Revise as informações e adicione fotos se necessário.
        </div>
      )}

      <div className="mt-8">
        <CityForm city={city} action={updateCity.bind(null, id)} />
      </div>

      <form action={deleteCity.bind(null, id)} className="mt-8">
        <Button type="submit" variant="destructive" disabled={city._count.accommodations > 0}>
          Excluir cidade
        </Button>
        {city._count.accommodations > 0 && (
          <p className="mt-2 text-sm text-stone-500">
            Remova ou reassocie as {city._count.accommodations} acomodações antes de excluir.
          </p>
        )}
      </form>
    </div>
  );
}
