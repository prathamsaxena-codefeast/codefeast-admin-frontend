import { NextResponse } from "next/server";
import { backendApi } from "@/lib/api";
import { isAxiosError } from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data } = await backendApi.post("/delete-user", body);
    return NextResponse.json({ message: data.message }, { status: 201 });
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          message: error.response.data?.message || "Failed to delete the user",
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
