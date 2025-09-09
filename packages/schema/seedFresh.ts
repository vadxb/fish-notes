import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedFresh() {
  try {
    console.log("Starting fresh deployment seed...");

    // 1. Seed countries
    console.log("\n1. Seeding countries...");
    const { seedCountries } = await import("./seedCountries");
    await seedCountries();

    // 2. Seed fish species
    console.log("\n2. Seeding fish species...");
    const { seedFish } = await import("./seedFish");
    await seedFish();

    // 3. Seed baits
    console.log("\n3. Seeding baits...");
    const { seedBaits } = await import("./seedBaits");
    await seedBaits();

    // 4. Seed water bodies
    console.log("\n4. Seeding water bodies...");
    const { seedWaterBodies } = await import("./seedWaterBodies");
    await seedWaterBodies();

    // 5. Create 2 default users
    console.log("\n5. Creating default users...");
    await createDefaultUsers();

    // 6. Set default country for all users
    console.log("\n6. Setting default country for users...");
    const { setDefaultCountry } = await import("./setDefaultCountry");
    await setDefaultCountry();

    console.log("\nFresh deployment seed completed successfully!");
    console.log("\nDatabase now contains:");
    console.log("   - Belarus as the only country");
    console.log("   - Fish species native to Belarus");
    console.log("   - Baits commonly used in Belarus");
    console.log("   - Water bodies in Belarus");
    console.log("   - 2 default users (dev@email.com, dev2@email.com)");
    console.log("   - All users assigned to Belarus");
  } catch (error) {
    console.error("Error during fresh deployment seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createDefaultUsers() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash("12345678", 12);

    // Check if first user already exists
    const existingUser1 = await prisma.user.findUnique({
      where: { email: "dev@email.com" },
    });

    if (!existingUser1) {
      // Create first user
      await prisma.user.create({
        data: {
          email: "dev@email.com",
          name: "Dev",
          username: "Dev",
          password: hashedPassword,
        },
      });
      console.log("Created user: dev@email.com");
    } else {
      console.log("User already exists: dev@email.com");
    }

    // Check if second user already exists
    const existingUser2 = await prisma.user.findUnique({
      where: { email: "dev2@email.com" },
    });

    if (!existingUser2) {
      // Create second user
      await prisma.user.create({
        data: {
          email: "dev2@email.com",
          name: "User2",
          username: "User2",
          password: hashedPassword,
        },
      });
      console.log("Created user: dev2@email.com");
    } else {
      console.log("User already exists: dev2@email.com");
    }
  } catch (error) {
    console.error("Error creating default users:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedFresh();
}
