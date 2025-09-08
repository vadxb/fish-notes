import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@web/lib/prisma";

// POST /api/catches/[id]/like - Toggle like on a catch
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: catchId } = await params;

    // Get user from session - for now using first user as default
    // TODO: Implement proper authentication
    const user = await prisma.user.findFirst({
      where: { email: "dev@email.com" },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if catch exists and is shared
    const catchItem = await prisma.catch.findFirst({
      where: {
        id: catchId,
        isShared: true,
      },
    });

    if (!catchItem) {
      return NextResponse.json({ error: "Catch not found" }, { status: 404 });
    }

    // Check if user already liked this catch
    const existingLike = await prisma.catchLike.findUnique({
      where: {
        userId_catchId: {
          userId,
          catchId,
        },
      },
    });

    if (existingLike) {
      // Unlike: Remove the like
      await prisma.catchLike.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Like: Create new like
      await prisma.catchLike.create({
        data: {
          userId,
          catchId,
        },
      });
    }

    // Get updated like count
    const likeCount = await prisma.catchLike.count({
      where: { catchId },
    });

    // Check if current user liked it
    const isLiked = !existingLike;

    return NextResponse.json({
      likes: likeCount,
      isLiked,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
