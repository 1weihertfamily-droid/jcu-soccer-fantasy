import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (
    password !== process.env.JCU_ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(
    "admin-auth",
    "true",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    }
  );

  return response;
}