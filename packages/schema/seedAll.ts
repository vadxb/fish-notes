import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAll() {
  try {
    console.log("Starting complete seed process...");

    // 1. Seed countries
    console.log("\n1. Seeding countries...");
    const { seedCountries } = await import("./seedCountries");
    await seedCountries();

    // 2. Seed fish species
    console.log("\n2. Seeding fish species...");
    const { seedFish } = await import("./seedFish");
    await seedFish();

    // 3. Seed baits
    console.log("\n3. Seeding baits...");
    const { seedBaits } = await import("./seedBaits");
    await seedBaits();

    // 4. Seed water bodies
    console.log("\n4. Seeding water bodies...");
    const { seedWaterBodies } = await import("./seedWaterBodies");
    await seedWaterBodies();

    // 5. Set default country for existing users
    console.log("\n5. Setting default country for existing users...");
    const { setDefaultCountry } = await import("./setDefaultCountry");
    await setDefaultCountry();

    // 6. Seed test users with all data
    console.log("\n6. Seeding test users with complete data...");
    const { seedTestUsers } = await import("./seedTestUsers");
    await seedTestUsers();

    console.log("\nComplete seed process finished successfully!");
    console.log("\nDatabase now contains:");
    console.log("   - Countries with fish, baits, and water bodies");
    console.log("   - 50 test users (dev3@email.com to dev52@email.com)");
    console.log("   - 2-3 spots per user");
    console.log("   - 2-3 events per user");
    console.log("   - 2-3 catches per user (all shared)");
    console.log("   - Likes and comments on shared catches");
    console.log("\nYou can now log in as any test user to see their data!");
  } catch (error) {
    console.error("Error during seed process:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAll();
