import { MongoClient } from 'mongodb';

// Extend the globalThis interface to include _mongoClientPromise
declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise: Promise<MongoClient> | undefined;
    }
  }

  // Make sure globalThis can recognize our extended NodeJS.Global interface
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// In development, reuse the client instance to avoid excessive connections
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
