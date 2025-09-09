import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedCountries() {
  console.log("Seeding countries...");

  try {
    // Check if Belarus already exists
    let belarus = await prisma.country.findUnique({
      where: { code: "BY" },
    });

    if (!belarus) {
      // Create Belarus if it doesn't exist
      belarus = await prisma.country.create({
        data: {
          name: "Belarus",
          code: "BY",
        },
      });
      console.log(`Created country: ${belarus.name} (${belarus.code})`);
    } else {
      console.log(`Country already exists: ${belarus.name} (${belarus.code})`);
    }

    console.log("Countries seeded successfully!");
  } catch (error) {
    console.error("Error seeding countries:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedCountries()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
