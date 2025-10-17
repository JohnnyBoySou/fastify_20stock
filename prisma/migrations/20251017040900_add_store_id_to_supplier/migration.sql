/*
  Warnings:

  - A unique constraint covering the columns `[cnpj,storeId]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_storeId_fkey";

-- DropIndex
DROP INDEX "public"."Supplier_cnpj_key";

-- AlterTable
ALTER TABLE "public"."Category" ALTER COLUMN "storeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Supplier" ADD COLUMN     "storeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_cnpj_storeId_key" ON "public"."Supplier"("cnpj", "storeId");

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Supplier" ADD CONSTRAINT "Supplier_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
