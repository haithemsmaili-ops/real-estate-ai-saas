import { NextResponse } from 'next/server';
import { jsonDb } from '@/lib/db/json-db';
import { hashPassword } from '@/lib/utils/hash';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = jsonDb.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مسجل بالفعل' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);

    const newUser = {
      id: userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      authProvider: 'credentials' as const,
      subscriptionStatus: 'none' as const,
      hasPaid: false,
      createdAt: new Date().toISOString(),
    };

    jsonDb.addUser(newUser);

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        subscriptionStatus: newUser.subscriptionStatus,
        hasPaid: newUser.hasPaid,
      }
    });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع أثناء التسجيل' },
      { status: 500 }
    );
  }
}
