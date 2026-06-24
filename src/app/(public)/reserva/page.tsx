import { Suspense } from "react";
import type { Metadata } from "next";
import { ReservationLookup } from "@/components/booking/reservation-lookup";

export const metadata: Metadata = {
  title: "Consultar reserva",
  description: "Verifique o status da sua reserva usando o código de confirmação",
};

export default function ReservationLookupPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-bold">Consultar reserva</h1>
        <p className="mt-2 text-stone-600">
          Digite o código da sua reserva para acompanhar o status
        </p>
      </div>

      <div className="mt-10">
        <Suspense fallback={<div className="text-center text-stone-500">Carregando...</div>}>
          <ReservationLookup />
        </Suspense>
      </div>
    </div>
  );
}
