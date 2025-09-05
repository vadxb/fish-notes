import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const baits = await prisma.Bait.findMany({
      orderBy: [{ country: "asc" }, { commonName: "asc" }],
    });

    return NextResponse.json(baits);
  } catch (error) {
    console.error("Error fetching baits:", error);
    return NextResponse.json(
      { error: "Failed to fetch baits" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
