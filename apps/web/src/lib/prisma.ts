import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function testPrisma() {
  try {
    const catches = await prisma.catch.findMany();
    console.log("Catches found:", catches.length);
    return catches;
  } catch (error) {
    console.error("Prisma error:", error);
    throw error;
  }
}
