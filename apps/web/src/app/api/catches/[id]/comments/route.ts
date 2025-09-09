import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@web/lib/prisma";

// GET /api/catches/[id]/comments - Get comments for a catch
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: catchId } = await params;

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

    const comments = await prisma.catchComment.findMany({
      where: { catchId },
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
    });

    const transformedComments = comments.map((comment: {
      id: string;
      content: string;
      user: {
        id: string;
        username: string | null;
        name: string | null;
      };
      createdAt: Date;
    }) => ({
      id: comment.id,
      content: comment.content,
      user: {
        id: comment.user.id,
        username: comment.user.username || comment.user.name || "Anonymous",
        avatar: comment.user.avatar,
      },
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    }));

    return NextResponse.json({ comments: transformedComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/catches/[id]/comments - Add a comment to a catch
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: catchId } = await params;
    const { content } = await request.json();

    // Get user from session - for now using first user as default
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

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
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

    const comment = await prisma.catchComment.create({
      data: {
        userId,
        catchId,
        content: content.trim(),
      },
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
    });

    const transformedComment = {
      id: comment.id,
      content: comment.content,
      user: {
        id: comment.user.id,
        username: comment.user.username || comment.user.name || "Anonymous",
        avatar: comment.user.avatar,
      },
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    };

    return NextResponse.json({ comment: transformedComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
