/** Formata número para exibição em Real (R$ 1.234,56) */
export function formatCurrencyInput(value: number): string {
  if (!Number.isFinite(value) || value === 0) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Converte string formatada em BRL para número */
export function parseCurrencyBR(value: string): number {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}

/** Aplica máscara de telefone BR: (00) 00000-0000 ou com DDI */
export function formatPhoneBR(value: string, maxDigits = 11): string {
  const digits = value.replace(/\D/g, "").slice(0, maxDigits);
  if (digits.length === 0) return "";
  if (maxDigits > 11 && digits.length > 11) {
    const ddi = digits.slice(0, digits.length - 11);
    const local = digits.slice(-11);
    return `+${ddi} ${formatPhoneBR(local, 11)}`.trim();
  }
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Remove máscara do telefone, mantendo apenas dígitos */
export function parsePhoneBR(value: string): string {
  return value.replace(/\D/g, "");
}

export const DEFAULT_AMENITIES = [
  "Wi-Fi",
  "Lareira",
  "Churrasqueira",
  "Estacionamento",
  "Cozinha completa",
  "Ar-condicionado",
  "Aquecimento",
  "Hidromassagem",
  "Smart TV",
  "Café da manhã",
  "Piscina",
  "Jardim",
  "Deck privativo",
  "Frigobar",
  "Pet friendly",
];

export const DEFAULT_ACCOMMODATION_TYPES = [
  { value: "CHALE", label: "Chalé" },
  { value: "CASA", label: "Casa" },
  { value: "QUARTO", label: "Quarto" },
];
