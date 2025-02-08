import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

interface LoginRequestBody {
  username: string;
  password: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { username, password }: LoginRequestBody = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const uri = 'mongodb+srv://quickcare:quickcare@cluster0.qpo69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // REPLACE THIS!
    const client = new MongoClient(uri);

    await client.connect();
    const db = client.db();

    const user = await db.collection('quickcare').findOne({ username });

    if (!user) {
      await client.close();
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    const passwordMatch: boolean = await bcrypt.compare(password, User.password);

    if (!passwordMatch) {
      await client.close();
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    await client.close();
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}
