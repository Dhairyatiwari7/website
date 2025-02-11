import { NextResponse } from "next/server";
import clientPromise from "../../lib/db"; // ✅ Using `clientPromise` for MongoDB

export async function GET() {
  try {
    console.log("🔹 Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("test"); // ✅ Ensure this matches your database name

    console.log("🔎 Fetching doctors...");
    const doctors = await db.collection("Doctor").find({}, { projection: { password: 0 } }).toArray();

    console.log("✅ Doctors fetched successfully!");
    return NextResponse.json({ doctors });

  } catch (error) {
    console.error("❌ Doctors fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
