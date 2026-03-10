ALTER TABLE "Product"
ALTER COLUMN "stock" DROP NOT NULL;

CREATE TABLE "ProductOptionStock" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "optionValue" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductOptionStock_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductOptionStock_productId_optionValue_key" ON "ProductOptionStock"("productId", "optionValue");

ALTER TABLE "ProductOptionStock"
ADD CONSTRAINT "ProductOptionStock_productId_fkey"
FOREIGN KEY ("productId")
REFERENCES "Product"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
