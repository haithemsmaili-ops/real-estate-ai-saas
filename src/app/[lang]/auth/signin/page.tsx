'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function SignInPage() {
  const { lang } = useParams() as { lang: string };
  const [dict, setDict] = useState<any>(null);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    getDictionary(lang as any).then(setDict);
  }, [lang]);

  if (!dict) return null;
  const t = dict.auth;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-surface-100 to-surface-200 p-4">
      <div className="w-full max-w-md rounded-xl bg-white/80 p-6 shadow-lg backdrop-blur-xl">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <Link href={`/${lang}`}>
            <h1 className="text-2xl font-bold text-brand-600">PropAI</h1>
          </Link>
          <h2 className="text-xl font-semibold text-surface-900">
            {isRegister ? t.registerTitle : t.signInTitle}
          </h2>
        </div>

        {/* زر جوجل */}
        <Button variant="outline" className="w-full mb-4 flex items-center justify-center gap-2">
          <svg className="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.21l6.87-6.87C36.87 2.94 30.8 0 24 0 14.62 0 6.59 5.39 2.64 13.11l7.86 6.1C12.55 12.72 17.81 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.1 24.5c0-1.53-.14-3.02-.38-4.46H24v8.44h12.44c-.53 2.84-2.15 5.25-4.58 6.86v5.71h7.39c4.33-4 6.85-9.87 6.85-16.55z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.92-2.15 15.89-5.84l-7.39-5.71c-2.02 1.36-4.6 2.16-8.5 2.16-6.53 0-12.07-4.4-14.05-10.29H2.34v6.48C6.3 42.62 14.33 48 24 48z" />
            <path fill="#FBBC05" d="M9.95 28.31c-.5-1.5-.78-3.09-.78-4.81s.28-3.31.78-4.81V12.21H2.34C.84 15.25 0 18.93 0 22.5s.84 7.25 2.34 10.29l7.61-5.48z" />
          </svg>
          {t.continueWithGoogle}
        </Button>

        {/* نموذج البيانات */}
        <form className="space-y-4">
          {isRegister && (
            <>
              <Input name="firstName" placeholder={t.firstNamePlaceholder} />
              <Input name="lastName" placeholder={t.lastNamePlaceholder} />
            </>
          )}
          <Input name="email" type="email" placeholder={t.emailPlaceholder} />
          <Input name="password" type="password" placeholder={t.passwordPlaceholder} />
          <Button type="submit" className="w-full">
            {isRegister ? t.registerButton : t.signInButton}
          </Button>
        </form>

        {/* زر التبديل بين تسجيل الدخول وإنشاء حساب */}
        <div className="mt-4 text-center text-sm text-surface-600">
          <button type="button" onClick={() => setIsRegister(!isRegister)} className="underline hover:text-brand-600">
            {isRegister ? t.haveAccount : t.noAccount}
          </button>
        </div>
      </div>
    </div>
  );
}