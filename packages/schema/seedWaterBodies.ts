import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Overpass query to get water bodies from Belarus
// Using broader bounding box for Belarus and including more water types
const overpassQuery = `
  [out:json][timeout:25];
  (
    node["natural"="water"]["name"](51.0,23.0,56.5,33.0); // Belarus bounding box
    way["natural"="water"]["name"](51.0,23.0,56.5,33.0);
    relation["natural"="water"]["name"](51.0,23.0,56.5,33.0);
    node["waterway"="river"]["name"](51.0,23.0,56.5,33.0);
    way["waterway"="river"]["name"](51.0,23.0,56.5,33.0);
    node["waterway"="stream"]["name"](51.0,23.0,56.5,33.0);
    way["waterway"="stream"]["name"](51.0,23.0,56.5,33.0);
    node["leisure"="marina"]["name"](51.0,23.0,56.5,33.0);
    way["leisure"="marina"]["name"](51.0,23.0,56.5,33.0);
  );
  out center;
`;

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name: string;
    water?: string;
    natural?: string;
    region?: string;
    [key: string]: string | undefined;
  };
}

interface OverpassResponse {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OverpassElement[];
}

async function fetchOverpassData(): Promise<OverpassResponse> {
  // Add a small delay to avoid rate limiting
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `data=${encodeURIComponent(overpassQuery)}`,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseText = await response.text();
  let data;

  try {
    data = JSON.parse(responseText);
  } catch (parseError) {
    throw new Error("Invalid JSON response from Overpass API");
  }

  return data;
}

function getCoordinates(
  element: OverpassElement
): { lat: number; lon: number } | null {
  // For nodes, use lat/lon directly
  if (element.lat && element.lon) {
    return { lat: element.lat, lon: element.lon };
  }

  // For ways and relations, use center coordinates
  if (element.center?.lat && element.center?.lon) {
    return { lat: element.center.lat, lon: element.center.lon };
  }

  return null;
}

function determineWaterType(tags: OverpassElement["tags"]): string {
  if (!tags) return "water";

  // Check for specific water types
  if (tags.water) {
    return tags.water;
  }

  if (tags.natural === "water") {
    // Try to determine more specific type from other tags
    if (tags.waterway) return "river";
    if (tags.wetland) return "wetland";
    if (tags.reservoir) return "reservoir";
    if (tags.pond) return "pond";
    if (tags.lake) return "lake";
    if (tags.sea) return "sea";
    if (tags.ocean) return "ocean";

    return "water";
  }

  return "water";
}

async function createSampleData() {
  const sampleWaterBodies = [
    {
      name: "Lake Naroch",
      type: "lake",
      latitude: 54.8667,
      longitude: 26.75,
      country: "Belarus",
      region: "Minsk Region",
    },
    {
      name: "Svisloch River",
      type: "river",
      latitude: 53.9,
      longitude: 27.5667,
      country: "Belarus",
      region: "Minsk Region",
    },
    {
      name: "Berezina River",
      type: "river",
      latitude: 52.55,
      longitude: 30.4,
      country: "Belarus",
      region: "Gomel Region",
    },
    {
      name: "Lake Braslav",
      type: "lake",
      latitude: 55.6333,
      longitude: 27.0333,
      country: "Belarus",
      region: "Vitebsk Region",
    },
    {
      name: "Neman River",
      type: "river",
      latitude: 53.9,
      longitude: 23.9,
      country: "Belarus",
      region: "Grodno Region",
    },
  ];

  return sampleWaterBodies;
}

export async function seedWaterBodies() {
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

    // Try to get real data first, fall back to sample data
    let waterBodiesToInsert = [];

    try {
      const overpassData = await fetchOverpassData();

      // Filter and process elements
      const validFeatures = overpassData.elements.filter((element) => {
        const coords = getCoordinates(element);
        return element.tags?.name && coords;
      });

      if (validFeatures.length > 0) {
        waterBodiesToInsert = validFeatures.map((feature) => {
          const coords = getCoordinates(feature);
          const waterType = determineWaterType(feature.tags);

          return {
            name: feature.tags!.name,
            type: waterType,
            latitude: coords!.lat,
            longitude: coords!.lon,
            countryId: belarus.id,
            region: feature.tags?.region || null,
          };
        });
      } else {
        waterBodiesToInsert = await createSampleData();
        waterBodiesToInsert = waterBodiesToInsert.map((body) => ({
          ...body,
          countryId: belarus.id,
        }));
      }
    } catch (error) {
      waterBodiesToInsert = await createSampleData();
      waterBodiesToInsert = waterBodiesToInsert.map((body) => ({
        ...body,
        countryId: belarus.id,
      }));
    }

    await prisma.waterBody.createMany({
      data: waterBodiesToInsert,
      skipDuplicates: true,
    });
  } catch (error) {
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedWaterBodies()
    .catch((e) => {
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
