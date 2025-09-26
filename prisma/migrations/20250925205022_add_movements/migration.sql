-- AlterTable
ALTER TABLE "public"."Movement" ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" TEXT,
ADD COLUMN     "verificationNote" TEXT,
ADD COLUMN     "verified" BOOLEAN DEFAULT false,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedBy" TEXT;
