import { MongoClient } from "mongodb";

const uri ="mongodb+srv://quickcare:quickcare@cluster0.qpo69.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

if (!uri) {
  throw new Error("❌ MongoDB URI is missing!");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  });

  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export const connectToDB = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("test"); // Ensure this is the correct DB name
    console.log("✅ Connected to MongoDB:", db.databaseName);
    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("Database connection failed");
  }
};

export default clientPromise;
