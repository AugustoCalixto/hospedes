"use client";

import { useState, useRef } from "react";
import { X, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type Props = {
  name: string;
  label: string;
  suggestions: string[];
  defaultValue?: string[];
  placeholder?: string;
};

export function TagCombobox({
  name,
  label,
  suggestions,
  defaultValue = [],
  placeholder = "Buscar comodidade...",
}: Props) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const available = suggestions.filter(
    (s) =>
      !tags.includes(s) &&
      s.toLowerCase().includes(search.toLowerCase()),
  );
  const canCreate =
    search.trim().length > 0 &&
    !tags.some((t) => t.toLowerCase() === search.trim().toLowerCase()) &&
    !suggestions.some((s) => s.toLowerCase() === search.trim().toLowerCase());

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags((prev) => [...prev, trimmed]);
    setSearch("");
    setOpen(false);
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 hover:bg-emerald-200"
                aria-label={`Remover ${tag}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full justify-start font-normal text-stone-500"
            onClick={() => setTimeout(() => inputRef.current?.focus(), 0)}
          >
            {placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (canCreate) addTag(search.trim());
                else if (available[0]) addTag(available[0]);
              }
            }}
            className="mb-2"
          />
          <div className="max-h-40 overflow-y-auto">
            {available.slice(0, 8).map((item) => (
              <button
                key={item}
                type="button"
                className="flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-stone-100"
                onClick={() => addTag(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {canCreate && (
            <button
              type="button"
              onClick={() => addTag(search.trim())}
              className="mt-2 flex w-full items-center gap-2 rounded-md border border-dashed border-emerald-300 px-2 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4" />
              Adicionar &ldquo;{search.trim()}&rdquo;
            </button>
          )}
        </PopoverContent>
      </Popover>

      <input type="hidden" name={name} value={JSON.stringify(tags)} />
    </div>
  );
}
