import { NextResponse } from "next/server";
import { backendApi } from "@/lib/api";
import { AxiosError, isAxiosError } from "axios";

export async function GET() {
  try {
    const { data } = await backendApi.get("/get-all-users");
    return NextResponse.json({ users: data.data });
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          message: error.response.data?.message || "Failed to fetch candidates",
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    const { data } = await backendApi.post("/edit-role", body);
    return NextResponse.json({ message: data.message }, { status: 201 });
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || "Failed to add candidate" },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
