"use client";

import { useState } from "react";
import Image from "next/image";
import { PhotoUploader } from "./photo-uploader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  name?: string;
  defaultValue?: string | null;
};

export function HeroImageField({ name = "heroImage", defaultValue = "" }: Props) {
  const [url, setUrl] = useState(defaultValue || "");

  return (
    <div className="space-y-3">
      <Label htmlFor={name}>Imagem de capa</Label>

      {url && (
        <div className="relative aspect-[21/9] max-w-xl overflow-hidden rounded-xl bg-stone-100">
          <Image src={url} alt="Capa da cidade" fill className="object-cover" sizes="640px" />
        </div>
      )}

      <Input
        id={name}
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL da imagem ou envie um arquivo abaixo"
      />

      <PhotoUploader
        onUploaded={(uploadedUrl) => setUrl(uploadedUrl)}
      />
    </div>
  );
}
