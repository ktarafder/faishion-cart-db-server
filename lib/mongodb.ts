import { MongoClient } from 'mongodb';

// Extend the global object correctly without namespaces or var
interface CustomNodeJsGlobal extends NodeJS.Process {
  _mongoClientPromise?: Promise<MongoClient>;
}

declare const global: CustomNodeJsGlobal;

const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Use the same client during development to avoid multiple connections
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
