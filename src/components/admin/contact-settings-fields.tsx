"use client";

import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";

type Props = {
  contactPhone?: string | null;
  contactWhatsapp?: string | null;
};

export function ContactSettingsFields({ contactPhone, contactWhatsapp }: Props) {
  return (
    <>
      <div>
        <Label htmlFor="contactPhone">Telefone</Label>
        <PhoneInput
          id="contactPhone"
          name="contactPhone"
          defaultValue={contactPhone || ""}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="contactWhatsapp">WhatsApp (com DDI)</Label>
        <PhoneInput
          id="contactWhatsapp"
          name="contactWhatsapp"
          defaultValue={contactWhatsapp || ""}
          maxDigits={13}
          className="mt-1.5"
        />
      </div>
    </>
  );
}
