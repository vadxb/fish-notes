import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@web/lib/auth";
import { generateMapWithMarker } from "@web/lib/mapSnapshot";

const prisma = new PrismaClient();

// GET /api/spots/[id] - Get a specific spot
export async function GET(
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

    const spot = await prisma.spot.findFirst({
      where: {
        id,
        userId: payload.userId,
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        notes: true,
        mapImageUrl: true,
        isFavorite: true,
        coordinates: true,
        createdAt: true,
      },
    });

    if (!spot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    return NextResponse.json({ spot });
  } catch (error) {
    console.error("Get spot error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/spots/[id] - Update a spot
export async function PUT(
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

    const { name, latitude, longitude, coordinates, notes, mapImage } =
      await request.json();

    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Name, latitude, and longitude are required" },
        { status: 400 }
      );
    }

    // Use provided map image or leave empty
    const mapImageUrl = mapImage || null;

    const spot = await prisma.spot.updateMany({
      where: {
        id,
        userId: payload.userId,
      },
      data: {
        name,
        latitude,
        longitude,
        coordinates: coordinates || null,
        notes: notes || null,
        mapImageUrl,
      },
    });

    if (spot.count === 0) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    const updatedSpot = await prisma.spot.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        notes: true,
        mapImageUrl: true,
        isFavorite: true,
        coordinates: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ spot: updatedSpot });
  } catch (error) {
    console.error("Update spot error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/spots/[id] - Delete a spot
export async function DELETE(
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

    const spot = await prisma.spot.deleteMany({
      where: {
        id,
        userId: payload.userId,
      },
    });

    if (spot.count === 0) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Spot deleted successfully" });
  } catch (error) {
    console.error("Delete spot error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
