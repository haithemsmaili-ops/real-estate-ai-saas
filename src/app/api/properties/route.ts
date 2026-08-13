import { NextResponse } from 'next/server';
import { jsonDb } from '@/lib/db/json-db';

export async function GET() {
  try {
    const properties = jsonDb.getProperties();
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, type, price, location, status = 'available' } = body;

    if (!title || !type || !price || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProperty = {
      id: 'prop_' + Math.random().toString(36).substr(2, 9),
      title,
      type: type.toLowerCase() as 'sale' | 'rent',
      price,
      location,
      status: status.toLowerCase() as 'available' | 'sold' | 'rented',
      createdAt: new Date().toISOString()
    };

    jsonDb.addProperty(newProperty);

    return NextResponse.json({ success: true, property: newProperty });
  } catch (error) {
    console.error('Error adding property:', error);
    return NextResponse.json({ error: 'Failed to add property' }, { status: 500 });
  }
}
