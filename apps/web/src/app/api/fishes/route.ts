import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const fishes = await prisma.Fish.findMany({
      orderBy: [{ country: "asc" }, { commonName: "asc" }],
    });

    return NextResponse.json(fishes);
  } catch (error) {
    console.error("Error fetching fishes:", error);
    return NextResponse.json(
      { error: "Failed to fetch fishes" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
