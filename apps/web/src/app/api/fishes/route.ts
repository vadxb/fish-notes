import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get("countryId");

    const fishes = await prisma.fish.findMany({
      where: countryId ? { countryId } : undefined,
      include: {
        country: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: [{ country: { name: "asc" } }, { commonName: "asc" }],
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
