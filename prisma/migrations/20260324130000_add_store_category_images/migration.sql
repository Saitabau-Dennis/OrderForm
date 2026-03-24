-- CreateTable
CREATE TABLE "StoreCategoryImage" (
    "id" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreCategoryImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoreCategoryImage_storeId_idx" ON "StoreCategoryImage"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreCategoryImage_storeId_categoryName_key" ON "StoreCategoryImage"("storeId", "categoryName");

-- AddForeignKey
ALTER TABLE "StoreCategoryImage" ADD CONSTRAINT "StoreCategoryImage_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
