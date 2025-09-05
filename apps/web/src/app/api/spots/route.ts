import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@web/lib/prisma";
import { verifyToken } from "@web/lib/auth";
import { generateMapWithMarker } from "@web/lib/mapSnapshot";

// GET /api/spots - Get all spots for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const spots = await prisma.spot.findMany({
      where: { userId: payload.userId },
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ spots });
  } catch (error) {
    console.error("Get spots error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/spots - Create a new spot
export async function POST(request: NextRequest) {
  try {
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

    const spot = await prisma.spot.create({
      data: {
        name,
        latitude,
        longitude,
        coordinates: coordinates || null,
        notes: notes || null,
        mapImageUrl,
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

    return NextResponse.json({ spot }, { status: 201 });
  } catch (error) {
    console.error("Create spot error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
