import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/notifications";

export const metadata: Metadata = {
  title: "Sobre Nós",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{settings.aboutTitle}</h1>
      <div className="prose prose-stone mt-8 max-w-none">
        {settings.aboutContent.split("\n\n").map((paragraph, i) => (
          <p key={i} className="mb-4 text-stone-600 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
