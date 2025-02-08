import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const uri = 'mongodb+srv://quickcare:quickcare@cluster0.qpo69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // REPLACE THIS!
    const client = new MongoClient(uri);

    await client.connect();
    const db = client.db();

    const user = await db.collection('users').findOne({ username });

    if (!user) {
      await client.close();
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

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
