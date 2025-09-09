import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@web/lib/auth";
import { prisma } from "@web/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/profile - Get current user profile
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
        countryId: true,
        theme: true,
        country: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
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
    const {
      name,
      username,
      avatar,
      countryId,
      theme,
      currentPassword,
      newPassword,
    } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: {
      name?: string;
      username?: string;
      avatar?: string;
      theme?: string;
      countryId?: string;
      password?: string;
    } = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (username !== undefined) {
      // Check if username is already taken by another user
      if (username && username !== existingUser.username) {
        const usernameExists = await prisma.user.findUnique({
          where: { username },
        });

        if (usernameExists) {
          return NextResponse.json(
            { error: "Username is already taken" },
            { status: 400 }
          );
        }
      }
      updateData.username = username;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    if (countryId !== undefined) {
      updateData.countryId = countryId;
    }

    if (theme !== undefined) {
      updateData.theme = theme;
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change password" },
          { status: 400 }
        );
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        existingUser.password
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      updateData.password = hashedNewPassword;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        subscription: true,
        premiumExpiresAt: true,
        countryId: true,
        theme: true,
        country: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
