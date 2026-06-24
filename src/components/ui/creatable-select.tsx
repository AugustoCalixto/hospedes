"use client";

import { useState, useRef, useMemo } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label: string;
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  onCreateOption?: (label: string) => Promise<SelectOption | null>;
  onOptionsChange?: (options: SelectOption[]) => void;
  allowCreate?: boolean;
};

export function CreatableSelect({
  name,
  label,
  options: initialOptions,
  defaultValue,
  placeholder = "Selecione...",
  required,
  onCreateOption,
  onOptionsChange,
  allowCreate = !!onCreateOption,
}: Props) {
  const [open, setOpen] = useState(false);
  const [extraOptions, setExtraOptions] = useState<SelectOption[]>([]);
  const options = useMemo(() => {
    const merged = [...initialOptions];
    for (const extra of extraOptions) {
      if (!merged.some((o) => o.value === extra.value)) merged.push(extra);
    }
    return merged;
  }, [initialOptions, extraOptions]);
  const [selected, setSelected] = useState(defaultValue || "");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = options.find((o) => o.value === selected)?.label;
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );
  const canCreate =
    allowCreate &&
    search.trim().length > 0 &&
    !options.some((o) => o.label.toLowerCase() === search.trim().toLowerCase());

  async function handleCreate() {
    const label = search.trim();
    if (!label) return;

    setCreating(true);
    try {
      let newOption: SelectOption;
      if (onCreateOption) {
        const created = await onCreateOption(label);
        if (!created) return;
        newOption = created;
      } else {
        newOption = {
          value: label,
          label,
        };
      }
      const updated = [...options, newOption];
      setExtraOptions((prev) =>
        prev.some((o) => o.value === newOption.value) ? prev : [...prev, newOption],
      );
      onOptionsChange?.(updated);
      setSelected(newOption.value);
      setSearch("");
      setOpen(false);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-10 w-full justify-between font-normal"
          >
            <span className={cn(!selectedLabel && "text-stone-400")}>
              {selectedLabel || placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
          <Input
            ref={inputRef}
            placeholder="Buscar ou criar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
          <div className="max-h-48 overflow-y-auto">
            {filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-stone-100",
                  selected === option.value && "bg-emerald-50 text-emerald-800",
                )}
                onClick={() => {
                  setSelected(option.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    selected === option.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {option.label}
              </button>
            ))}
            {filtered.length === 0 && !canCreate && (
              <p className="px-2 py-4 text-center text-sm text-stone-400">
                Nenhuma opção encontrada
              </p>
            )}
          </div>
          {canCreate && (
            <button
              type="button"
              disabled={creating}
              onClick={handleCreate}
              className="mt-2 flex w-full items-center gap-2 rounded-md border border-dashed border-emerald-300 px-2 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4" />
              Criar &ldquo;{search.trim()}&rdquo;
            </button>
          )}
        </PopoverContent>
      </Popover>
      <input type="hidden" name={name} value={selected} required={required} />
    </div>
  );
}
