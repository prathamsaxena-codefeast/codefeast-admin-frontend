import { NextResponse } from "next/server";
import { backendApi } from "@/lib/api";
import { AxiosError, isAxiosError } from "axios";

export async function GET() {
  try {
    const { data } = await backendApi.get("/get-all-jobs");
    return NextResponse.json({ jobs: data.data });
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          message: error.response.data?.message || "Failed to fetch Jobs",
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
    const { data } = await backendApi.post("/create-job", body);
    return NextResponse.json({ message: data.message }, { status: 201 });
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          message: error.response.data?.message || "Failed to create the job.",
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
