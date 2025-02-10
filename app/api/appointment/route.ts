import { NextResponse } from "next/server";
import { connectToDB } from "../../lib/db";
import Appointment from "../../models/appointment";
import { getToken } from "next-auth/jwt";

// Book appointment
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const token = await getToken({ req });
    
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { doctorId, date, time } = await req.json();
    
    const newAppointment = new Appointment({
      user: token.id,
      doctor: doctorId,
      date,
      time,
      status: "pending"
    });

    await newAppointment.save();

    return NextResponse.json(
      { message: "Appointment booked successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
// Get appointments
export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    let appointments;
    if (token.role === "doctor") {
      appointments = await Appointment.find({ doctor: token.id })
        .populate("user", "username");
    } else {
      appointments = await Appointment.find({ user: token.id })
        .populate("doctor", "name speciality");
    }

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Appointments error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}