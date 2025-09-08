import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function setDefaultCountry() {
  try {
    // Get Belarus country
    const belarus = await prisma.country.findFirst({
      where: { code: "BY" },
    });

    if (!belarus) {
      throw new Error(
        "Belarus country not found. Please run seedCountries first."
      );
    }

    // Update users without country to Belarus
    await prisma.user.updateMany({
      where: {
        countryId: null,
      },
      data: {
        countryId: belarus.id,
      },
    });
  } catch (error) {
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  setDefaultCountry()
    .catch((e) => {
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { setDefaultCountry };
