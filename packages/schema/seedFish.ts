import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const belarusFishSpecies = [
  {
    commonName: "Northern Pike",
    scientificName: "Esox lucius",
    russianName: "Щука",
    imageUrl: "/fishes/pike.png",
  },
  {
    commonName: "European Perch",
    scientificName: "Perca fluviatilis",
    russianName: "Окунь речной",
    imageUrl: "/fishes/perch.png",
  },
  {
    commonName: "Roach",
    scientificName: "Rutilus rutilus",
    russianName: "Плотва",
    imageUrl: "/fishes/roach.png",
  },
  {
    commonName: "Common Carp",
    scientificName: "Cyprinus carpio",
    russianName: "Сазан",
    imageUrl: "/fishes/carp.png",
  },
  {
    commonName: "Crucian Carp",
    scientificName: "Carassius carassius",
    russianName: "Карась",
    imageUrl: "/fishes/crucian.png",
  },
  {
    commonName: "European Eel",
    scientificName: "Anguilla anguilla",
    russianName: "Речной угорь",
    imageUrl: "/fishes/eel.png",
  },
  {
    commonName: "Zander (Pike-Perch)",
    scientificName: "Sander lucioperca",
    russianName: "Судак",
    imageUrl: "/fishes/zander.png",
  },
  {
    commonName: "Gudgeon",
    scientificName: "Gobio gobio",
    russianName: "Пескарь",
    imageUrl: "/fishes/gudgeon.png",
  },
  {
    commonName: "Brown Trout",
    scientificName: "Salmo trutta",
    russianName: "Форель",
    imageUrl: "/fishes/trout.png",
  },
  {
    commonName: "Asp",
    scientificName: "Leuciscus aspius",
    russianName: "Жерех",
    imageUrl: "/fishes/asp.png",
  },
  {
    commonName: "Bream",
    scientificName: "Abramis brama",
    russianName: "Лещ",
    imageUrl: "/fishes/bream.png",
  },
];

export async function seedFish() {
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

    const formatted = belarusFishSpecies.map((fish: any) => ({
      commonName: fish.commonName,
      scientificName: fish.scientificName,
      countryId: belarus.id,
      habitat: fish.Habitat || null,
      imageUrl: fish.imageUrl || null,
    }));

    await prisma.fish.createMany({
      data: formatted,
    });
  } catch (error) {
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedFish()
    .catch((e) => {
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
