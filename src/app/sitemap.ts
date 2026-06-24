import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";

  const [accommodations, cities] = await Promise.all([
    prisma.accommodation.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.city.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages = ["", "/acomodacoes", "/reserva", "/sobre", "/contato"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const accommodationPages = accommodations.map((acc) => ({
    url: `${baseUrl}/acomodacoes/${acc.slug}`,
    lastModified: acc.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const cityPages = cities.map((city) => ({
    url: `${baseUrl}/cidades/${city.slug}`,
    lastModified: city.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...accommodationPages, ...cityPages];
}
