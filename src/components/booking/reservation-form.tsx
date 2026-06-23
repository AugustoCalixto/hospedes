"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
        <p className="mt-2 text-sm text-emerald-700">
          Entraremos em contato em breve para confirmar sua reserva.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-stone-200 bg-white p-6">
      <h3 className="text-lg font-semibold">Solicitar reserva</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="checkIn">Check-in</Label>
          <Input
            id="checkIn"
            name="checkIn"
            type="date"
            required
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="checkOut">Check-out</Label>
          <Input
            id="checkOut"
            name="checkOut"
            type="date"
            required
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="guestName">Nome completo</Label>
        <Input id="guestName" name="guestName" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="guestPhone">Telefone</Label>
          <Input id="guestPhone" name="guestPhone" required />
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
