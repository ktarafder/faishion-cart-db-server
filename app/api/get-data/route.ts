import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('fashionAIsian');
    const data = await db.collection('products').find({}).toArray();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Failed to connect to database' }, { status: 500 });
  }
}
