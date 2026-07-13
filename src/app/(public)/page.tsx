import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/notifications";
import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { HomeHeroSection } from "@/components/home/home-hero-section";
import { ReservationCtaSection } from "@/components/home/reservation-cta-section";
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
      <HomeHeroSection
        title={settings.homeHeroTitle}
        subtitle={settings.homeHeroSubtitle}
        imageUrl={heroImage}
        siteName={settings.siteName}
      />

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

      <ReservationCtaSection />
    </>
  );
}
