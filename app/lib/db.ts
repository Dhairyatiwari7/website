import { MongoClient } from 'mongodb';

const MONGODB_URI='mongodb+srv://quickcare:quickcare@cluster0.qpo69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const uri = MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;
if (!MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDB() {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return { db, client };
}
