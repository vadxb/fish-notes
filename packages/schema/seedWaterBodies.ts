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
  console.log("Fetching water body data from Overpass API...");
  console.log("Query:", overpassQuery);

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
    console.error("Failed to parse JSON response:", parseError);
    console.log("Response preview:", responseText.substring(0, 500));
    throw new Error("Invalid JSON response from Overpass API");
  }

  console.log(`Fetched ${data.elements.length} elements from Overpass API`);

  if (data.elements.length === 0) {
    console.log("⚠️  No elements found. This might be due to:");
    console.log("   - Incorrect bounding box coordinates");
    console.log("   - No water bodies with names in the area");
    console.log("   - Overpass API timeout or rate limiting");
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

async function testSimpleQuery() {
  console.log("Testing simple Overpass query...");

  // First test: any water bodies in a broader Belarus area
  const anyWaterQuery = `
    [out:json][timeout:10];
    (
      node["natural"="water"](51.0,23.0,56.5,33.0);
      node["waterway"="river"](51.0,23.0,56.5,33.0);
    );
    out;
  `;

  console.log("Testing for any water bodies (no name required)...");

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(anyWaterQuery)}`,
    });

    const responseText = await response.text();
    const data = JSON.parse(responseText);

    console.log(`Found ${data.elements?.length || 0} water bodies (any type)`);

    if (data.elements && data.elements.length > 0) {
      console.log("Sample water body:", data.elements[0]);

      // Now test with name requirement
      console.log("\nTesting for named water bodies...");

      const namedWaterQuery = `
        [out:json][timeout:10];
        (
          node["natural"="water"]["name"](51.0,23.0,56.5,33.0);
          node["waterway"="river"]["name"](51.0,23.0,56.5,33.0);
        );
        out;
      `;

      const namedResponse = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `data=${encodeURIComponent(namedWaterQuery)}`,
        }
      );

      const namedResponseText = await namedResponse.text();
      const namedData = JSON.parse(namedResponseText);

      console.log(
        `Found ${namedData.elements?.length || 0} named water bodies`
      );

      if (namedData.elements && namedData.elements.length > 0) {
        console.log("Sample named water body:", namedData.elements[0]);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Simple query failed:", error);
    return false;
  }
}

async function createSampleData() {
  console.log("Creating sample water body data for testing...");

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

  console.log(`Created ${sampleWaterBodies.length} sample water bodies`);
  sampleWaterBodies.forEach((body, index) => {
    console.log(
      `${index + 1}. ${body.name} (${body.type}) - ${body.latitude}, ${body.longitude}`
    );
  });

  return sampleWaterBodies;
}

async function testWaterBodiesData() {
  try {
    console.log("Starting water bodies data collection test...");

    // First test with a simple query
    const simpleTestPassed = await testSimpleQuery();
    if (!simpleTestPassed) {
      console.log("Simple query failed. Using sample data for testing...\n");

      const sampleData = await createSampleData();
      console.log("\nSample data created successfully!");
      console.log(
        `Ready to insert ${sampleData.length} sample water bodies into database.`
      );
      return sampleData;
    }

    console.log("Simple query passed. Proceeding with full query...\n");

    const overpassData = await fetchOverpassData();

    // Filter and process elements
    const validFeatures = overpassData.elements.filter((element) => {
      const coords = getCoordinates(element);
      return element.tags?.name && coords;
    });

    console.log(
      `Found ${validFeatures.length} valid water bodies with names and coordinates`
    );

    // Show first 10 examples
    console.log("\nFirst 10 water bodies found:");
    validFeatures.slice(0, 10).forEach((feature, index) => {
      const coords = getCoordinates(feature);
      const waterType = determineWaterType(feature.tags);

      console.log(`${index + 1}. ${feature.tags?.name}`);
      console.log(`   Type: ${waterType}`);
      console.log(
        `   Coordinates: ${coords?.lat.toFixed(6)}, ${coords?.lon.toFixed(6)}`
      );
      console.log(`   OSM Type: ${feature.type}`);
      console.log(`   Tags:`, feature.tags);
      console.log("");
    });

    // Count by water type
    const typeCounts: { [key: string]: number } = {};
    validFeatures.forEach((feature) => {
      const waterType = determineWaterType(feature.tags);
      typeCounts[waterType] = (typeCounts[waterType] || 0) + 1;
    });

    console.log("Water body types found:");
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    // Check for duplicates
    const names = validFeatures.map((f) => f.tags?.name).filter(Boolean);
    const uniqueNames = new Set(names);
    console.log(
      `\nTotal names: ${names.length}, Unique names: ${uniqueNames.size}`
    );

    if (names.length !== uniqueNames.size) {
      console.log("Warning: Found duplicate names");
    }

    console.log("\nTest completed successfully!");
    console.log(
      `Ready to insert ${validFeatures.length} water bodies into database.`
    );

    return validFeatures;
  } catch (error) {
    console.error("Error during test:", error);
    throw error;
  }
}

async function seedWaterBodies() {
  try {
    console.log("Starting water bodies seeding...");

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
        console.log(
          `Found ${validFeatures.length} water bodies from Overpass API`
        );

        waterBodiesToInsert = validFeatures.map((feature) => {
          const coords = getCoordinates(feature);
          const waterType = determineWaterType(feature.tags);

          return {
            name: feature.tags!.name,
            type: waterType,
            latitude: coords!.lat,
            longitude: coords!.lon,
            country: "Belarus",
            region: feature.tags?.region || null,
          };
        });
      } else {
        console.log(
          "No water bodies found from Overpass API, using sample data..."
        );
        waterBodiesToInsert = await createSampleData();
      }
    } catch (error) {
      console.log("Overpass API failed, using sample data...");
      waterBodiesToInsert = await createSampleData();
    }

    console.log(`Processing ${waterBodiesToInsert.length} water bodies...`);

    let successCount = 0;
    let errorCount = 0;

    for (const waterBody of waterBodiesToInsert) {
      try {
        await prisma.waterBody.create({
          data: {
            name: waterBody.name,
            type: waterBody.type,
            latitude: waterBody.latitude,
            longitude: waterBody.longitude,
            country: waterBody.country,
            region: waterBody.region,
          },
        });

        successCount++;

        if (successCount % 10 === 0) {
          console.log(`Processed ${successCount} water bodies...`);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error processing ${waterBody.name}:`, error);
      }
    }

    console.log(`\nSeeding completed!`);
    console.log(`Successfully inserted: ${successCount} water bodies`);
    console.log(`Errors: ${errorCount} water bodies`);
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    if (command === "test") {
      await testWaterBodiesData();
    } else if (command === "seed") {
      await seedWaterBodies();
    } else {
      console.log("Usage:");
      console.log(
        "  npm run test-water-bodies    - Test data collection without saving to DB"
      );
      console.log(
        "  npm run seed-water-bodies    - Collect data and save to database"
      );
      console.log("");
      console.log("Or run directly:");
      console.log("  npx tsx seedWaterBodies.ts test");
      console.log("  npx tsx seedWaterBodies.ts seed");
    }
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main();
