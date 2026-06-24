import { describe, it, expect } from "vitest";
import {
  generateReservationCode,
  normalizeReservationCode,
  isValidReservationCodeFormat,
} from "@/lib/reservation-code";

describe("reservation-code", () => {
  it("generates code in HSP-XXXXXX format", () => {
    const code = generateReservationCode();
    expect(code).toMatch(/^HSP-[A-Z2-9]{6}$/);
  });

  it("normalizes input", () => {
    expect(normalizeReservationCode(" hsp-abc123 ")).toBe("HSP-ABC123");
  });

  it("validates format", () => {
    expect(isValidReservationCodeFormat("HSP-ABC234")).toBe(true);
    expect(isValidReservationCodeFormat("INVALID")).toBe(false);
  });
});
