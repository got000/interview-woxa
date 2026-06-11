import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { LoginForm } from '@/components/login-form';
import { resolveLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/translations';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return { title: dict.login.title };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return (
    <div className="flex w-full flex-col items-center py-16">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/image/skyscraper.webp"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/80" />
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <h1 className="text-center font-serif text-4xl font-bold text-sky-200">
          {dict.login.brandName}
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">
          {dict.login.brandSubtitle}
        </p>

        <div className="mt-8 w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900/90 backdrop-blur">
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon/shield.svg" className="h-3.5 w-3.5" alt="" />
            {dict.login.tlsEncryption}
          </span>
          <span className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon/shield.svg" className="h-3.5 w-3.5" alt="" />
            {dict.login.biometricReady}
          </span>
        </div>
      </div>
    </div>
  );
}
