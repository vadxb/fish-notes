import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
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
    }
  } catch (error) {
    throw error;
  }
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
