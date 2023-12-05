/*
  Warnings:

  - You are about to drop the column `product_id` on the `ShoppingCart` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ShoppingCart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShoppingCart" DROP CONSTRAINT "ShoppingCart_product_id_fkey";

-- AlterTable
ALTER TABLE "ShoppingCart" DROP COLUMN "product_id",
DROP COLUMN "quantity",
ADD COLUMN     "productProduct_id" INTEGER;

-- CreateTable
CREATE TABLE "ShoppingCartItem" (
    "cart_item_id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShoppingCartItem_pkey" PRIMARY KEY ("cart_item_id")
);

-- AddForeignKey
ALTER TABLE "ShoppingCartItem" ADD CONSTRAINT "ShoppingCartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "ShoppingCart"("cart_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCartItem" ADD CONSTRAINT "ShoppingCartItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_productProduct_id_fkey" FOREIGN KEY ("productProduct_id") REFERENCES "Product"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;
