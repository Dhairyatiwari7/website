import { NextResponse } from "next/server";
import clientPromise from "../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
const JWT_SECRET="e30d56f2861fb3c57ff3e48be66af5b8a943d474a116251e7beb0a18ac9405f05fe58ca74abc325e167a14251d813743bdacf31a333b27586b169f52265604ae";
export async function POST(req: Request) {
  try {
    console.log("🔹 Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("test"); // Replace with your actual database name
    console.log("Successfully connected to MongoDB");

    const body = await req.json();
    console.log("Received body:", { username: body.username, password: "******" });

    if (!body.username || !body.password) {
      console.error("Missing credentials");
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    console.log("🔎 Searching for user:", body.username);
    let user = await db.collection("User").findOne({ username: body.username });
    let role = "user";

    if (!user) {
      console.log("👨‍⚕️ Checking doctor collection...");
      user = await db.collection("doctors").findOne({ username: body.username });
      if (user) role = "doctor";
    }

    if (!user) {
      console.error("User not found");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    console.log("Checking password...");
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      console.error("Incorrect password");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!JWT_SECRET) {
      console.error("❌ JWT_SECRET is not set");
      throw new Error("JWT_SECRET is not set");
    }

    console.log("🔐 Generating JWT token...");
    const token = jwt.sign({ id: user._id.toString(), role }, JWT_SECRET, { expiresIn: "7d" });

    const { password: _, ...userData } = user;

    console.log("✅ Login successful");
    return NextResponse.json({ 
      message: "Login successful", 
      token, 
      user: { ...userData, _id: userData._id.toString() }, 
      role 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error details:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
