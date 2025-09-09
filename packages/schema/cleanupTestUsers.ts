import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupTestUsers() {
  try {
    console.log("🧹 Starting cleanup of test users...");

    // Delete in reverse order to respect foreign key constraints
    console.log("🗑️ Deleting comments...");
    await prisma.catchComment.deleteMany({
      where: {
        id: {
          startsWith: "comment_",
        },
      },
    });

    console.log("🗑️ Deleting likes...");
    await prisma.catchLike.deleteMany({
      where: {
        id: {
          startsWith: "like_",
        },
      },
    });

    console.log("🗑️ Deleting catches...");
    await prisma.catch.deleteMany({
      where: {
        id: {
          startsWith: "catch_",
        },
      },
    });

    console.log("🗑️ Deleting events...");
    await prisma.fishEvent.deleteMany({
      where: {
        id: {
          startsWith: "event_",
        },
      },
    });

    console.log("🗑️ Deleting spots...");
    await prisma.spot.deleteMany({
      where: {
        id: {
          startsWith: "spot_",
        },
      },
    });

    console.log("🗑️ Deleting users...");
    await prisma.user.deleteMany({
      where: {
        id: {
          startsWith: "test_user_",
        },
      },
    });

    console.log("Test users cleanup completed successfully!");
  } catch (error) {
    console.error("Error cleaning up test users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTestUsers();
