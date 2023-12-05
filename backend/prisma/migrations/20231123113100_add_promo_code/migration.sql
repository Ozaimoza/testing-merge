-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "promo_code" TEXT,
ADD COLUMN     "promo_discount_amount" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "promo_code" TEXT;
