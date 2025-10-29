-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "polarCustomerId" TEXT,
ADD COLUMN     "polarSubscriptionId" TEXT;

-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "polarInvoiceId" TEXT;

-- AlterTable
ALTER TABLE "public"."Plan" ADD COLUMN     "polarProductId" TEXT;
