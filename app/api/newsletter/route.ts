import { NextResponse } from "next/server";
import { backendApi } from "@/lib/api";
import { AxiosError } from "axios";

export async function GET() {
  try {
    const { data } = await backendApi.get("/newsletter");

    return NextResponse.json({ subscribers: data });
  } catch (error) {
    console.error("Error fetching subscribers:", error);

    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        {
          message:
            error.response.data?.message || "Failed to fetch subscribers",
        },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
