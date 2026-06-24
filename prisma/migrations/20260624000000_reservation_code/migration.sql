-- Add code column (nullable for backfill)
ALTER TABLE "Reservation" ADD COLUMN "code" TEXT;

-- Backfill existing reservations with unique codes
UPDATE "Reservation"
SET "code" = 'HSP-' || UPPER(SUBSTR(REPLACE(REPLACE(md5(random()::text || "id"), '0', '2'), 'o', 'P'), 1, 6))
WHERE "code" IS NULL;

-- Ensure NOT NULL and uniqueness
ALTER TABLE "Reservation" ALTER COLUMN "code" SET NOT NULL;

CREATE UNIQUE INDEX "Reservation_code_key" ON "Reservation"("code");
CREATE INDEX "Reservation_code_idx" ON "Reservation"("code");
