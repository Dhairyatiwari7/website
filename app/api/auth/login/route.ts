import { NextResponse } from "next/server";
import clientPromise from "../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("test"); 
    const usersCollection = db.collection("User");
    const doctorsCollection = db.collection("doctors");

    const { username, password, role } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    let user;
    if (role === "doctor") {
      user = await doctorsCollection.findOne({ username });
    } else {
      user = await usersCollection.findOne({ username });
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const { password: _, ...userData } = user; // Remove password from response

    return NextResponse.json({ message: "Login successful", token, user: userData, role }, { status: 200 });
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
