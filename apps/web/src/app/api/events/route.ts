import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@web/lib/auth";

const prisma = new PrismaClient();

// GET /api/events - Get all events for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    let payload;
    try {
      payload = await verifyToken(token);
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const events = await prisma.fishEvent.findMany({
      where: { userId: payload.userId },
      include: {
        spot: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
          },
        },
        catches: {
          select: {
            id: true,
            species: true,
            weight: true,
            bait: true,
            comments: true,
            photoUrls: true,
            location: true,
            spotId: true,
            selectedMarkerIndexes: true,
            createdAt: true,
          },
        },
      },
      orderBy: { startAt: "desc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    let payload;
    try {
      payload = await verifyToken(token);
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      notes,
      startAt,
      endAt,
      locationType,
      locationText,
      spotId,
      selectedMarkerIndexes,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!startAt) {
      return NextResponse.json(
        { error: "Start date is required" },
        { status: 400 }
      );
    }

    // If spotId is provided, verify it belongs to the user
    if (spotId) {
      const spot = await prisma.spot.findFirst({
        where: { id: spotId, userId: payload.userId },
      });

      if (!spot) {
        return NextResponse.json(
          { error: "Spot not found or access denied" },
          { status: 404 }
        );
      }
    }

    const newEvent = await prisma.fishEvent.create({
      data: {
        userId: payload.userId,
        title,
        notes,
        startAt: new Date(startAt),
        endAt: endAt ? new Date(endAt) : null,
        locationType,
        locationText,
        spotId,
        selectedMarkerIndexes,
      },
      include: {
        spot: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
          },
        },
        catches: {
          select: {
            id: true,
            species: true,
            weight: true,
            bait: true,
            comments: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
