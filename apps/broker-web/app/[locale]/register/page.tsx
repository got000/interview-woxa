import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { RegisterForm } from '@/components/register-form';
import { resolveLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/translations';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return { title: dict.register.title };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return (
    <div className="bg-slate-950">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Panel */}
        <div className="relative isolate hidden min-h-[720px] flex-col justify-end overflow-hidden px-14 pb-16 pt-24 lg:flex">
          <Image
            src="/image/skyscraper.webp"
            alt=""
            fill
            priority
            className="-z-20 object-cover"
          />

          <div className="absolute inset-0 -z-10 bg-slate-950/55" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/10 via-slate-950/50 to-slate-950/95" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/40 via-slate-950/20 to-slate-950/70" />

          <div className="mb-9 flex items-center gap-3 font-serif text-2xl font-bold text-sky-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon/bank.svg" className="h-4 w-4" alt="" />
            {dict.register.brandLabel}
          </div>

          <h1 className="max-w-[520px] font-serif text-5xl font-medium leading-[0.98] text-slate-100 xl:text-6xl">
            {dict.register.panelTitle}
          </h1>

          <p className="mt-8 max-w-[480px] text-lg leading-8 text-slate-300">
            {dict.register.panelDescription}
          </p>

          <div className="mt-20 flex gap-16">
            <div>
              <p className="font-serif text-3xl font-bold text-sky-200">
                {dict.register.statCapitalValue}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                {dict.register.statCapitalLabel}
              </p>
            </div>

            <div>
              <p className="font-serif text-3xl font-bold text-sky-200">
                {dict.register.statUptimeValue}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                {dict.register.statUptimeLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex min-h-full items-center justify-center bg-[#071b2f] px-6 py-12 lg:px-20">
          <div className="w-full max-w-[420px] min-h-full">
            <div className="mb-10">
              <h2 className="font-serif text-3xl font-medium text-slate-100">
                {dict.register.heading}
              </h2>
              <p className="mt-3 text-base leading-6 text-slate-300">
                {dict.register.description}
              </p>
            </div>

            <RegisterForm />

            <div className="mt-8 border-t border-slate-800 pt-8 text-center text-sm text-slate-300">
              {dict.register.haveAccount}{' '}
              <Link
                href={`/${locale}/login`}
                className="text-sky-300 hover:underline"
              >
                {dict.register.loginLink}
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] uppercase tracking-[0.22em] text-slate-600">
              <span>{dict.register.aesEncrypted}</span>
              <span>{dict.register.gdprCompliant}</span>
              <span>{dict.register.secFramework}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
