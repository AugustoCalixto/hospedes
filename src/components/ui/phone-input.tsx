"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { formatPhoneBR, parsePhoneBR } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type Props = Omit<React.ComponentProps<typeof Input>, "onChange" | "value" | "defaultValue"> & {
  defaultValue?: string;
  maxDigits?: number;
  onValueChange?: (raw: string, formatted: string) => void;
};

export function PhoneInput({
  defaultValue = "",
  maxDigits = 11,
  onValueChange,
  className,
  name,
  ...props
}: Props) {
  const [value, setValue] = useState(() => formatPhoneBR(defaultValue, maxDigits));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhoneBR(e.target.value, maxDigits);
    setValue(formatted);
    onValueChange?.(parsePhoneBR(formatted), formatted);
  }

  return (
    <>
      <Input
        {...props}
        type="tel"
        inputMode="tel"
        name={name ? `${name}_display` : undefined}
        value={value}
        onChange={handleChange}
        placeholder="(00) 00000-0000"
        className={cn(className)}
      />
      {name && <input type="hidden" name={name} value={parsePhoneBR(value)} />}
    </>
  );
}
