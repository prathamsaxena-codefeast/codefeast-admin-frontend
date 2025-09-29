import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(
      `http://localhost:8000/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data?.message || "Login failed" },
        { status: backendRes.status }
      );
    }
    return NextResponse.json(
      {
        message: data.message,
        token: data.token,
        role: data.role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
