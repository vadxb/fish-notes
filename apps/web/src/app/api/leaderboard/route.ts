import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@web/lib/prisma";
import { verifyToken } from "@web/lib/auth";

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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "day"; // day, month, alltime
    const metric = searchParams.get("metric") || "weight"; // weight, count

    // Calculate date ranges
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "day":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "alltime":
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    let leaderboard: Array<{
      userId: string;
      username: string;
      totalWeight: number;
      totalLength: number;
      catchCount: number;
    }> = [];

    if (metric === "weight") {
      // Top users by total catch weight (Premium users only)
      leaderboard = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.username,
          u.avatar,
          COALESCE(SUM(c.weight), 0) as total_weight,
          COUNT(c.id) as catch_count
        FROM "User" u
        LEFT JOIN "Catch" c ON u.id = c."userId" 
          AND c."createdAt" >= ${startDate}
          AND c.weight IS NOT NULL
        WHERE u.subscription = 'premium' 
          AND (u."premiumExpiresAt" IS NULL OR u."premiumExpiresAt" > ${now})
        GROUP BY u.id, u.name, u.username, u.avatar
        HAVING COALESCE(SUM(c.weight), 0) > 0
        ORDER BY total_weight DESC
        LIMIT 50
      `;
    } else if (metric === "count") {
      // Top users by catch count (Premium users only)
      leaderboard = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.username,
          u.avatar,
          COUNT(c.id) as catch_count,
          COALESCE(SUM(c.weight), 0) as total_weight
        FROM "User" u
        LEFT JOIN "Catch" c ON u.id = c."userId" 
          AND c."createdAt" >= ${startDate}
        WHERE u.subscription = 'premium' 
          AND (u."premiumExpiresAt" IS NULL OR u."premiumExpiresAt" > ${now})
        GROUP BY u.id, u.name, u.username, u.avatar
        HAVING COUNT(c.id) > 0
        ORDER BY catch_count DESC
        LIMIT 50
      `;
    }

    return NextResponse.json({
      period,
      metric,
      leaderboard: leaderboard.map((user, index) => ({
        ...user,
        rank: index + 1,
        total_weight: parseFloat(user.totalWeight.toString()) || 0,
        catch_count: parseInt(user.catchCount.toString()) || 0,
      })),
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
