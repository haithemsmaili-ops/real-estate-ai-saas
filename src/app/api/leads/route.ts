import { NextResponse } from 'next/server';
import { jsonDb } from '@/lib/db/json-db';

export async function GET() {
  try {
    const leads = jsonDb.getLeads();
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Accept lead fields (can be sent from n8n chatbot)
    const { tenantId = 'demo', name, email, phone, source = 'chatbot', status = 'new', intentScore = 50, locale = 'ar' } = body;

    if (!name) {
      return NextResponse.json({ error: 'Lead name is required' }, { status: 400 });
    }

    const newLead = {
      id: 'lead_' + Math.random().toString(36).substr(2, 9),
      tenantId,
      name,
      email,
      phone,
      source,
      status,
      intentScore: Number(intentScore) || 50,
      locale,
      createdAt: new Date().toISOString()
    };

    jsonDb.addLead(newLead);

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error('Error adding lead:', error);
    return NextResponse.json({ error: 'Failed to add lead' }, { status: 500 });
  }
}
