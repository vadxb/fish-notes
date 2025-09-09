import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyDeployment() {
  try {
    console.log("Verifying deployment...");

    // Check if Belarus exists
    const belarus = await prisma.country.findUnique({
      where: { code: "BY" },
    });

    if (!belarus) {
      console.log("❌ Belarus country not found. Run: npm run seed-countries");
      return false;
    }
    console.log("✅ Belarus country found");

    // Check if fish species exist
    const fishCount = await prisma.fish.count();
    if (fishCount === 0) {
      console.log("❌ No fish species found. Run: npm run seed-fish");
      return false;
    }
    console.log(`✅ ${fishCount} fish species found`);

    // Check if baits exist
    const baitCount = await prisma.bait.count();
    if (baitCount === 0) {
      console.log("❌ No baits found. Run: npm run seed-baits");
      return false;
    }
    console.log(`✅ ${baitCount} baits found`);

    // Check if water bodies exist
    const waterBodyCount = await prisma.waterBody.count();
    if (waterBodyCount === 0) {
      console.log("❌ No water bodies found. Run: npm run seed-water-bodies");
      return false;
    }
    console.log(`✅ ${waterBodyCount} water bodies found`);

    // Check if default users exist
    const user1 = await prisma.user.findUnique({
      where: { email: "dev@email.com" },
    });
    const user2 = await prisma.user.findUnique({
      where: { email: "dev2@email.com" },
    });

    if (!user1 || !user2) {
      console.log("❌ Default users not found. Run: npm run seed-fresh");
      return false;
    }
    console.log("✅ Default users found");

    // Check if all data is linked to Belarus
    const fishWithBelarus = await prisma.fish.count({
      where: { countryId: belarus.id },
    });
    const baitWithBelarus = await prisma.bait.count({
      where: { countryId: belarus.id },
    });
    const waterBodyWithBelarus = await prisma.waterBody.count({
      where: { countryId: belarus.id },
    });

    if (
      fishWithBelarus !== fishCount ||
      baitWithBelarus !== baitCount ||
      waterBodyWithBelarus !== waterBodyCount
    ) {
      console.log(
        "❌ Some data not linked to Belarus. Run: npm run seed-fresh"
      );
      return false;
    }
    console.log("✅ All data properly linked to Belarus");

    console.log("\n🎉 Deployment verification successful!");
    console.log("The application is ready to use.");
    return true;
  } catch (error) {
    console.error("❌ Deployment verification failed:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  verifyDeployment();
}

export { verifyDeployment };
