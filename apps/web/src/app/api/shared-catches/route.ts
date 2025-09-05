import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@web/lib/prisma";
import { existsSync } from "fs";
import { join } from "path";

// GET /api/shared-catches - Get all shared catches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const whereClause: any = {
      isShared: true,
    };

    // Filter by user if specified
    if (userId) {
      whereClause.userId = userId;
    }

    const catches = await prisma.catch.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
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
      take: limit,
      skip: offset,
    });

    // Transform data to match frontend interface
    const transformedCatches = catches.map((catchItem) => ({
      id: catchItem.id,
      title: `${catchItem.species} Catch`,
      description:
        catchItem.comments ||
        `Caught a ${catchItem.species}${catchItem.weight ? ` weighing ${catchItem.weight}kg` : ""}`,
      images: catchItem.photoUrls
        ? Array.isArray(catchItem.photoUrls)
          ? catchItem.photoUrls
          : [catchItem.photoUrls]
        : [],
      weight: catchItem.weight || 0,
      length: null, // Will be added later
      fishType: catchItem.species,
      bait: catchItem.bait || "Unknown",
      location:
        catchItem.location || catchItem.spot?.name || "Unknown location",
      createdAt: catchItem.createdAt.toISOString(),
      user: {
        id: catchItem.user.id,
        username: catchItem.user.username || catchItem.user.name || "Anonymous",
        avatar: catchItem.user.avatar,
      },
      likes: 0, // Will be implemented later
      isLiked: false, // Will be implemented later
      comments: [], // Will be implemented later
    }));

    return NextResponse.json({
      catches: transformedCatches,
      hasMore: catches.length === limit,
    });
  } catch (error) {
    console.error("Error fetching shared catches:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared catches" },
      { status: 500 }
    );
  }
}
