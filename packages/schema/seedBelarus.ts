import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedBelarus() {
  try {
    console.log("Seeding Belarus data...");

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

    console.log("\nBelarus data seeded successfully!");
    console.log("\nDatabase now contains:");
    console.log("   - Belarus as the only country");
    console.log("   - Fish species native to Belarus");
    console.log("   - Baits commonly used in Belarus");
    console.log("   - Water bodies in Belarus");
    console.log("   - All existing users assigned to Belarus");
  } catch (error) {
    console.error("Error during seed process:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedBelarus();
