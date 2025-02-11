import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/users";
import Doctor from "../../../models/doctors";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { username, password, role, ...details } = await req.json();

    // Validate input
    if (!username || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await (role === "doctor" ? Doctor : User)
      .findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new entity
    if (role === "doctor") {
      const newDoctor = new Doctor({
        username,
        password: hashedPassword,
        ...details
      });
      await newDoctor.save();
    } else {
      const newUser = new User({
        username,
        password: hashedPassword
      });
      await newUser.save();
    }

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}