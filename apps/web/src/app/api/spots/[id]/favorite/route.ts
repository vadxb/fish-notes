import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@web/lib/auth";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = payload.userId;

    // Get the current spot to check ownership and current favorite status
    const spot = await prisma.spot.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!spot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    // Toggle the favorite status
    const updatedSpot = await prisma.spot.update({
      where: { id },
      data: {
        isFavorite: !spot.isFavorite,
      },
    });

    return NextResponse.json({
      isFavorite: updatedSpot.isFavorite,
      message: updatedSpot.isFavorite
        ? "Spot added to favorites"
        : "Spot removed from favorites",
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}
