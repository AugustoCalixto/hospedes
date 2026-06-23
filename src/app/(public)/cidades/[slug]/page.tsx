import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = await prisma.city.findUnique({ where: { slug } });
  if (!city) return { title: "Cidade não encontrada" };

  return {
    title: `Hospedagem em ${city.name}`,
    description: city.description.slice(0, 160),
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const city = await prisma.city.findUnique({
    where: { slug },
    include: {
      accommodations: {
        where: { published: true },
        include: { city: true, photos: { orderBy: { sortOrder: "asc" }, take: 1 } },
      },
    },
  });

  if (!city) notFound();

  const attractions = city.attractions as string[];
  const gallery = city.gallery as string[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {city.heroImage && (
        <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-xl">
          <Image
            src={city.heroImage}
            alt={city.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      <h1 className="text-3xl font-bold">{city.name}</h1>
      <p className="mt-4 max-w-3xl text-lg text-stone-600">{city.description}</p>

      {attractions.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Principais atrações</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {attractions.map((item) => (
              <li key={item} className="rounded-lg bg-white px-4 py-3 text-stone-700 shadow-sm">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Galeria</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {gallery.map((url) => (
              <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={url} alt={city.name} fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Acomodações em {city.name}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {city.accommodations.map((acc) => (
            <AccommodationCard key={acc.id} accommodation={acc} />
          ))}
        </div>
        {city.accommodations.length === 0 && (
          <p className="mt-4 text-stone-500">Nenhuma acomodação disponível no momento.</p>
        )}
      </section>

      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link href="/acomodacoes">Ver todas as acomodações</Link>
        </Button>
      </div>
    </div>
  );
}
