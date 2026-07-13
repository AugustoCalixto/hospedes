"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, buildWhatsAppMessage, resolveWhatsAppPhone } from "@/lib/whatsapp";

type Props = {
  siteName: string;
  phone: string;
};

function buildFallbackHref(pathname: string, siteName: string, phone: string): string {
  const staticPaths: Record<string, Parameters<typeof buildWhatsAppMessage>[0]["page"]> = {
    "/": "home",
    "/acomodacoes": "accommodations",
    "/reserva": "reservation",
    "/sobre": "about",
    "/contato": "contact",
  };

  const page = staticPaths[pathname];
  if (!page) {
    return buildWhatsAppLink(
      phone,
      buildWhatsAppMessage({ page: "default", siteName, placeName: siteName }),
    );
  }

  const placeNames: Partial<Record<typeof page, string>> = {
    home: siteName,
    accommodations: "Acomodações",
    reservation: "Consulta de reserva",
    about: siteName,
    contact: siteName,
  };

  return buildWhatsAppLink(
    phone,
    buildWhatsAppMessage({ page, siteName, placeName: placeNames[page] }),
  );
}

function needsDynamicContext(pathname: string): boolean {
  return /^\/acomodacoes\/[^/]+$/.test(pathname) || /^\/cidades\/[^/]+$/.test(pathname);
}

export function WhatsAppFloatingButton({ siteName, phone }: Props) {
  const pathname = usePathname();
  const resolvedPhone = resolveWhatsAppPhone(phone);
  const [href, setHref] = useState(() => buildFallbackHref(pathname, siteName, resolvedPhone));

  useEffect(() => {
    let cancelled = false;

    async function updateHref() {
      if (needsDynamicContext(pathname)) {
        try {
          const res = await fetch(`/api/whatsapp-context?path=${encodeURIComponent(pathname)}`);
          const data = await res.json();
          if (!cancelled && data.href) {
            setHref(data.href);
            return;
          }
        } catch {
          // fallback abaixo
        }
      }

      if (!cancelled) {
        setHref(buildFallbackHref(pathname, siteName, resolvedPhone));
      }
    }

    void updateHref();
    return () => {
      cancelled = true;
    };
  }, [pathname, siteName, resolvedPhone]);

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
