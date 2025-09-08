-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- AddColumn
ALTER TABLE "User" ADD COLUMN "countryId" TEXT;

-- AddColumn
ALTER TABLE "Bait" ADD COLUMN "countryId" TEXT;

-- AddColumn
ALTER TABLE "Fish" ADD COLUMN "countryId" TEXT;

-- AddColumn
ALTER TABLE "WaterBody" ADD COLUMN "countryId" TEXT;

-- CreateIndex
CREATE INDEX "User_countryId_idx" ON "User"("countryId");

-- CreateIndex
CREATE INDEX "Bait_countryId_idx" ON "Bait"("countryId");

-- CreateIndex
CREATE INDEX "Fish_countryId_idx" ON "Fish"("countryId");

-- CreateIndex
CREATE INDEX "WaterBody_countryId_idx" ON "WaterBody"("countryId");

-- AddForeignKey
CREATE INDEX "User_countryId_fkey" ON "User"("countryId");

-- AddForeignKey
CREATE INDEX "Bait_countryId_fkey" ON "Bait"("countryId");

-- AddForeignKey
CREATE INDEX "Fish_countryId_fkey" ON "Fish"("countryId");

-- AddForeignKey
CREATE INDEX "WaterBody_countryId_fkey" ON "WaterBody"("countryId");

-- DropColumn
ALTER TABLE "Bait" DROP COLUMN "country";

-- DropColumn
ALTER TABLE "Fish" DROP COLUMN "country";

-- DropColumn
ALTER TABLE "WaterBody" DROP COLUMN "country";
