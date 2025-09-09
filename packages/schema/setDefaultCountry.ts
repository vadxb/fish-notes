import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function setDefaultCountry() {
  console.log("Setting default country to Belarus...");

  try {
    // Find Belarus
    const belarus = await prisma.country.findUnique({
      where: { code: "BY" },
    });

    if (!belarus) {
      console.log("Belarus not found. Please run seedCountries first.");
      return;
    }

    // Update all users without a country to Belarus
    const updatedUsers = await prisma.user.updateMany({
      where: { countryId: null },
      data: { countryId: belarus.id },
    });

    // Update all fishes to Belarus (since countryId is required)
    const updatedFishes = await prisma.fish.updateMany({
      data: { countryId: belarus.id },
    });

    // Update all baits to Belarus (since countryId is required)
    const updatedBaits = await prisma.bait.updateMany({
      data: { countryId: belarus.id },
    });

    // Update all water bodies to Belarus (since countryId is required)
    const updatedWaterBodies = await prisma.waterBody.updateMany({
      data: { countryId: belarus.id },
    });

    console.log(`Updated ${updatedUsers.count} users to Belarus`);
    console.log(`Updated ${updatedFishes.count} fishes to Belarus`);
    console.log(`Updated ${updatedBaits.count} baits to Belarus`);
    console.log(`Updated ${updatedWaterBodies.count} water bodies to Belarus`);
    console.log("Default country set successfully!");
  } catch (error) {
    console.error("Error setting default country:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  setDefaultCountry()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
