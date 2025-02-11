import { NextResponse } from "next/server";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    console.log("🔹 Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("test"); // Ensure this matches your database name
    const doctors = await db.collection("doctors").find({}).toArray();
    return NextResponse.json({ doctors: doctors || [] }); 

  } catch (error) {
    console.error("❌ Doctors fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
