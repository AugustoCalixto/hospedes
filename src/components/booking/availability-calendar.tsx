"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isBefore,
  isSameDay,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  unavailableDates: string[];
  onRangeSelect?: (checkIn: string, checkOut: string) => void;
};

export function AvailabilityCalendar({ unavailableDates, onRangeSelect }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const unavailable = new Set(unavailableDates);
  const today = startOfDay(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const firstDayOfWeek = startOfMonth(currentMonth).getDay();

  function isUnavailable(date: Date) {
    return unavailable.has(format(date, "yyyy-MM-dd"));
  }

  function handleDayClick(date: Date) {
    if (isBefore(date, today) || isUnavailable(date)) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    if (isBefore(date, checkIn)) {
      setCheckIn(date);
      return;
    }

    const range = eachDayOfInterval({ start: checkIn, end: date });
    const hasBlocked = range.some((d) => isUnavailable(d));
    if (hasBlocked) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    setCheckOut(date);
    onRangeSelect?.(
      format(checkIn, "yyyy-MM-dd"),
      format(date, "yyyy-MM-dd"),
    );
  }

  function isInRange(date: Date) {
    if (!checkIn) return false;
    if (!checkOut) return isSameDay(date, checkIn);
    return date >= checkIn && date <= checkOut;
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-stone-500">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const disabled = isBefore(day, today) || isUnavailable(day);
          const selected = isInRange(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(day)}
              className={cn(
                "aspect-square rounded-md text-sm transition",
                disabled && "cursor-not-allowed text-stone-300 line-through",
                !disabled && "hover:bg-emerald-50",
                selected && "bg-emerald-700 text-white hover:bg-emerald-700",
                isUnavailable(day) && "bg-stone-100",
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {checkIn && (
        <p className="mt-4 text-sm text-stone-600">
          {checkOut
            ? `Período: ${format(checkIn, "dd/MM/yyyy")} — ${format(checkOut, "dd/MM/yyyy")}`
            : `Check-in: ${format(checkIn, "dd/MM/yyyy")} — selecione o check-out`}
        </p>
      )}
    </div>
  );
}
