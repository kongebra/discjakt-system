/*
  Warnings:

  - You are about to drop the column `meta_description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `meta_keywords` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `meta_title` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PriceHistory" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "meta_description",
DROP COLUMN "meta_keywords",
DROP COLUMN "meta_title",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "fade" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "glide" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "meta_category" TEXT,
ADD COLUMN     "speed" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "turn" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Retailer" ADD COLUMN     "current_sitemap_items" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pause_crawl" BOOLEAN NOT NULL DEFAULT false;
