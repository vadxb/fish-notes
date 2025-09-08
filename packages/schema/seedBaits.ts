import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const belarusBait = [
  { commonName: "Worm", russianName: "Червь", imageUrl: "/baits/worm.png" },
  { commonName: "Corn", russianName: "Кукуруза", imageUrl: "/baits/corn.png" },
  { commonName: "Bread", russianName: "Хлеб", imageUrl: "/baits/bread.png" },
  {
    commonName: "Maggot",
    russianName: "Опарыш",
    imageUrl: "/baits/maggot.png",
  },
  { commonName: "Dough", russianName: "Тесто", imageUrl: "/baits/dough.png" },
  {
    commonName: "Boilies",
    russianName: "Бойлы",
    imageUrl: "/baits/boilies.png",
  },
  {
    commonName: "Bloodworm",
    russianName: "Мотыль",
    imageUrl: "/baits/bloodworm.png",
  },
  { commonName: "Peas", russianName: "Горох", imageUrl: "/baits/peas.png" },
  {
    commonName: "Barley",
    russianName: "Перловка",
    imageUrl: "/baits/barley.png",
  },
  {
    commonName: "Live fish (baitfish)",
    russianName: "Живая рыбка",
    imageUrl: "/baits/live-fish.png",
  },
  { commonName: "Leech", russianName: "Пиявка", imageUrl: "/baits/leech.png" },
  {
    commonName: "Shrimp",
    russianName: "Креветка",
    imageUrl: "/baits/shrimp.png",
  },
  { commonName: "Cheese", russianName: "Сыр", imageUrl: "/baits/cheese.png" },
  { commonName: "Liver", russianName: "Печень", imageUrl: "/baits/liver.png" },
  {
    commonName: "Artificial lure",
    russianName: "Воблер",
    imageUrl: "/baits/artificial-lure.png",
  },
];

export async function seedBaits() {
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

    const formatted = belarusBait.map((bait: any) => ({
      commonName: bait.commonName,
      countryId: belarus.id,
      imageUrl: bait.imageUrl || null,
    }));

    await prisma.bait.createMany({
      data: formatted,
      skipDuplicates: true,
    });
  } catch (error) {
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedBaits()
    .catch((e) => {
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
