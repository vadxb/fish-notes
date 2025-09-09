import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@web/lib/auth";
import { prisma } from "@web/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// GET /api/catches/[id] - Get a specific catch
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;

    const catch_ = await prisma.catch.findFirst({
      where: {
        id: id,
        userId: payload.userId,
      },
      include: {
        spot: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
            coordinates: true,
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
    });

    if (!catch_) {
      return NextResponse.json({ error: "Catch not found" }, { status: 404 });
    }

    return NextResponse.json(catch_);
  } catch (error) {
    console.error("Error fetching catch:", error);
    return NextResponse.json(
      { error: "Failed to fetch catch" },
      { status: 500 }
    );
  }
}

// PUT /api/catches/[id] - Update a specific catch
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

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

    // Check if catch exists and belongs to user
    const existingCatch = await prisma.catch.findFirst({
      where: { id, userId: payload.userId },
    });

    if (!existingCatch) {
      return NextResponse.json({ error: "Catch not found" }, { status: 404 });
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

    // Update using Prisma ORM
    const updatedCatch = await prisma.catch.update({
      where: { id },
      data: {
        species,
        weight: weight ? parseFloat(weight) : null,
        bait,
        location,
        spotId,
        selectedMarkerIndexes,
        eventId,
        photoUrls,
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
            coordinates: true,
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
    });

    return NextResponse.json(updatedCatch);
  } catch (error) {
    console.error("Error updating catch:", error);
    return NextResponse.json(
      { error: "Failed to update catch" },
      { status: 500 }
    );
  }
}

// DELETE /api/catches/[id] - Delete a specific catch
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;
    // Check if catch exists and belongs to user
    const existingCatch = await prisma.catch.findFirst({
      where: { id, userId: payload.userId },
    });

    if (!existingCatch) {
      return NextResponse.json({ error: "Catch not found" }, { status: 404 });
    }

    // Delete associated photo files (non-blocking)
    try {
      if (existingCatch.photoUrls && Array.isArray(existingCatch.photoUrls)) {
        for (const photoUrl of existingCatch.photoUrls) {
          try {
            // Convert URL path to file system path
            const filePath = join(process.cwd(), "public", photoUrl as string);
            if (existsSync(filePath)) {
              await unlink(filePath);
            } else {
            }
          } catch (fileError) {
            console.error(`Error deleting file ${photoUrl}:`, fileError);
            // Continue with other files even if one fails
          }
        }
      }
    } catch (photoError) {
      console.error("Error during photo deletion process:", photoError);
      // Don't fail the entire deletion if photos can't be deleted
    }

    // Delete the catch from database
    await prisma.catch.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Catch deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting catch:", error);
    return NextResponse.json(
      {
        error: `Failed to delete catch: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
