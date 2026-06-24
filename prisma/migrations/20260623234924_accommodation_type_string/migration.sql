-- Convert enum column to text preserving existing values
ALTER TABLE "Accommodation" ALTER COLUMN "type" TYPE TEXT USING "type"::TEXT;

-- DropEnum
DROP TYPE "AccommodationType";
