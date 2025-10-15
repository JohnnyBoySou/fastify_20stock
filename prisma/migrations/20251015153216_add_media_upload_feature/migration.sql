-- CreateTable
CREATE TABLE "public"."media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_media" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."supplier_media" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,

    CONSTRAINT "supplier_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_media" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,

    CONSTRAINT "user_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."store_media" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,

    CONSTRAINT "store_media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."product_media" ADD CONSTRAINT "product_media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_media" ADD CONSTRAINT "product_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."supplier_media" ADD CONSTRAINT "supplier_media_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."supplier_media" ADD CONSTRAINT "supplier_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_media" ADD CONSTRAINT "user_media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_media" ADD CONSTRAINT "user_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."store_media" ADD CONSTRAINT "store_media_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."store_media" ADD CONSTRAINT "store_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
