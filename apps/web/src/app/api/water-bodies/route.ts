import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const countryId = searchParams.get("countryId");

    // Build where clause
    const where: {
      name?: { contains: string };
      type?: string;
      countryId?: string;
    } = {};

    if (search) {
      where.name = {
        contains: search,
      };
    }

    if (type) {
      where.type = type;
    }

    if (countryId) {
      where.countryId = countryId;
    }

    const waterBodies = await prisma.waterBody.findMany({
      where,
      include: {
        country: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      take: 50, // Limit results for performance
    });

    return NextResponse.json(waterBodies);
  } catch (error) {
    console.error("Error fetching water bodies:", error);
    return NextResponse.json(
      { error: "Failed to fetch water bodies" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
