import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@web/lib/prisma";
import { verifyToken } from "@web/lib/auth";

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

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        subscription: true,
        premiumExpiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      // User was deleted but token is still valid - clear the token
      const response = NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
      response.cookies.delete("auth-token");
      return response;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
