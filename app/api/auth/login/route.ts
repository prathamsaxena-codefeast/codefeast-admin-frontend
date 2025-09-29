import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};
    return NextResponse.json({ email, password }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
}

