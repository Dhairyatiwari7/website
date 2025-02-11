import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/db";
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

    console.log("📝 Booking new appointment...");
    await db.collection("Appointment").insertOne({
      user: token.id,
      doctor: doctorId,
      date,
      time,
      status: "pending",
    });

    console.log("✅ Appointment booked successfully!");
    return NextResponse.json(
      { message: "Appointment booked successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Booking error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
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
        .find({ doctor: token.id })
        .toArray();
    } else {
      appointments = await db
        .collection("Appointment")
        .find({ user: token.id })
        .toArray();
    }

    console.log("✅ Appointments fetched successfully!");
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("❌ Appointments error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
