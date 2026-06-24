"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { formatCurrencyInput, parseCurrencyBR } from "@/lib/formatters";

type Props = {
  name: string;
  defaultValue?: number;
  required?: boolean;
  className?: string;
};

export function CurrencyInput({ name, defaultValue = 0, required, className }: Props) {
  const [display, setDisplay] = useState(() =>
    defaultValue > 0 ? formatCurrencyInput(defaultValue) : "",
  );
  const [numeric, setNumeric] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const parsed = parseCurrencyBR(raw);
    setNumeric(parsed);
    setDisplay(formatCurrencyInput(parsed));
  }

  function handleFocus() {
    inputRef.current?.select();
  }

  return (
    <>
      <div className={cn("relative", className)}>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">
          R$
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="0,00"
          required={required}
          className="flex h-10 w-full rounded-lg border border-stone-300 bg-white pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        />
      </div>
      <input type="hidden" name={name} value={numeric > 0 ? numeric : ""} />
    </>
  );
}
