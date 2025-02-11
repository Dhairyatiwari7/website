import { MongoClient } from "mongodb";

const uri = 'mongodb+srv://quickcare:quickcare@cluster0.qpo69.mongodb.net/quickcare?retryWrites=true&w=majority&appName=Cluster0';

// Check if URI is defined
if (!uri) {
  throw new Error("❌ MongoDB URI is missing!");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  try {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
    console.log("✅ Successfully connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

clientPromise = global._mongoClientPromise;

// Function to get the database instance
export const connectToDB = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    console.log("✅ Database selected: test");
    return db;
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
    throw new Error("Database connection failed");
  }
};

export default clientPromise;
