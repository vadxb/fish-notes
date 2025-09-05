import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@web/lib/auth";
import { prisma } from "@web/lib/prisma";

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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        subscription: true,
        premiumExpiresAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has active premium
    const now = new Date();
    const hasActivePremium =
      user.subscription === "premium" &&
      user.premiumExpiresAt &&
      new Date(user.premiumExpiresAt) > now;

    if (hasActivePremium) {
      return NextResponse.json(
        { error: "User already has an active premium subscription" },
        { status: 400 }
      );
    }

    // Calculate premium expiration (1 month from now)
    const premiumExpiresAt = new Date();
    premiumExpiresAt.setMonth(premiumExpiresAt.getMonth() + 1);

    // Update user to premium
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        subscription: "premium",
        premiumExpiresAt: premiumExpiresAt,
        updatedAt: new Date(),
      },
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

    return NextResponse.json({
      message: "Premium subscription activated successfully",
      user: updatedUser,
      premiumExpiresAt: updatedUser.premiumExpiresAt,
    });
  } catch (error) {
    console.error("Premium purchase error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
