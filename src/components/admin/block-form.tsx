"use client";

import { useTransition } from "react";
import { createAvailabilityBlock } from "@/lib/admin-actions";
import { CreatableSelect, type SelectOption } from "@/components/ui/creatable-select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  accommodations: { id: string; name: string }[];
};

export function BlockForm({ accommodations }: Props) {
  const [pending, startTransition] = useTransition();
  const options: SelectOption[] = accommodations.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createAvailabilityBlock(formData);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-stone-200 bg-white p-6"
    >
      <h2 className="text-lg font-semibold">Novo bloqueio</h2>
      <p className="mt-1 text-sm text-stone-500">
        Bloqueie um período para manutenção ou indisponibilidade
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <CreatableSelect
          name="accommodationId"
          label="Acomodação"
          options={options}
          placeholder="Selecione a acomodação"
          required
          allowCreate={false}
        />

        <div className="md:col-span-2">
          <DateRangePicker
            startName="startDate"
            endName="endDate"
            label="Período do bloqueio"
            required
            numberOfMonths={2}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="reason">Motivo (opcional)</Label>
          <Input
            id="reason"
            name="reason"
            placeholder="Manutenção, reforma, uso pessoal..."
            className="mt-1.5"
          />
        </div>
      </div>

      <Button type="submit" className="mt-6" disabled={pending}>
        {pending ? "Bloqueando..." : "Bloquear período"}
      </Button>
    </form>
  );
}
