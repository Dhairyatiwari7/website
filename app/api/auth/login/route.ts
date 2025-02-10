import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/users";
import Doctor from "../../../models/doctors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    // Check both collections to determine user role
    let user = await User.findOne({ username });
    let role = "user";

    if (!user) {
      user = await Doctor.findOne({ username });
      if (user) {
        role = "doctor";
      }
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Return filtered user data
    const { password: _, ...userData } = user.toObject();

    return NextResponse.json({ message: "Login successful", token, user: userData, role }, { status: 200 });
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
