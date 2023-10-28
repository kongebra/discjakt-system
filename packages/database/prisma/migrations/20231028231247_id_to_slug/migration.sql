/*
  Warnings:

  - You are about to drop the column `manufacturer_id` on the `Disc` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer_id` on the `Plastic` table. All the data in the column will be lost.
  - You are about to drop the column `disc_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `plastic_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `retailer_id` on the `Product` table. All the data in the column will be lost.
  - Added the required column `manufacturer_slug` to the `Disc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturer_slug` to the `Plastic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `retailer_slug` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Disc" DROP CONSTRAINT "Disc_manufacturer_id_fkey";

-- DropForeignKey
ALTER TABLE "Plastic" DROP CONSTRAINT "Plastic_manufacturer_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_disc_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_plastic_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_retailer_id_fkey";

-- AlterTable
ALTER TABLE "Disc" DROP COLUMN "manufacturer_id",
ADD COLUMN     "manufacturer_slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Plastic" DROP COLUMN "manufacturer_id",
ADD COLUMN     "manufacturer_slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "disc_id",
DROP COLUMN "plastic_id",
DROP COLUMN "retailer_id",
ADD COLUMN     "disc_slug" TEXT,
ADD COLUMN     "lastmod" TEXT,
ADD COLUMN     "plastic_slug" TEXT,
ADD COLUMN     "priority" TEXT,
ADD COLUMN     "retailer_slug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Disc" ADD CONSTRAINT "Disc_manufacturer_slug_fkey" FOREIGN KEY ("manufacturer_slug") REFERENCES "Manufacturer"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plastic" ADD CONSTRAINT "Plastic_manufacturer_slug_fkey" FOREIGN KEY ("manufacturer_slug") REFERENCES "Manufacturer"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_retailer_slug_fkey" FOREIGN KEY ("retailer_slug") REFERENCES "Retailer"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_disc_slug_fkey" FOREIGN KEY ("disc_slug") REFERENCES "Disc"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_plastic_slug_fkey" FOREIGN KEY ("plastic_slug") REFERENCES "Plastic"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
