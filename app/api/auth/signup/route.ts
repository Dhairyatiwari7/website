import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

interface RequestBody {
  username: string;
  password: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { username, password }: RequestBody = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const uri = 'mongodb+srv://quickcare:quickcare@cluster0.qpo69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // REPLACE THIS!
    const client = new MongoClient(uri);

    await client.connect();
    const db = client.db();

    const existingUser = await db.collection('User').findOne({ username });

    if (existingUser) {
      await client.close();
      return NextResponse.json({ message: 'User exists already!' }, { status: 409 });
    }

    // Hash the password before saving
    const hashedPassword = password; // Replace with bcrypt.hash(password, salt);

    const result = await db.collection('User').insertOne({
      username,
      password: hashedPassword,
    });

    await client.close();
    return NextResponse.json({ message: 'Created user!' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating user!' }, { status: 500 });
  }
}
