import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function vercelBuild() {
  try {
    console.log("Running Vercel build seed...");

    // Check if data already exists
    const belarus = await prisma.country.findUnique({
      where: { code: "BY" },
    });

    if (belarus) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Import and run fresh seed
    const { seedFresh } = await import("./seedFresh");
    await seedFresh();

    console.log("Vercel build seed completed successfully!");
  } catch (error) {
    console.error("Error during Vercel build seed:", error);
    // Don't throw error to avoid breaking the build
    console.log("Continuing with build...");
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  vercelBuild();
}

export { vercelBuild };
