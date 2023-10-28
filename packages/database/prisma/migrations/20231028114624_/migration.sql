-- CreateEnum
CREATE TYPE "DiscType" AS ENUM ('PUTTER', 'MIDRANGE', 'FAIRWAY', 'DISTANCE');

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disc" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "type" "DiscType" NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "glide" DOUBLE PRECISION NOT NULL,
    "turn" DOUBLE PRECISION NOT NULL,
    "fade" DOUBLE PRECISION NOT NULL,
    "manufacturerId" TEXT,

    CONSTRAINT "Disc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_name_key" ON "Manufacturer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_slug_key" ON "Manufacturer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Disc_name_key" ON "Disc"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Disc_slug_key" ON "Disc"("slug");

-- AddForeignKey
ALTER TABLE "Disc" ADD CONSTRAINT "Disc_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
