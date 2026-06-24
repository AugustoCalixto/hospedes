"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "react-day-picker/style.css";

type Props = {
  startName: string;
  endName: string;
  defaultStart?: string;
  defaultEnd?: string;
  label?: string;
  required?: boolean;
  numberOfMonths?: number;
  onChange?: (start: string, end: string) => void;
};

function parseDefault(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function DateRangePicker({
  startName,
  endName,
  defaultStart,
  defaultEnd,
  label,
  required,
  numberOfMonths = 2,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(() => ({
    from: parseDefault(defaultStart),
    to: parseDefault(defaultEnd),
  }));

  const startValue = range?.from ? format(range.from, "yyyy-MM-dd") : "";
  const endValue = range?.to ? format(range.to, "yyyy-MM-dd") : "";

  function handleSelect(next: DateRange | undefined) {
    setRange(next);
    if (next?.from && next?.to) {
      const start = format(next.from, "yyyy-MM-dd");
      const end = format(next.to, "yyyy-MM-dd");
      onChange?.(start, end);
      setOpen(false);
    }
  }

  const labelText =
    range?.from && range?.to
      ? `${format(range.from, "dd MMM yyyy", { locale: ptBR })} — ${format(range.to, "dd MMM yyyy", { locale: ptBR })}`
      : range?.from
        ? `${format(range.from, "dd MMM yyyy", { locale: ptBR })} — selecione o fim`
        : "Selecione check-in e check-out";

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-stone-700">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-11 w-full justify-start text-left font-normal",
              !range?.from && "text-stone-400",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-emerald-700" />
            {labelText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={numberOfMonths}
            locale={ptBR}
            disabled={{ before: new Date() }}
            classNames={{
              root: "p-3",
              month_caption: "flex justify-center py-2 font-semibold capitalize",
              nav: "flex items-center justify-between px-2",
              button_previous: "rounded-md p-1 hover:bg-stone-100",
              button_next: "rounded-md p-1 hover:bg-stone-100",
              weekdays: "flex",
              weekday: "w-9 text-center text-xs font-medium text-stone-500",
              week: "flex mt-1",
              day: "relative p-0 text-center",
              day_button:
                "h-9 w-9 rounded-md text-sm hover:bg-emerald-50 focus:bg-emerald-50",
              selected: "bg-emerald-700 text-white hover:bg-emerald-700 rounded-md",
              range_start: "bg-emerald-700 text-white rounded-l-md rounded-r-none",
              range_end: "bg-emerald-700 text-white rounded-r-md rounded-l-none",
              range_middle: "bg-emerald-100 text-emerald-900 rounded-none",
              today: "font-bold text-emerald-700",
              outside: "text-stone-300 opacity-50",
              disabled: "text-stone-300 opacity-40 cursor-not-allowed",
            }}
          />
        </PopoverContent>
      </Popover>
      <input type="hidden" name={startName} value={startValue} required={required} />
      <input type="hidden" name={endName} value={endValue} required={required} />
    </div>
  );
}
