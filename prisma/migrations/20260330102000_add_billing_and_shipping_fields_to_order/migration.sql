ALTER TABLE "Order"
  ADD COLUMN "shipToDifferentAddress" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "billingAddressLine1" TEXT,
  ADD COLUMN "billingAddressLine2" TEXT,
  ADD COLUMN "billingZoneId" TEXT,
  ADD COLUMN "shippingAddressLine1" TEXT,
  ADD COLUMN "shippingAddressLine2" TEXT,
  ADD COLUMN "shippingZoneId" TEXT;
