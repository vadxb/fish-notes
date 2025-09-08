import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@web/lib/prisma";
import { verifyToken } from "@web/lib/auth";
import { formatDateForTitle } from "@web/lib/dateUtils";

// GET /api/catches - Get all catches for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const catches = await prisma.catch.findMany({
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
        event: {
          select: {
            id: true,
            title: true,
            startAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(catches);
  } catch (error) {
    console.error("Error fetching catches:", error);
    return NextResponse.json(
      { error: "Failed to fetch catches" },
      { status: 500 }
    );
  }
}

// POST /api/catches - Create a new catch
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Create catch - User ID:", payload.userId);
    console.log("Create catch - Body:", body);
    
    const {
      species,
      weight,
      bait,
      location,
      spotId,
      selectedMarkerIndexes,
      eventId,
      photoUrls,
      comments,
      weather,
    } = body;

    if (!species) {
      return NextResponse.json(
        { error: "Species is required" },
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

    // If eventId is provided, verify it belongs to the user
    if (eventId) {
      const event = await prisma.fishEvent.findFirst({
        where: { id: eventId, userId: payload.userId },
      });

      if (!event) {
        return NextResponse.json(
          { error: "Event not found or access denied" },
          { status: 404 }
        );
      }
    }

    // If no eventId provided, create a new event automatically
    let finalEventId = eventId;
    if (!eventId) {
      const autoEvent = await prisma.fishEvent.create({
        data: {
          userId: payload.userId,
          title: `Fishing Session - ${formatDateForTitle()}`,
          notes: `Auto-created event for catch: ${species}`,
          startAt: new Date(),
          locationType: spotId ? "spot" : "text",
          locationText: location || null,
          spotId: spotId || null,
        },
      });
      finalEventId = autoEvent.id;
    }
    const newCatch = await prisma.catch.create({
      data: {
        userId: payload.userId,
        species,
        weight: weight ? parseFloat(weight) : null,
        bait,
        location,
        spotId,
        selectedMarkerIndexes: selectedMarkerIndexes || null,
        eventId: finalEventId,
        photoUrls: photoUrls || null,
        comments,
        weather,
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
      },
    });

    return NextResponse.json(newCatch, { status: 201 });
  } catch (error) {
    console.error("Error creating catch:", error);
    return NextResponse.json(
      { error: "Failed to create catch" },
      { status: 500 }
    );
  }
}
