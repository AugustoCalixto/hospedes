import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/notifications";
import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default async function HomePage() {
  const [settings, featured, cities, reviews] = await Promise.all([
    getSiteSettings(),
    prisma.accommodation.findMany({
      where: { published: true, featured: true },
      include: { city: true, photos: { orderBy: { sortOrder: "asc" }, take: 1 } },
      take: 3,
    }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.review.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const heroImages = (settings.homeHeroImages as string[]) || [];
  const heroImage =
    heroImages[0] ||
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: settings.siteName,
    description: settings.homeHeroSubtitle,
    telephone: settings.contactPhone,
    email: settings.contactEmail,
    address: settings.contactAddress
      ? { "@type": "PostalAddress", streetAddress: settings.contactAddress, addressCountry: "BR" }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <Image
          src={heroImage}
          alt="Pousada"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">{settings.homeHeroTitle}</h1>
          <p className="mt-4 text-lg text-stone-100">{settings.homeHeroSubtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/acomodacoes">Ver acomodações</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/contato">Fale conosco</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-stone-900">Destaques</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {featured.map((acc) => (
            <AccommodationCard key={acc.id} accommodation={acc} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold">Nossos destinos</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {cities.map((city) => (
              <Link
                key={city.id}
                href={`/cidades/${city.slug}`}
                className="group overflow-hidden rounded-xl border border-stone-200"
              >
                {city.heroImage && (
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={city.heroImage}
                      alt={city.name}
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="50vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{city.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-stone-600">
                    {city.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold">O que nossos hóspedes dizem</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <blockquote
                key={review.id}
                className="rounded-xl border border-stone-200 bg-white p-6"
              >
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-stone-600">&ldquo;{review.content}&rdquo;</p>
                <footer className="mt-4 text-sm font-medium">{review.guestName}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      <section className="bg-emerald-800 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold">Pronto para sua próxima escapada?</h2>
          <p className="mt-3 text-emerald-100">
            Consulte disponibilidade e solicite sua reserva em poucos cliques.
          </p>
          <Button asChild size="lg" className="mt-6 bg-white text-emerald-800 hover:bg-stone-100">
            <Link href="/acomodacoes">Fazer reserva</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
