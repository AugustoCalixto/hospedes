"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { PhotoUploader } from "./photo-uploader";
import { Button } from "@/components/ui/button";
import type { AccommodationPhoto } from "@prisma/client";

type Props = {
  accommodationId: string;
  photos: AccommodationPhoto[];
  onAdd: (accommodationId: string, url: string, alt?: string) => Promise<void>;
  onDelete: (id: string, accommodationId: string) => Promise<void>;
  disabled?: boolean;
};

export function PhotoManager({ accommodationId, photos, onAdd, onDelete, disabled }: Props) {
  const router = useRouter();

  async function handleUploaded(url: string) {
    await onAdd(accommodationId, url);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await onDelete(id, accommodationId);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PhotoUploader onUploaded={handleUploaded} disabled={disabled} />

      {photos.length > 0 ? (
        <div>
          <p className="mb-3 text-sm font-medium text-stone-600">
            {photos.length} foto{photos.length !== 1 ? "s" : ""} cadastrada{photos.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100">
                  <Image
                    src={photo.url}
                    alt={photo.alt || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => handleDelete(photo.id)}
                  disabled={disabled}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-stone-500">
          Nenhuma foto cadastrada. A primeira imagem será usada como capa no site.
        </p>
      )}
    </div>
  );
}
