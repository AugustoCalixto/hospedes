"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RESERVATION_STATUS_LABELS } from "@/lib/validations";
import { formatDate } from "@/lib/utils";
import { normalizeReservationCode } from "@/lib/reservation-code";
import { Search, Calendar, MapPin, Users, Hash } from "lucide-react";

type ReservationResult = {
  code: string;
  status: string;
  guestName: string;
  guestCount: number;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  accommodation: {
    name: string;
    slug: string;
    city: string;
  };
};

const STATUS_STYLES: Record<string, string> = {
  SOLICITADA: "bg-amber-100 text-amber-800",
  PENDENTE: "bg-blue-100 text-blue-800",
  CONFIRMADA: "bg-emerald-100 text-emerald-800",
  CANCELADA: "bg-red-100 text-red-800",
  FINALIZADA: "bg-stone-100 text-stone-700",
};

export function ReservationLookup() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("codigo") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReservationResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const normalized = normalizeReservationCode(code);
    try {
      const res = await fetch(
        `/api/reservas/consulta?code=${encodeURIComponent(normalized)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reserva não encontrada");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao consultar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="code">Código da reserva</Label>
          <div className="mt-1.5 flex gap-2">
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="HSP-XXXXXX"
              className="font-mono uppercase tracking-wider"
              required
            />
            <Button type="submit" disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              {loading ? "..." : "Buscar"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            O código foi enviado por e-mail após a solicitação da reserva
          </p>
        </div>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-lg">Detalhes da reserva</CardTitle>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  STATUS_STYLES[result.status] || "bg-stone-100"
                }`}
              >
                {RESERVATION_STATUS_LABELS[result.status] || result.status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-2 text-stone-600">
              <Hash className="h-4 w-4 text-emerald-700" />
              <span className="font-mono font-semibold text-stone-900">{result.code}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <MapPin className="h-4 w-4 text-emerald-700" />
              <span>
                {result.accommodation.name} — {result.accommodation.city}
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <Calendar className="h-4 w-4 text-emerald-700" />
              <span>
                {formatDate(result.checkIn)} → {formatDate(result.checkOut)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <Users className="h-4 w-4 text-emerald-700" />
              <span>
                {result.guestName} · {result.guestCount}{" "}
                {result.guestCount === 1 ? "hóspede" : "hóspedes"}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Solicitada em {formatDate(result.createdAt)}
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/acomodacoes/${result.accommodation.slug}`}>
                Ver acomodação
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
