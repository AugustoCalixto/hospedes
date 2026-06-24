"use client";

import { useEffect, useState } from "react";
import { addMonths, format } from "date-fns";
import { AvailabilityCalendar } from "./availability-calendar";
import { ReservationForm } from "./reservation-form";

type Props = {
  accommodationId: string;
  maxGuests: number;
};

export function BookingSection({ accommodationId, maxGuests }: Props) {
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    const from = format(new Date(), "yyyy-MM-dd");
    const to = format(addMonths(new Date(), 12), "yyyy-MM-dd");

    fetch(
      `/api/disponibilidade?accommodationId=${accommodationId}&from=${from}&to=${to}`,
    )
      .then((res) => res.json())
      .then((data) => setUnavailableDates(data.unavailableDates || []))
      .catch(() => setUnavailableDates([]));
  }, [accommodationId]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <AvailabilityCalendar
        unavailableDates={unavailableDates}
        onRangeSelect={(inDate, outDate) => {
          setCheckIn(inDate);
          setCheckOut(outDate);
        }}
      />
      <ReservationForm
        accommodationId={accommodationId}
        maxGuests={maxGuests}
        checkIn={checkIn}
        checkOut={checkOut}
      />
    </div>
  );
}
