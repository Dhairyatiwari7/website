import { NextResponse } from "next/server";
import Contact from "../../models/contact";
import connectDB from "../../lib/db"; // Ensure this exists

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newMessage = new Contact(body);
    await newMessage.save();

    return NextResponse.json({ success: true, message: "Thanks for your response!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ success: false, message: "Failed to submit message" }, { status: 500 });
  }
}
