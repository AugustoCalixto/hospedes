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
};

export function PhotoManager({ accommodationId, photos, onAdd, onDelete }: Props) {
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
    <div className="mt-4 space-y-4 rounded-xl border border-stone-200 bg-white p-4">
      <PhotoUploader accommodationId={accommodationId} onUploaded={handleUploaded} />

      <div className="grid gap-4 sm:grid-cols-2">
        {photos.map((photo) => (
          <div key={photo.id} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100">
              <Image src={photo.url} alt={photo.alt || ""} fill className="object-cover" sizes="200px" />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="mt-2"
              onClick={() => handleDelete(photo.id)}
            >
              Remover
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
