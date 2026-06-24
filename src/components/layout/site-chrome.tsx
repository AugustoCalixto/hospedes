import Link from "next/link";
import { getSiteSettings } from "@/lib/notifications";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/notifications";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/acomodacoes", label: "Acomodações" },
  { href: "/reserva", label: "Minha reserva" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-emerald-800">
          {settings.siteName}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-600 hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/acomodacoes"
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Reservar
          </Link>
        </nav>
      </div>
    </header>
  );
}

export async function WhatsAppButton() {
  const settings = await getSiteSettings();
  if (!settings.contactWhatsapp) return null;

  const href = buildWhatsAppLink(
    settings.contactWhatsapp,
    "Olá! Gostaria de informações sobre hospedagem.",
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-bold text-emerald-800">{settings.siteName}</h3>
          <p className="mt-2 text-sm text-stone-600">
            Chalés e casas para locação em destinos serranos.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-stone-800">Contato</h4>
          <ul className="mt-2 space-y-1 text-sm text-stone-600">
            {settings.contactPhone && <li>{settings.contactPhone}</li>}
            {settings.contactEmail && <li>{settings.contactEmail}</li>}
            {settings.contactAddress && <li>{settings.contactAddress}</li>}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-stone-800">Links</h4>
          <ul className="mt-2 space-y-1 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-stone-600 hover:text-emerald-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-200 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {settings.siteName}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
