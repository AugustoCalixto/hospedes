"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export function PhotoUploader({
  onUploaded,
}: {
  accommodationId: string;
  onUploaded: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) onUploaded(data.url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Input type="file" accept="image/*" onChange={handleUpload} disabled={loading} />
      {loading && <p className="mt-1 text-sm text-stone-500">Enviando...</p>}
    </div>
  );
}
