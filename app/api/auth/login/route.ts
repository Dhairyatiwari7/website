import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import clientPromise from "../../../lib/db"; // ✅ Using `clientPromise` for MongoDB

const JWT_SECRET = "e30d56f2861fb3c57ff3e48be66af5b8a943d474a116251e7beb0a18ac9405f05fe58ca74abc325e167a14251d813743bdacf31a333b27586b169f52265604ae";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    console.log("🔹 Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("test"); // ✅ Ensure this matches your database name

    console.log("🔎 Searching for user:", username);
    let user = await db.collection("User").findOne({ username: username.toLowerCase() });

    let role = "user";

    if (!user) {
      console.log("👨‍⚕️ Checking doctor collection...");
      user = await db.collection("Doctor").findOne({ username: username.toLowerCase() });
      if (user) role = "doctor";
    }

    if (!user) {
      console.error("❌ User not found:", username);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("🔑 Checking password...");
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.error("❌ Incorrect password:", password);
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    console.log("🔐 Generating JWT token...");
    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: "7d" });

    console.log("✅ Login successful:", username);
    return NextResponse.json(
      { message: "Login successful", token, user: { username: user.username, role } },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Login Error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).toString() }, { status: 500 });
  }
}
