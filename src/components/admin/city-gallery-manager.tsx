"use client";

import { useState } from "react";
import Image from "next/image";
import { PhotoUploader } from "./photo-uploader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Props = {
  name?: string;
  label?: string;
  defaultValue?: string[];
};

export function CityGalleryManager({
  name = "gallery",
  label = "Galeria de fotos",
  defaultValue = [],
}: Props) {
  const [urls, setUrls] = useState(defaultValue);

  function addUrl(url: string) {
    setUrls((prev) => (prev.includes(url) ? prev : [...prev, url]));
  }

  function removeUrl(url: string) {
    setUrls((prev) => prev.filter((item) => item !== url));
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />

      <PhotoUploader onUploaded={addUrl} />

      {urls.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {urls.map((url) => (
            <div key={url} className="space-y-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100">
                <Image src={url} alt="" fill className="object-cover" sizes="200px" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => removeUrl(url)}
              >
                Remover
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-stone-500">Nenhuma foto na galeria. Envie imagens acima.</p>
      )}
    </div>
  );
}
