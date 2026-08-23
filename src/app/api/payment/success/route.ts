import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { jsonDb } from '@/lib/db/json-db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let email = session?.user?.email;

    if (!email) {
      const body = await req.json().catch(() => ({}));
      email = body.email;
    }

    if (!email) {
      return NextResponse.json(
        { error: 'مطلوب بريد إلكتروني صالح لإتمام عملية الدفع' },
        { status: 400 }
      );
    }

    const user = await jsonDb.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const updated = await jsonDb.updateUserPayment(email, true, Date.now(), 'paid');

    return NextResponse.json({
      success: true,
      message: 'تم تفعيل الدفع بنجاح',
      user: {
        email: updated?.email || email,
        hasPaid: updated?.hasPaid ?? true,
        paymentTimestamp: updated?.paymentTimestamp,
        subscriptionStatus: updated?.subscriptionStatus || 'paid',
      },
    });
  } catch (error: any) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      { error: 'فشلت معالجة الدفع' },
      { status: 500 }
    );
  }
}