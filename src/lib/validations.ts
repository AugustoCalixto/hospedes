import { z } from "zod";

export const reservationSchema = z.object({
  accommodationId: z.string().min(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guestName: z.string().min(2).max(100),
  guestPhone: z.string().min(8).max(20),
  guestEmail: z.string().email(),
  guestCount: z.coerce.number().int().min(1).max(50),
  notes: z.string().max(500).optional(),
  website: z.string().max(0).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  message: z.string().min(10).max(2000),
  website: z.string().max(0).optional(),
});

export const accommodationSchema = z.object({
  cityId: z.string().min(1),
  name: z.string().min(2).max(100),
  type: z.enum(["CHALE", "CASA", "QUARTO"]),
  maxGuests: z.coerce.number().int().min(1),
  bedrooms: z.coerce.number().int().min(0),
  beds: z.coerce.number().int().min(1),
  bathrooms: z.coerce.number().int().min(1),
  pricePerNight: z.coerce.number().positive(),
  description: z.string().min(10),
  amenities: z.array(z.string()).default([]),
  rules: z.array(z.string()).default([]),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const blockSchema = z.object({
  accommodationId: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().max(200).optional(),
});

export const reviewSchema = z.object({
  guestName: z.string().min(2).max(100),
  rating: z.coerce.number().int().min(1).max(5),
  content: z.string().min(10).max(1000),
  published: z.boolean().default(false),
});

export const citySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10),
  heroImage: z.string().optional(),
  attractions: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(2),
  homeHeroTitle: z.string().min(2),
  homeHeroSubtitle: z.string().min(2),
  aboutTitle: z.string().min(2),
  aboutContent: z.string(),
  contactPhone: z.string().optional(),
  contactWhatsapp: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactAddress: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialFacebook: z.string().optional(),
  mapLat: z.coerce.number().optional(),
  mapLng: z.coerce.number().optional(),
  notificationEmail: z.string().email().optional().or(z.literal("")),
});

export const ACCOMMODATION_TYPE_LABELS: Record<string, string> = {
  CHALE: "Chalé",
  CASA: "Casa",
  QUARTO: "Quarto",
};

export const RESERVATION_STATUS_LABELS: Record<string, string> = {
  SOLICITADA: "Solicitada",
  PENDENTE: "Pendente",
  CONFIRMADA: "Confirmada",
  CANCELADA: "Cancelada",
  FINALIZADA: "Finalizada",
};
