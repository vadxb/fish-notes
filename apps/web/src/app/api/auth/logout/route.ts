import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Create a response
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Clear the auth-token cookie
    response.cookies.set("auth-token", "", {
      httpOnly: false, // Match login route setting
      secure: false, // Match login route setting
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
