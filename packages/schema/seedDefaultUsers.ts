import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedDefaultUsers() {
  try {
    // Get Belarus country
    const belarus = await prisma.country.findUnique({
      where: { name: "Belarus" },
    });
    if (!belarus) {
      throw new Error(
        "Belarus country not found. Please run seedCountries first."
      );
    }

    const hashedPassword = await bcrypt.hash("12345678", 10);

    // Check if first user already exists
    const existingUser1 = await prisma.user.findUnique({
      where: { email: "dev@email.com" },
    });

    if (!existingUser1) {
      await prisma.user.create({
        data: {
          email: "dev@email.com",
          name: "Dev",
          username: "Dev",
          password: hashedPassword,
          subscription: "premium",
          countryId: belarus.id,
        },
      });
    } else {
    }

    // Check if second user already exists
    const existingUser2 = await prisma.user.findUnique({
      where: { email: "dev2@email.com" },
    });

    if (!existingUser2) {
      await prisma.user.create({
        data: {
          email: "dev2@email.com",
          name: "User2",
          username: "User2",
          password: hashedPassword,
          subscription: "premium",
          countryId: belarus.id,
        },
      });
    } else {
    }
  } catch (error) {
    console.error("Error seeding default users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDefaultUsers();
