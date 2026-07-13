"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt?: string;
  siteName?: string;
};

export function HomeHeroSection({
  title,
  subtitle,
  imageUrl,
  imageAlt = "Paisagem de montanha",
  siteName,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxY, setParallaxY] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);

    function onMotionChange(event: MediaQueryListEvent) {
      setReduceMotion(event.matches);
    }

    media.addEventListener("change", onMotionChange);
    return () => media.removeEventListener("change", onMotionChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setParallaxY(0);
      return;
    }

    let frame = 0;

    function updateParallax() {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollProgress = Math.max(0, -rect.top);
      setParallaxY(scrollProgress * 0.4);
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateParallax);
    }

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[85vh] items-center justify-center overflow-hidden"
    >
      <div
        className="absolute -inset-y-[20%] inset-x-0 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxY}px, 0)` }}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-emerald-950/85" />
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-teal-900/30" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center text-white md:py-32">
        {siteName && (
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-emerald-50 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            {siteName}
          </div>
        )}

        <h1 className="mt-6 text-4xl font-bold tracking-tight drop-shadow-lg md:text-6xl md:leading-tight">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-stone-100/95 md:text-xl">
          {subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="group h-12 bg-white px-8 text-base font-semibold text-emerald-900 shadow-lg shadow-black/25 hover:bg-emerald-50"
          >
            <Link href="/acomodacoes">
              Ver acomodações
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-white/35 bg-white/5 px-8 text-base text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
          >
            <Link href="/contato">Fale conosco</Link>
          </Button>
        </div>

        <p className="mt-8 inline-flex items-center gap-2 text-sm text-emerald-100/80">
          <MapPin className="h-4 w-4" />
          Destinos serranos com charme e conforto
        </p>
      </div>

      <svg
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-full text-stone-50"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,60 C320,95 520,25 720,50 C920,75 1120,35 1440,55 L1440,100 L0,100 Z"
        />
      </svg>
    </section>
  );
}
