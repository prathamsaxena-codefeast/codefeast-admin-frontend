import { NextResponse } from "next/server";
import { backendApi } from "@/lib/api";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data } = await backendApi.post("/auth/login", body);

    if (data?.token) {
      const cookieStore = await cookies();
      cookieStore.set("token", data.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
      });
    }

    return NextResponse.json(
      {
        message: data.message,
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
