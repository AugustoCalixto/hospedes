import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { ACCOMMODATION_TYPE_LABELS } from "@/lib/validations";
import { Users, MapPin } from "lucide-react";
import type { Accommodation, AccommodationPhoto, City } from "@prisma/client";

type AccommodationWithRelations = Accommodation & {
  city: City;
  photos: AccommodationPhoto[];
};

export function AccommodationCard({
  accommodation,
}: {
  accommodation: AccommodationWithRelations;
}) {
  const photo = accommodation.photos[0];
  const amenities = (accommodation.amenities as string[]).slice(0, 3);

  return (
    <Link
      href={`/acomodacoes/${accommodation.slug}`}
      className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {photo ? (
          <Image
            src={photo.url}
            alt={photo.alt || accommodation.name}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-stone-400">
            Sem foto
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              {ACCOMMODATION_TYPE_LABELS[accommodation.type]}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-stone-900">
              {accommodation.name}
            </h3>
          </div>
          <p className="shrink-0 text-sm font-bold text-emerald-800">
            {formatCurrency(accommodation.pricePerNight.toString())}
            <span className="block text-xs font-normal text-stone-500">/ noite</span>
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-stone-600">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {accommodation.city.name}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Até {accommodation.maxGuests} hóspedes
          </span>
        </div>
        {amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {amenities.map((item) => (
              <span
                key={item}
                className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
              >
                {item}
              </span>
            ))}
          </div>
        )}
        <span className="mt-4 inline-block text-sm font-medium text-emerald-700 group-hover:underline">
          Ver detalhes →
        </span>
      </div>
    </Link>
  );
}
