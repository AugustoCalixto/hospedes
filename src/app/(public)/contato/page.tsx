import type { Metadata } from "next";
import { getSiteSettings, buildWhatsAppLink } from "@/lib/notifications";
import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const whatsappHref = settings.contactWhatsapp
    ? buildWhatsAppLink(settings.contactWhatsapp, "Olá! Gostaria de mais informações.")
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Contato</h1>
      <p className="mt-2 text-stone-600">Estamos prontos para ajudar você</p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          {settings.contactPhone && (
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 text-emerald-700" />
              <div>
                <p className="font-medium">Telefone</p>
                <p className="text-stone-600">{settings.contactPhone}</p>
              </div>
            </div>
          )}
          {settings.contactEmail && (
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-emerald-700" />
              <div>
                <p className="font-medium">E-mail</p>
                <a href={`mailto:${settings.contactEmail}`} className="text-emerald-700 hover:underline">
                  {settings.contactEmail}
                </a>
              </div>
            </div>
          )}
          {settings.contactAddress && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-emerald-700" />
              <div>
                <p className="font-medium">Endereço</p>
                <p className="text-stone-600">{settings.contactAddress}</p>
              </div>
            </div>
          )}
          {whatsappHref && (
            <Button asChild>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          )}

          {settings.mapLat && settings.mapLng && (
            <div className="mt-8 aspect-video overflow-hidden rounded-xl">
              <iframe
                title="Localização"
                className="h-full w-full border-0"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${settings.mapLat},${settings.mapLng}&z=15&output=embed`}
              />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Envie uma mensagem</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
