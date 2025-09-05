import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Check if default user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: "dev@email.com" },
  });

  if (!existingUser) {
    // Hash the password
    const hashedPassword = await bcrypt.hash("12345678", 12);

    // Create default user
    const user = await prisma.user.create({
      data: {
        email: "dev@email.com",
        name: "Dev",
        password: hashedPassword,
      },
    });

    console.log("Default user created:", user);
  } else {
    console.log("Default user already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
