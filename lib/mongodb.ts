import { MongoClient } from 'mongodb';

declare global {
  // This ensures that global._mongoClientPromise has the correct type
  // and avoids errors when accessing it in different parts of the code.
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Reuse the client in development to avoid creating multiple connections.
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a new client.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
