import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/users";
import Doctor from "../../../models/doctors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET="e30d56f2861fb3c57ff3e48be66af5b8a943d474a116251e7beb0a18ac9405f05fe58ca74abc325e167a14251d813743bdacf31a333b27586b169f52265604ae";
export async function POST(req: Request) {
  try {
    console.log("🔹 Connecting to MongoDB...");
    await connectToDB();
    console.log("Successfully connected to MongoDB");

    const body = await req.json();
    console.log("Received body:", body);

    if (!body.username || !body.password) {
      console.error("Missing credentials:", body);
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    console.log("🔎 Searching for user:", body.username);
    let user = await User.findOne({ username: body.username });

    let role = "user";

    if (!user) {
      console.log("👨‍⚕️ Checking doctor collection...");
      user = await Doctor.findOne({ username: body.username });
      if (user) role = "doctor";
    }

    if (!user) {
      console.error("User not found:", body.username);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("Checking password...");
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      console.error("Incorrect password:", body.password);
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }

    console.log("🔐 Generating JWT token...");
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const { password: _, ...userData } = user.toObject();

    console.log("✅ Login successful:", userData);
    return NextResponse.json({ message: "Login successful", token, user: userData, role }, { status: 200 });
  } catch (error) {
    console.error("❌ Error details:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).toString() }, { status: 500 });
  }
}
