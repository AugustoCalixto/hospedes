import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";

  const staticPages = ["", "/acomodacoes", "/reserva", "/sobre", "/contato"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  try {
    const [accommodations, cities] = await Promise.all([
      prisma.accommodation.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.city.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

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
  } catch {
    // Build Docker sem Postgres — sitemap mínimo
    return staticPages;
  }
}
