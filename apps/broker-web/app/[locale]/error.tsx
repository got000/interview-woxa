'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale, dict } = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="font-serif text-2xl font-bold text-slate-100">
        {dict.common.errorTitle}
      </h1>
      <p className="max-w-md text-sm text-slate-400">
        {dict.common.errorDescription}
      </p>
      <div className="mt-2 flex items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded bg-gradient-to-r from-sky-200 to-blue-500 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90"
        >
          {dict.common.tryAgain}
        </button>
        <Link
          href={`/${locale}`}
          className="rounded border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-800"
        >
          {dict.common.backHome}
        </Link>
      </div>
    </div>
  );
}
