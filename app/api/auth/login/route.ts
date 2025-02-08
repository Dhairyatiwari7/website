import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

interface LoginRequestBody {
  username: string;
  password: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  let client: MongoClient | null = null;

  try {
    const { username, password }: LoginRequestBody = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const uri =
      "mongodb+srv://quickcare:quickcare@cluster0.qpo69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    client = new MongoClient(uri);

    await client.connect();
    const db = client.db();

    // Case-insensitive username search
    const user = await db.collection("User").findOne({ username: { $regex: new RegExp(username, "i") } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const passwordMatch: boolean = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login successful",
      user: { username: user.username, role: user.role }, // Returning role
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
