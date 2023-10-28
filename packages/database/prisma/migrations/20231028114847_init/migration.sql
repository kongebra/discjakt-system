/*
  Warnings:

  - You are about to drop the column `manufacturerId` on the `Disc` table. All the data in the column will be lost.
  - Added the required column `manufacturer_id` to the `Disc` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Disc" DROP CONSTRAINT "Disc_manufacturerId_fkey";

-- AlterTable
ALTER TABLE "Disc" DROP COLUMN "manufacturerId",
ADD COLUMN     "manufacturer_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Plastic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "manufacturer_id" TEXT NOT NULL,

    CONSTRAINT "Plastic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plastic_slug_key" ON "Plastic"("slug");

-- AddForeignKey
ALTER TABLE "Disc" ADD CONSTRAINT "Disc_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plastic" ADD CONSTRAINT "Plastic_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
