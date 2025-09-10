import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupAllTestData() {
  try {
    console.log("Starting complete cleanup of ALL database data...");

    // Delete in reverse order to respect foreign key constraints
    console.log("Deleting all comments...");
    await prisma.catchComment.deleteMany({});

    console.log("Deleting all likes...");
    await prisma.catchLike.deleteMany({});

    console.log("Deleting all catches...");
    await prisma.catch.deleteMany({});

    console.log("Deleting all events...");
    await prisma.fishEvent.deleteMany({});

    console.log("Deleting all spots...");
    await prisma.spot.deleteMany({});

    console.log("Deleting all users...");
    await prisma.user.deleteMany({});

    console.log("Deleting all water bodies...");
    await prisma.waterBody.deleteMany({});

    console.log("Deleting all baits...");
    await prisma.bait.deleteMany({});

    console.log("Deleting all fish species...");
    await prisma.fish.deleteMany({});

    console.log("Deleting all countries...");
    await prisma.country.deleteMany({});

    console.log("Complete database cleanup completed successfully!");
    console.log(
      "Database is now completely empty and ready for fresh seeding."
    );
  } catch (error) {
    console.error("Error cleaning up database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupAllTestData();
