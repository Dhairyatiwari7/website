import { MongoClient } from "mongodb";

const uri = 'mongodb+srv://quickcare:quickcare@cluster0.qpo69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Ensure client is created only once (important for Next.js hot reloading)
if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
