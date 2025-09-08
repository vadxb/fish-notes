import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateToCountries() {
  console.log("🔄 Starting migration to countries...");

  try {
    // First, create Belarus country
    const belarus = await prisma.country.upsert({
      where: { code: "BY" },
      update: {},
      create: {
        name: "Belarus",
        code: "BY",
      },
    });

    console.log(`✅ Created/updated Belarus country: ${belarus.id}`);

    // Get all existing data with country strings
    const baits = await prisma.bait.findMany();
    const fishes = await prisma.fish.findMany();
    const waterBodies = await prisma.waterBody.findMany();

    console.log(
      `📊 Found ${baits.length} baits, ${fishes.length} fishes, ${waterBodies.length} water bodies`
    );

    // Update baits to use countryId
    for (const bait of baits) {
      await prisma.bait.update({
        where: { id: bait.id },
        data: { countryId: belarus.id },
      });
    }
    console.log("✅ Updated baits with countryId");

    // Update fishes to use countryId
    for (const fish of fishes) {
      await prisma.fish.update({
        where: { id: fish.id },
        data: { countryId: belarus.id },
      });
    }
    console.log("✅ Updated fishes with countryId");

    // Update water bodies to use countryId
    for (const waterBody of waterBodies) {
      await prisma.waterBody.update({
        where: { id: waterBody.id },
        data: { countryId: belarus.id },
      });
    }
    console.log("✅ Updated water bodies with countryId");

    console.log("🎉 Migration completed successfully!");
  } catch (error) {
    console.error("❌ Error during migration:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  migrateToCountries()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { migrateToCountries };
