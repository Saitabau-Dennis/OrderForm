-- Add fulfillment type support and shop pickup settings.
CREATE TYPE "FulfillmentMethod" AS ENUM ('DELIVERY', 'SHOP_PICKUP');

ALTER TABLE "Store"
  ADD COLUMN "enableDelivery" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "enableShopPickup" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "shopPickupInstructions" TEXT;

ALTER TABLE "Order"
  ADD COLUMN "fulfillmentMethod" "FulfillmentMethod" NOT NULL DEFAULT 'DELIVERY',
  ADD COLUMN "deliveryZoneId" TEXT,
  ALTER COLUMN "deliveryAddress" DROP NOT NULL;
