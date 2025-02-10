import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/users";
import Doctor from "../../../models/doctors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { username, password} = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Username, password, and role are required" }, { status: 400 });
    }

    let user;
    if (role === "doctor") {
      user = await Doctor.findOne({ username });
    } else {
      user = await User.findOne({ username });
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    return NextResponse.json({ message: "Login successful", token, user }, { status: 200 });
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
