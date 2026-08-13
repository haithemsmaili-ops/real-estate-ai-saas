import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/...nextauth/route';
import { jsonDb } from '@/lib/db/json-db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ hasPaid: false });
    }

    const user = jsonDb.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ hasPaid: false });
    }

    return NextResponse.json({
      hasPaid: user.hasPaid || false,
      paymentTimestamp: user.paymentTimestamp || null,
      subscriptionStatus: user.subscriptionStatus || 'none',
      adminActivated: (user as any).adminActivated || false,
    });
  } catch (error: any) {
    console.error('Payment Status API Error:', error);
    return NextResponse.json({ hasPaid: false });
  }
}
