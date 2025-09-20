-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_productId_categoryId_key" ON "ProductCategory"("productId", "categoryId");

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing data from Product.categoryId to ProductCategory
INSERT INTO "ProductCategory" ("id", "productId", "categoryId", "createdAt")
SELECT 
    gen_random_uuid()::text as "id",
    "id" as "productId",
    "categoryId" as "categoryId",
    NOW() as "createdAt"
FROM "Product" 
WHERE "categoryId" IS NOT NULL;

-- Remove the old categoryId column from Product table
ALTER TABLE "Product" DROP COLUMN "categoryId";
