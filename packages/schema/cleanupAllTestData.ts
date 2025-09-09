import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupAllTestData() {
  try {
    console.log("🧹 Starting complete cleanup of all test data...");

    // Delete in reverse order to respect foreign key constraints
    console.log("🗑️ Deleting all comments...");
    await prisma.catchComment.deleteMany({});

    console.log("🗑️ Deleting all likes...");
    await prisma.catchLike.deleteMany({});

    console.log("🗑️ Deleting all catches...");
    await prisma.catch.deleteMany({});

    console.log("🗑️ Deleting all events...");
    await prisma.fishEvent.deleteMany({});

    console.log("🗑️ Deleting all spots...");
    await prisma.spot.deleteMany({});

    console.log("🗑️ Deleting all users with dev emails...");
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: "dev",
        },
      },
    });

    console.log("Complete test data cleanup completed successfully!");
  } catch (error) {
    console.error("Error cleaning up test data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupAllTestData();
