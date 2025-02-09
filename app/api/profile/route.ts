import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { connectToDB } from "../../lib/db"; 
import User from "@/models/user"; 

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();
  const user = await User.findOne({ email: session.user?.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await connectToDB();
  const updatedUser = await User.findOneAndUpdate(
    { email: session.user?.email },
    { $set: body },
    { new: true, upsert: true }
  );

  return NextResponse.json(updatedUser);
}
