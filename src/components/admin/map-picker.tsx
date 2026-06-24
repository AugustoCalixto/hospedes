"use client";

import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const MapPickerInner = dynamic(
  () => import("./map-picker-inner").then((m) => m.MapPickerInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-500">
        Carregando mapa...
      </div>
    ),
  },
);

type Props = {
  defaultLat?: number | null;
  defaultLng?: number | null;
  lat: number | null;
  lng: number | null;
  onLatLngChange: (lat: number | null, lng: number | null) => void;
};

export function MapPicker({ defaultLat, defaultLng, lat, lng, onLatLngChange }: Props) {
  return (
    <div className="space-y-3">
      <Label>Localização no mapa</Label>
      <MapPickerInner
        lat={lat ?? defaultLat ?? null}
        lng={lng ?? defaultLng ?? null}
        onChange={(newLat, newLng) => onLatLngChange(newLat, newLng)}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lat">Latitude</Label>
          <Input
            id="lat"
            type="number"
            step="any"
            value={lat ?? ""}
            onChange={(e) =>
              onLatLngChange(e.target.value ? parseFloat(e.target.value) : null, lng)
            }
          />
        </div>
        <div>
          <Label htmlFor="lng">Longitude</Label>
          <Input
            id="lng"
            type="number"
            step="any"
            value={lng ?? ""}
            onChange={(e) =>
              onLatLngChange(lat, e.target.value ? parseFloat(e.target.value) : null)
            }
          />
        </div>
      </div>
    </div>
  );
}
