"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Photo = {
  id: string;
  url: string;
  alt: string | null;
};

type Props = {
  photos: Photo[];
  accommodationName: string;
};

export function AccommodationPhotoGallery({ photos, accommodationName }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const activePhoto = photos[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (photos.length === 0) return;
      setActiveIndex((index + photos.length) % photos.length);
    },
    [photos.length],
  );

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, activeIndex, goTo]);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-stone-100 text-stone-400">
        Sem fotos
      </div>
    );
  }

  const gridPhotos = photos.slice(0, 5);
  const extraCount = photos.length - gridPhotos.length;

  return (
    <>
      <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2">
        {gridPhotos.map((photo, i) => {
          const isLastWithMore = i === gridPhotos.length - 1 && extraCount > 0;

          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => {
                setActiveIndex(isLastWithMore ? gridPhotos.length : i);
                setOpen(true);
              }}
              className={cn(
                "group relative overflow-hidden rounded-xl bg-stone-100 text-left",
                i === 0 ? "md:col-span-2 md:row-span-2 aspect-[4/3]" : "aspect-[4/3]",
              )}
              aria-label={`Ampliar foto ${i + 1} de ${photos.length}`}
            >
              <Image
                src={photo.url}
                alt={photo.alt || accommodationName}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes={i === 0 ? "50vw" : "25vw"}
                priority={i === 0}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                <ZoomIn className="h-8 w-8 text-white opacity-0 drop-shadow transition group-hover:opacity-100" />
              </div>
              {isLastWithMore && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                  +{extraCount}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            {activePhoto?.alt || accommodationName} — foto {activeIndex + 1} de {photos.length}
          </DialogTitle>

          <div className="relative mx-4 overflow-hidden rounded-xl bg-black">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 text-white hover:bg-white/20"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </Button>

            {photos.length > 1 && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => goTo(activeIndex - 1)}
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => goTo(activeIndex + 1)}
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <div className="relative flex max-h-[85vh] min-h-[40vh] items-center justify-center">
              {activePhoto && (
                <Image
                  src={activePhoto.url}
                  alt={activePhoto.alt || accommodationName}
                  width={1920}
                  height={1280}
                  className="max-h-[85vh] w-auto object-contain"
                  sizes="100vw"
                  priority
                />
              )}
            </div>

            {photos.length > 1 && (
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                {activeIndex + 1} / {photos.length}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
