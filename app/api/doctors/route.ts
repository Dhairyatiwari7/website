import { NextResponse } from "next/server";
import { connectToDB } from "../../lib/db";
import Doctor from "../../models/doctors";

export async function GET() {
  try {
    await connectToDB();
    const doctors = await Doctor.find().select("-password");
    return NextResponse.json({ doctors });
  } catch (error) {
    console.error("Doctors fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}