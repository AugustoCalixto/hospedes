const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReservationCode(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return `HSP-${suffix}`;
}

export function normalizeReservationCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s/g, "");
}

export function isValidReservationCodeFormat(code: string): boolean {
  return /^HSP-[A-Z2-9]{6}$/.test(code);
}
