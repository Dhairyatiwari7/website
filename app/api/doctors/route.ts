import { NextResponse } from "next/server";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    console.log("🔹 Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("test"); // Ensure this matches your database name

    console.log("🔎 Fetching doctors...");
    const doctors = await db.collection("doctors").find({}, { 
      projection: { 
        password: 0,
        _id: 1,
        name: 1,
        speciality: 1,
        fees: 1,
        availability: 1,
        rating: 1,
        imageUrl: 1
      } 
    }).toArray();

    // Convert _id to string for easier handling in frontend
    const formattedDoctors = doctors.map(doctor => ({
      ...doctor,
      _id: doctor._id.toString()
    }));

    console.log(`✅ ${formattedDoctors.length} doctors fetched successfully!`);
    return NextResponse.json({ doctors: formattedDoctors });

  } catch (error) {
    console.error("❌ Doctors fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
