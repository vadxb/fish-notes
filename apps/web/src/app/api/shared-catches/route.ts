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
    const whereClause: {
      isShared: boolean;
      userId?: string;
    } = {
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
        likes: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        catchComments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    // Get current user ID for like status - for now using first user as default
    // TODO: Implement proper authentication
    const currentUser = await prisma.user.findFirst({
      where: { email: "dev@email.com" },
    });

    const currentUserId = currentUser?.id || null;

    // Transform data to match frontend interface
    const transformedCatches = catches.map((catchItem: {
      id: string;
      species: string;
      comments: string | null;
      weight: number | null;
      bait: string | null;
      location: string | null;
      photoUrls: any;
      createdAt: Date;
      isShared: boolean;
      user: {
        id: string;
        username: string | null;
        name: string | null;
        avatar: string | null;
      };
      spot: {
        id: string;
        name: string;
        latitude: number;
        longitude: number;
      } | null;
      event: {
        id: string;
        title: string;
        startAt: Date;
      } | null;
      likes: Array<{
        user: {
          id: string;
          username: string | null;
          name: string | null;
          avatar: string | null;
        };
      }>;
      catchComments: Array<{
        user: {
          id: string;
          username: string | null;
          name: string | null;
          avatar: string | null;
        };
      }>;
    }) => ({
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
      likes: catchItem.likes.length,
      isLiked: catchItem.likes.some((like) => like.user.id === currentUserId),
      comments: catchItem.catchComments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        user: {
          id: comment.user.id,
          username: comment.user.username || comment.user.name || "Anonymous",
          avatar: comment.user.avatar,
        },
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
      })),
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
