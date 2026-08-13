import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { jsonDb } from '@/lib/db/json-db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let email = session?.user?.email;

    if (!email) {
      // Fallback to body email
      const body = await req.json().catch(() => ({}));
      email = body.email;
    }

    if (!email) {
      return NextResponse.json(
        { error: 'مطلوب بريد إلكتروني صالح لإتمام عملية الدفع' },
        { status: 400 }
      );
    }

    const user = jsonDb.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Update user record with payment flags
    const updated = jsonDb.updateUser(email, {
      hasPaid: true,
      paymentTimestamp: Date.now(),
      subscriptionStatus: 'paid'
    });

    return NextResponse.json({
      success: true,
      message: 'تم تفعيل الدفع بنجاح',
      user: {
        email: updated?.email,
        hasPaid: updated?.hasPaid,
        paymentTimestamp: updated?.paymentTimestamp,
        subscriptionStatus: updated?.subscriptionStatus
      }
    });
  } catch (error: any) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      { error: 'فشلت معالجة الدفع' },
      { status: 500 }
    );
  }
}
