import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedCountries() {
  try {
    // Create Belarus country first
    const belarus = await prisma.country.upsert({
      where: { code: "BY" },
      update: {},
      create: {
        name: "Belarus",
        code: "BY",
      },
    });

    // Add more countries if needed in the future
    const countries = [
      { name: "United States", code: "US" },
      { name: "United Kingdom", code: "GB" },
      { name: "Germany", code: "DE" },
      { name: "France", code: "FR" },
      { name: "Poland", code: "PL" },
      { name: "Lithuania", code: "LT" },
      { name: "Latvia", code: "LV" },
      { name: "Ukraine", code: "UA" },
      { name: "Russia", code: "RU" },
    ];

    for (const country of countries) {
      await prisma.country.upsert({
        where: { code: country.code },
        update: {},
        create: country,
      });
    }
  } catch (error) {
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedCountries()
    .catch((e) => {
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
