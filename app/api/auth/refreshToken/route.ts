import { NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET() {
    try{
        const response=await api.get("/user/refresh-token");
        return NextResponse.json(response.data);
    }catch (error) {
        console.error("Error refreshing token:", error);
        return NextResponse.json({ message: "Failed to refresh token", status: 401 });
    }
}