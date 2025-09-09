/*
  Warnings:

  - Made the column `countryId` on table `Bait` required. This step will fail if there are existing NULL values in that column.
  - Made the column `countryId` on table `Fish` required. This step will fail if there are existing NULL values in that column.
  - Made the column `countryId` on table `WaterBody` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bait" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commonName" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bait_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bait" ("commonName", "countryId", "createdAt", "id", "imageUrl") SELECT "commonName", "countryId", "createdAt", "id", "imageUrl" FROM "Bait";
DROP TABLE "Bait";
ALTER TABLE "new_Bait" RENAME TO "Bait";
CREATE TABLE "new_Fish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commonName" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "habitat" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Fish_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Fish" ("commonName", "countryId", "createdAt", "habitat", "id", "imageUrl", "scientificName") SELECT "commonName", "countryId", "createdAt", "habitat", "id", "imageUrl", "scientificName" FROM "Fish";
DROP TABLE "Fish";
ALTER TABLE "new_Fish" RENAME TO "Fish";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "avatar" TEXT,
    "subscription" TEXT NOT NULL DEFAULT 'free',
    "premiumExpiresAt" DATETIME,
    "countryId" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'night-fishing',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "User_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("avatar", "countryId", "createdAt", "email", "id", "name", "password", "premiumExpiresAt", "subscription", "updatedAt", "username") SELECT "avatar", "countryId", "createdAt", "email", "id", "name", "password", "premiumExpiresAt", "subscription", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE TABLE "new_WaterBody" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "countryId" TEXT NOT NULL,
    "region" TEXT,
    "geometry" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WaterBody_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WaterBody" ("countryId", "createdAt", "geometry", "id", "latitude", "longitude", "name", "region", "type") SELECT "countryId", "createdAt", "geometry", "id", "latitude", "longitude", "name", "region", "type" FROM "WaterBody";
DROP TABLE "WaterBody";
ALTER TABLE "new_WaterBody" RENAME TO "WaterBody";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
