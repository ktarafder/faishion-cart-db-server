// src/app/api/get-data/route.ts
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'your-mongodb-uri-here';
const dbName = 'fashionAIsian';

export async function GET() {
  let client: MongoClient | null = null;

  try {
    // Create a new MongoClient and connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db(dbName);
    const data = await db.collection('products').find({}).toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Failed to connect to database' }, { status: 500 });
  } finally {
    // Close the client connection
    if (client) {
      await client.close();
    }
  }
}
