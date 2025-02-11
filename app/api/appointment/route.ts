import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";

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
    console.log("Received appointment data:", { doctorId, date, time, userId: token.id });

    const result = await db.collection("Appointment").insertOne({
      user: new ObjectId(token.id as string),
      doctor: new ObjectId(doctorId),
      date: new Date(date),
      time,
      status: "pending",
      createdAt: new Date()
    });

    console.log("Insertion result:", result);

    if (result.acknowledged) {
      return NextResponse.json(
        { message: "Appointment booked successfully", appointmentId: result.insertedId },
        { status: 201 }
      );
    } else {
      throw new Error("Failed to insert appointment");
    }
  } catch (error) {
    console.error("❌ Detailed booking error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}

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
    console.error("❌ Appointments fetch error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
