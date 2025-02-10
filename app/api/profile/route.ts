import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "../../lib/db";
import User from "../../models/users";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  await client.connect();
  const user = await User.findOne({ username: session.user?.username });

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
  const client = await clientPromise;
  await client.connect();

  const updatedUser = await User.findOneAndUpdate(
    { email: session.user?.email },
    { $set: body },
    { new: true, upsert: true }
  );

  return NextResponse.json(updatedUser);
}
