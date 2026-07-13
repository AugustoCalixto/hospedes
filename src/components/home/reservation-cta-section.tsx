import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  description?: string;
  href?: string;
  buttonLabel?: string;
};

export function ReservationCtaSection({
  title = "Pronto para sua próxima escapada?",
  description = "Consulte disponibilidade e solicite sua reserva em poucos cliques.",
  href = "/acomodacoes",
  buttonLabel = "Fazer reserva",
}: Props) {
  return (
    <section className="relative overflow-hidden bg-emerald-950 pt-28 md:pt-36">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(110,231,183,0.22),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_100%_100%,rgba(45,212,191,0.14),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_80%,rgba(16,185,129,0.12),transparent)]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 md:h-36" aria-hidden>
        <svg
          className="h-full w-full text-stone-50"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,0 L1440,0 L1440,75 C1260,115 1080,25 900,70 C720,115 540,30 360,75 C180,120 60,35 0,80 Z"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-3xl px-4 pb-20 pt-4 text-center md:pb-24 md:pt-6">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-100/90">
          <CalendarCheck className="h-4 w-4" />
          Reserva rápida e sem compromisso
        </p>

        <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-emerald-50/85">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="group h-12 bg-white px-8 text-base font-semibold text-emerald-900 hover:bg-emerald-50"
          >
            <Link href={href}>
              {buttonLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-emerald-200/30 bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/contato">Tirar dúvidas</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
