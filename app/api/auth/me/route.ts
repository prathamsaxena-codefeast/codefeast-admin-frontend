import { NextResponse } from "next/server";
import { backendApi } from "@/lib/api";
import { AxiosError } from "axios";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const { data } = await backendApi.get("/auth/me", {
      headers: {
        Authorization: token,
      },
    });

    return NextResponse.json(
      {
        user: data.user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Me API Error:", error);

    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || "Token invalid" },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
