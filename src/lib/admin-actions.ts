"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import {
  accommodationSchema,
  blockSchema,
  citySchema,
  reviewSchema,
  siteSettingsSchema,
} from "@/lib/validations";
import { parseDateOnly, toExclusiveEnd } from "@/lib/availability";
import type { ReservationStatus } from "@prisma/client";

async function requireAuth() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return session;
}

function parseJsonArray(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  const str = value.toString();
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return str.split("\n").filter(Boolean);
  }
}

function parseCityFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    description: formData.get("description"),
    heroImage: formData.get("heroImage")?.toString().trim() || undefined,
    attractions: parseJsonArray(formData.get("attractions")),
    gallery: parseJsonArray(formData.get("gallery")),
  };
}

function revalidateCityPaths() {
  revalidatePath("/admin/cidades");
  revalidatePath("/admin/conteudo");
  revalidatePath("/admin/acomodacoes");
  revalidatePath("/");
  revalidatePath("/acomodacoes");
  revalidatePath("/cidades");
}

export async function createCityQuick(name: string) {
  await requireAuth();
  const slug = slugify(name);
  const existing = await prisma.city.findUnique({ where: { slug } });
  if (existing) return existing;

  const city = await prisma.city.create({
    data: {
      name,
      slug,
      description: `Descubra nossas acomodações em ${name}.`,
    },
  });

  revalidatePath("/admin/acomodacoes");
  revalidatePath("/admin/cidades");
  revalidatePath("/admin/conteudo");
  return city;
}

export async function createCity(formData: FormData) {
  await requireAuth();

  const parsed = citySchema.safeParse(parseCityFormData(formData));
  if (!parsed.success) throw new Error("Dados inválidos");

  const slug = slugify(parsed.data.name);
  const existing = await prisma.city.findUnique({ where: { slug } });
  if (existing) throw new Error("Já existe uma cidade com esse nome");

  const created = await prisma.city.create({
    data: { ...parsed.data, slug },
  });

  revalidateCityPaths();
  redirect(`/admin/cidades/${created.id}?novo=1`);
}

export async function createAccommodation(formData: FormData) {
  await requireAuth();

  const raw = {
    cityId: formData.get("cityId"),
    name: formData.get("name"),
    type: formData.get("type"),
    maxGuests: formData.get("maxGuests"),
    bedrooms: formData.get("bedrooms"),
    beds: formData.get("beds"),
    bathrooms: formData.get("bathrooms"),
    pricePerNight: formData.get("pricePerNight"),
    description: formData.get("description"),
    amenities: parseJsonArray(formData.get("amenities")),
    rules: parseJsonArray(formData.get("rules")),
    lat: formData.get("lat") || undefined,
    lng: formData.get("lng") || undefined,
    featured: formData.get("featured") === "on",
    published: formData.get("published") !== "off",
  };

  const parsed = accommodationSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Dados inválidos");

  const slug = slugify(parsed.data.name);
  const created = await prisma.accommodation.create({
    data: { ...parsed.data, slug },
  });

  revalidatePath("/admin/acomodacoes");
  revalidatePath("/acomodacoes");
  redirect(`/admin/acomodacoes/${created.id}?novo=1`);
}

export async function updateAccommodation(id: string, formData: FormData) {
  await requireAuth();

  const raw = {
    cityId: formData.get("cityId"),
    name: formData.get("name"),
    type: formData.get("type"),
    maxGuests: formData.get("maxGuests"),
    bedrooms: formData.get("bedrooms"),
    beds: formData.get("beds"),
    bathrooms: formData.get("bathrooms"),
    pricePerNight: formData.get("pricePerNight"),
    description: formData.get("description"),
    amenities: parseJsonArray(formData.get("amenities")),
    rules: parseJsonArray(formData.get("rules")),
    lat: formData.get("lat") || undefined,
    lng: formData.get("lng") || undefined,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };

  const parsed = accommodationSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Dados inválidos");

  await prisma.accommodation.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/admin/acomodacoes");
  revalidatePath("/acomodacoes");
}

export async function deleteAccommodation(id: string) {
  await requireAuth();
  await prisma.accommodation.delete({ where: { id } });
  revalidatePath("/admin/acomodacoes");
  revalidatePath("/acomodacoes");
  redirect("/admin/acomodacoes");
}

export async function addAccommodationPhoto(accommodationId: string, url: string, alt?: string) {
  await requireAuth();
  const count = await prisma.accommodationPhoto.count({ where: { accommodationId } });
  await prisma.accommodationPhoto.create({
    data: { accommodationId, url, alt, sortOrder: count },
  });
  revalidatePath(`/admin/acomodacoes/${accommodationId}`);
}

export async function deleteAccommodationPhoto(id: string, accommodationId: string) {
  await requireAuth();
  await prisma.accommodationPhoto.delete({ where: { id } });
  revalidatePath(`/admin/acomodacoes/${accommodationId}`);
}

export async function createAvailabilityBlock(formData: FormData) {
  await requireAuth();

  const raw = {
    accommodationId: formData.get("accommodationId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    reason: formData.get("reason") || undefined,
  };

  const parsed = blockSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Dados inválidos");

  await prisma.availabilityBlock.create({
    data: {
      ...parsed.data,
      startDate: parseDateOnly(parsed.data.startDate),
      endDate: toExclusiveEnd(parseDateOnly(parsed.data.endDate)),
    },
  });

  revalidatePath("/admin/calendario");
}

export async function deleteAvailabilityBlock(id: string) {
  await requireAuth();
  await prisma.availabilityBlock.delete({ where: { id } });
  revalidatePath("/admin/calendario");
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  await requireAuth();
  await prisma.reservation.update({ where: { id }, data: { status } });
  revalidatePath("/admin/reservas");
}

export async function updateReservation(id: string, formData: FormData) {
  await requireAuth();

  await prisma.reservation.update({
    where: { id },
    data: {
      checkIn: parseDateOnly(formData.get("checkIn") as string),
      checkOut: parseDateOnly(formData.get("checkOut") as string),
      guestCount: parseInt(formData.get("guestCount") as string),
      notes: formData.get("notes")?.toString() || null,
      status: formData.get("status") as ReservationStatus,
    },
  });

  revalidatePath("/admin/reservas");
}

export async function updateSiteSettings(formData: FormData) {
  await requireAuth();

  const raw = {
    siteName: formData.get("siteName"),
    homeHeroTitle: formData.get("homeHeroTitle"),
    homeHeroSubtitle: formData.get("homeHeroSubtitle"),
    aboutTitle: formData.get("aboutTitle"),
    aboutContent: formData.get("aboutContent"),
    contactPhone: formData.get("contactPhone") || undefined,
    contactWhatsapp: formData.get("contactWhatsapp") || undefined,
    contactEmail: formData.get("contactEmail") || undefined,
    contactAddress: formData.get("contactAddress") || undefined,
    socialInstagram: formData.get("socialInstagram") || undefined,
    socialFacebook: formData.get("socialFacebook") || undefined,
    mapLat: formData.get("mapLat") || undefined,
    mapLng: formData.get("mapLng") || undefined,
    notificationEmail: formData.get("notificationEmail") || undefined,
  };

  const parsed = siteSettingsSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Dados inválidos");

  await prisma.siteSettings.update({
    where: { id: "default" },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/sobre");
  revalidatePath("/contato");
  revalidatePath("/admin/conteudo");
}

export async function createReview(formData: FormData) {
  await requireAuth();

  const parsed = reviewSchema.safeParse({
    guestName: formData.get("guestName"),
    rating: formData.get("rating"),
    content: formData.get("content"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) throw new Error("Dados inválidos");

  await prisma.review.create({ data: parsed.data });
  revalidatePath("/admin/conteudo");
  revalidatePath("/");
}

export async function deleteReview(id: string) {
  await requireAuth();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/conteudo");
  revalidatePath("/");
}

export async function updateCity(id: string, formData: FormData) {
  await requireAuth();

  const parsed = citySchema.safeParse(parseCityFormData(formData));
  if (!parsed.success) throw new Error("Dados inválidos");

  const slug = slugify(parsed.data.name);
  const slugTaken = await prisma.city.findFirst({
    where: { slug, NOT: { id } },
  });
  if (slugTaken) throw new Error("Já existe outra cidade com esse nome");

  await prisma.city.update({
    where: { id },
    data: { ...parsed.data, slug },
  });

  revalidateCityPaths();
}

export async function deleteCity(id: string) {
  await requireAuth();

  const accommodationCount = await prisma.accommodation.count({ where: { cityId: id } });
  if (accommodationCount > 0) {
    throw new Error("Não é possível excluir uma cidade com acomodações vinculadas");
  }

  await prisma.city.delete({ where: { id } });
  revalidateCityPaths();
  redirect("/admin/cidades");
}
