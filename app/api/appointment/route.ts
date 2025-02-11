import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";

// ✅ Allow CORS and OPTIONS method
export async function OPTIONS() {
  return NextResponse.json({ message: "Allowed Methods: GET, POST" }, { status: 200 });
}

// ✅ Handle Appointment Booking (POST)
export async function POST(req: NextRequest) {
  try {
    console.log("🔹 Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("test");

    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { doctorId, date, time } = await req.json();
    if (!doctorId || !date || !time) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    console.log("📅 Booking appointment:", { doctorId, date, time, userId: token.id });

    const result = await db.collection("Appointment").insertOne({
      user: new ObjectId(token.id as string),
      doctor: new ObjectId(doctorId),
      date: new Date(date),
      time,
      status: "pending",
      createdAt: new Date()
    });

    console.log("✅ Appointment booked:", result.insertedId);
    return NextResponse.json(
      { message: "Appointment booked successfully", appointmentId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Booking error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ✅ Handle Fetching Appointments (GET)
export async function GET(req: NextRequest) {
  try {
    console.log("🔹 Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("test");

    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("🔍 Fetching appointments...");
    let appointments;

    if (token.role === "doctor") {
      appointments = await db
        .collection("Appointment")
        .aggregate([
          { $match: { doctor: new ObjectId(token.id as string) } },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user"
            }
          },
          { $unwind: "$user" },
          {
            $project: {
              _id: 1,
              date: 1,
              time: 1,
              status: 1,
              "user._id": 1,
              "user.name": 1
            }
          }
        ])
        .toArray();
    } else {
      appointments = await db
        .collection("Appointment")
        .aggregate([
          { $match: { user: new ObjectId(token.id as string) } },
          {
            $lookup: {
              from: "doctors",
              localField: "doctor",
              foreignField: "_id",
              as: "doctor"
            }
          },
          { $unwind: "$doctor" },
          {
            $project: {
              _id: 1,
              date: 1,
              time: 1,
              status: 1,
              "doctor._id": 1,
              "doctor.name": 1,
              "doctor.speciality": 1
            }
          }
        ])
        .toArray();
    }

    console.log("✅ Appointments fetched successfully!");
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
