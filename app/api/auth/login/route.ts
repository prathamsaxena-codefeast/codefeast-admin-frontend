import { NextResponse } from "next/server";
import { backendApi } from "@/lib/api";
import { AxiosError } from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data } = await backendApi.post("/auth/login", body);

    return NextResponse.json(
      {
        message: data.message,
        token: data.token,
        role: data.role,
        username: data.username,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API Error:", error);

    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || "Login failed" },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
