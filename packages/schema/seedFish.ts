import { PrismaClient } from "@prisma/client";
//import { fetchFishByCountry } from "./previewFish";

const prisma = new PrismaClient();
const COUNTRY = "Belarus";

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

async function seedFish() {
  const fishList = belarusFishSpecies; //await fetchFishByCountry(COUNTRY);

  const formatted = fishList.map((fish: any) => ({
    commonName: fish.commonName,
    scientificName: fish.scientificName,
    country: COUNTRY,
    habitat: fish.Habitat || null,
    imageUrl: fish.imageUrl || null,
  }));

  await prisma.Fish.createMany({
    data: formatted,
  });

  console.log(`Seeded ${formatted.length} fish for ${COUNTRY}`);
}

seedFish()
  .catch((e) => console.error("Error seeding fish:", e))
  .finally(() => prisma.$disconnect());
