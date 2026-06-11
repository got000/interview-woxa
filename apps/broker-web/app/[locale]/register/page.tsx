import Link from 'next/link';
import { RegisterForm } from '@/components/register-form';
import { resolveLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/translations';

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-10">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-sky-200">
            <BankIcon />
            {dict.register.brandLabel}
          </div>

          <div>
            <h1 className="font-serif text-3xl font-bold leading-tight text-slate-100 sm:text-4xl">
              {dict.register.panelTitle}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {dict.register.panelDescription}
            </p>
          </div>

          <div className="flex gap-10">
            <div>
              <p className="font-serif text-2xl font-bold text-sky-200">{dict.register.statCapitalValue}</p>
              <p className="text-xs uppercase tracking-wider text-slate-500">{dict.register.statCapitalLabel}</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-sky-200">{dict.register.statUptimeValue}</p>
              <p className="text-xs uppercase tracking-wider text-slate-500">{dict.register.statUptimeLabel}</p>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col justify-center gap-10 px-10 py-10">
          <div>
            <h2 className="font-serif text-2xl text-slate-100">{dict.register.heading}</h2>
            <p className="mt-2 text-sm text-slate-400">{dict.register.description}</p>
          </div>

          <RegisterForm />

          <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-300">
            {dict.register.haveAccount}{' '}
            <Link href={`/${locale}/login`} className="text-sky-400 hover:underline">
              {dict.register.loginLink}
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span>{dict.register.aesEncrypted}</span>
            <span>{dict.register.gdprCompliant}</span>
            <span>{dict.register.secFramework}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BankIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M4 21V10m4 11V10m4 11V10m4 11V10m4 11V10M2 10l10-6 10 6M5 10h14" />
    </svg>
  );
}
