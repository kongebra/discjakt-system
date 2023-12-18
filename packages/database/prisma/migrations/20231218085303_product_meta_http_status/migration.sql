-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "meta_http_status" INTEGER;

-- CreateIndex
CREATE INDEX "Retailer_updated_at_idx" ON "Retailer"("updated_at");
