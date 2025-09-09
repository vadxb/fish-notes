import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@web/lib/prisma";
import { verifyToken } from "@web/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id: catchId } = await params;

    // Get the current catch
    const existingCatch = await prisma.catch.findUnique({
      where: { id: catchId },
      select: { id: true, userId: true },
    });


    if (!existingCatch) {
      return NextResponse.json({ error: "Catch not found" }, { status: 404 });
    }

    // Check if the user owns this catch
    if (existingCatch.userId !== payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get current isShared status using raw query to avoid TypeScript issues
    const currentCatch = (await prisma.$queryRaw`
      SELECT isShared FROM "Catch" WHERE id = ${catchId}
    `) as Array<{ isShared: boolean }>;

    if (!currentCatch || currentCatch.length === 0) {
      return NextResponse.json({ error: "Catch not found" }, { status: 404 });
    }

    const currentSharedStatus = currentCatch[0].isShared || false;
    const newSharedStatus = !currentSharedStatus;

    // Update using raw query
    await prisma.$executeRaw`
      UPDATE "Catch" SET isShared = ${newSharedStatus} WHERE id = ${catchId}
    `;

    console.log("Updated catch isShared to:", newSharedStatus);
    return NextResponse.json({
      id: catchId,
      isShared: newSharedStatus,
    });
  } catch (error) {
    console.error("Toggle share API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
