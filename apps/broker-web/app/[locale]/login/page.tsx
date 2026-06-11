import Link from 'next/link';
import { LoginForm } from '@/components/login-form';
import { resolveLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/translations';

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center py-8">
      <h1 className="text-center font-serif text-4xl font-bold text-sky-200">
        {dict.login.brandName}
      </h1>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">
        {dict.login.brandSubtitle}
      </p>

      <div className="mt-8 w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
        <div className="h-1 bg-gradient-to-r from-sky-200 to-blue-500" />
        <div className="flex flex-col gap-10 px-10 pt-10 pb-14">
          <div>
            <h2 className="font-serif text-2xl text-slate-100">{dict.login.heading}</h2>
            <p className="mt-2 text-sm text-slate-400">{dict.login.description}</p>
          </div>

          <LoginForm />

          <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-300">
            {dict.login.noAccount}{' '}
            <Link href={`/${locale}/register`} className="text-sky-400 hover:underline">
              {dict.login.registerLink}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldIcon />
          {dict.login.tlsEncryption}
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldIcon />
          {dict.login.biometricReady}
        </span>
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
      <path d="M12 3 4.5 6v5c0 4.5 3 7.5 7.5 9 4.5-1.5 7.5-4.5 7.5-9V6L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
    </svg>
  );
}
