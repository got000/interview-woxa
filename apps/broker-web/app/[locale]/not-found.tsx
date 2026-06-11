'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';

export default function NotFound() {
  const { locale, dict } = useLocale();

  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="font-serif text-2xl font-bold text-slate-100">
        {dict.common.notFoundTitle}
      </h1>
      <p className="max-w-md text-sm text-slate-400">
        {dict.common.notFoundDescription}
      </p>
      <Link
        href={`/${locale}`}
        className="mt-2 rounded bg-gradient-to-r from-sky-200 to-blue-500 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90"
      >
        {dict.common.backHome}
      </Link>
    </div>
  );
}
