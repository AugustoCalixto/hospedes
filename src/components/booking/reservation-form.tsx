"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { DateRangePicker } from "@/components/ui/date-range-picker";

type Props = {
  accommodationId: string;
  maxGuests: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
};

export function ReservationForm({
  accommodationId,
  maxGuests,
  initialCheckIn = "",
  initialCheckOut = "",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState("");
  const [error, setError] = useState("");
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, accommodationId, checkIn, checkOut }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar solicitação");

      setReservationCode(data.code || "");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-emerald-800">
          Solicitação enviada!
        </h3>
        {reservationCode && (
          <div className="mt-4 rounded-lg bg-white px-4 py-3">
            <p className="text-sm text-stone-600">Seu código de reserva</p>
            <p className="mt-1 font-mono text-xl font-bold tracking-wider text-emerald-800">
              {reservationCode}
            </p>
          </div>
        )}
        <p className="mt-4 text-sm text-emerald-700">
          Guarde este código para acompanhar o status da sua reserva.
        </p>
        {reservationCode && (
          <Button asChild className="mt-4" variant="outline">
            <Link href={`/reserva?codigo=${reservationCode}`}>Consultar status</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-stone-200 bg-white p-6">
      <h3 className="text-lg font-semibold">Solicitar reserva</h3>

      <DateRangePicker
        startName="checkIn"
        endName="checkOut"
        label="Período da estadia"
        defaultStart={initialCheckIn}
        defaultEnd={initialCheckOut}
        required
        numberOfMonths={1}
        onChange={(start, end) => {
          setCheckIn(start);
          setCheckOut(end);
        }}
      />

      <div>
        <Label htmlFor="guestName">Nome completo</Label>
        <Input id="guestName" name="guestName" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="guestPhone">Telefone</Label>
          <PhoneInput id="guestPhone" name="guestPhone" required />
        </div>
        <div>
          <Label htmlFor="guestEmail">E-mail</Label>
          <Input id="guestEmail" name="guestEmail" type="email" required />
        </div>
      </div>

      <div>
        <Label htmlFor="guestCount">Quantidade de hóspedes</Label>
        <Input
          id="guestCount"
          name="guestCount"
          type="number"
          min={1}
          max={maxGuests}
          defaultValue={2}
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Observações (opcional)</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>

      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar solicitação"}
      </Button>
    </form>
  );
}
