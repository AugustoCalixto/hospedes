"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onUploaded: (url: string) => void;
  disabled?: boolean;
};

export function PhotoUploader({ onUploaded, disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [error, setError] = useState("");

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erro ao enviar imagem");
    }

    onUploaded(data.url);
  }

  async function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));

    if (files.length === 0) {
      setError("Selecione apenas arquivos de imagem.");
      return;
    }

    setError("");
    setLoading(true);
    setUploadCount(files.length);

    try {
      for (const file of files) {
        await uploadFile(file);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar imagens");
    } finally {
      setLoading(false);
      setUploadCount(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled && !loading) setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled || loading) return;
    void handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={disabled || loading ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => !disabled && !loading && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition",
          disabled || loading ? "cursor-not-allowed opacity-60" : "hover:border-emerald-400 hover:bg-emerald-50/50",
          dragging ? "border-emerald-500 bg-emerald-50" : "border-stone-300 bg-stone-50",
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-emerald-700" />
            <p className="mt-3 text-sm font-medium text-stone-700">
              Enviando {uploadCount > 1 ? `${uploadCount} imagens` : "imagem"}...
            </p>
          </>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              {dragging ? (
                <Upload className="h-6 w-6 text-emerald-700" />
              ) : (
                <ImagePlus className="h-6 w-6 text-emerald-700" />
              )}
            </div>
            <p className="mt-3 text-sm font-medium text-stone-700">
              {dragging ? "Solte as imagens aqui" : "Arraste imagens ou clique para selecionar"}
            </p>
            <p className="mt-1 text-xs text-stone-500">PNG, JPG ou WEBP · várias de uma vez</p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={disabled || loading}
          onChange={(e) => {
            if (e.target.files?.length) void handleFiles(e.target.files);
          }}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
