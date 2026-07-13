import Link from "next/link";
import { createCity } from "@/lib/admin-actions";
import { CityForm } from "@/components/admin/city-form";
import { ArrowLeft } from "lucide-react";

export default function NewCityPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/cidades"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para cidades
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Nova cidade</h1>
      <p className="mt-2 text-stone-600">
        Cadastre um novo destino com descrição, fotos e atrações
      </p>
      <div className="mt-8">
        <CityForm action={createCity} />
      </div>
    </div>
  );
}
