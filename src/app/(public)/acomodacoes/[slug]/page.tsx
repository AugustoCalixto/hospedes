import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAccommodationBySlug } from "@/lib/accommodations";
import { getSiteSettings } from "@/lib/notifications";
import {
  buildWhatsAppLink,
  buildWhatsAppMessage,
  resolveWhatsAppPhone,
} from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/utils";
import { getAccommodationTypeLabel } from "@/lib/validations";
import { BookingSection } from "@/components/booking/booking-section";
import { AccommodationPhotoGallery } from "@/components/accommodation/accommodation-photo-gallery";
import { ShareButton } from "@/components/accommodation/share-button";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Users, Home, MessageCircle } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const accommodation = await getAccommodationBySlug(slug);
  if (!accommodation) return { title: "Acomodação não encontrada" };

  return {
    title: accommodation.name,
    description: accommodation.description.slice(0, 160),
    openGraph: {
      images: accommodation.photos[0]?.url ? [accommodation.photos[0].url] : [],
    },
  };
}

export default async function AccommodationDetailPage({ params }: Props) {
  const { slug } = await params;
  const accommodation = await getAccommodationBySlug(slug);
  if (!accommodation) notFound();

  const settings = await getSiteSettings();
  const amenities = accommodation.amenities as string[];
  const rules = accommodation.rules as string[];
  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
  const pageUrl = `${baseUrl}/acomodacoes/${accommodation.slug}`;

  const whatsappHref = buildWhatsAppLink(
    resolveWhatsAppPhone(settings.contactWhatsapp),
    buildWhatsAppMessage({
      page: "accommodation",
      siteName: settings.siteName,
      placeName: accommodation.name,
      city: accommodation.city.name,
      type: getAccommodationTypeLabel(accommodation.type),
      pricePerNight: accommodation.pricePerNight.toString(),
    }),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: accommodation.name,
    description: accommodation.description,
    numberOfRooms: accommodation.bedrooms,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: accommodation.maxGuests,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: accommodation.city.name,
      addressCountry: "BR",
    },
    ...(accommodation.lat &&
      accommodation.lng && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: accommodation.lat,
          longitude: accommodation.lng,
        },
      }),
    offers: {
      "@type": "Offer",
      price: accommodation.pricePerNight.toString(),
      priceCurrency: "BRL",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            {getAccommodationTypeLabel(accommodation.type)} · {accommodation.city.name}
          </p>
          <h1 className="mt-1 text-3xl font-bold">{accommodation.name}</h1>
        </div>
        <div className="flex gap-2">
          <ShareButton title={accommodation.name} url={pageUrl} />
          <Button asChild variant="outline" size="sm">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <AccommodationPhotoGallery
          photos={accommodation.photos}
          accommodationName={accommodation.name}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-6 text-stone-600">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" /> {accommodation.maxGuests} hóspedes
            </span>
            <span className="flex items-center gap-2">
              <Home className="h-5 w-5" /> {accommodation.bedrooms} quartos
            </span>
            <span className="flex items-center gap-2">
              <Bed className="h-5 w-5" /> {accommodation.beds} camas
            </span>
            <span className="flex items-center gap-2">
              <Bath className="h-5 w-5" /> {accommodation.bathrooms} banheiros
            </span>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Descrição</h2>
            <p className="mt-3 whitespace-pre-line text-stone-600">
              {accommodation.description}
            </p>
          </div>

          {amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Comodidades</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {amenities.map((item) => (
                  <li key={item} className="text-stone-600">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {rules.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Regras</h2>
              <ul className="mt-3 space-y-1">
                {rules.map((rule) => (
                  <li key={rule} className="text-stone-600">
                    • {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {accommodation.lat && accommodation.lng && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Localização</h2>
              <div className="mt-3 aspect-video overflow-hidden rounded-xl">
                <iframe
                  title="Mapa"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${accommodation.lat},${accommodation.lng}&z=14&output=embed`}
                />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-2xl font-bold text-emerald-800">
            {formatCurrency(accommodation.pricePerNight.toString())}
            <span className="text-sm font-normal text-stone-500"> / noite</span>
          </p>
          <p className="mt-2 text-sm text-stone-500">
            <Link href={`/cidades/${accommodation.city.slug}`} className="text-emerald-700 hover:underline">
              Ver mais em {accommodation.city.name}
            </Link>
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Disponibilidade e reserva</h2>
        <div className="mt-8">
          <BookingSection
            accommodationId={accommodation.id}
            maxGuests={accommodation.maxGuests}
          />
        </div>
      </section>
    </div>
  );
}
