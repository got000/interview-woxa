'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';

export function Footer() {
  const { locale, dict } = useLocale();

  return (
    <footer className="bg-slate-950">
      <div className="mx-auto flex max-w-8xl flex-col items-center gap-4 px-6 py-3 text-xl sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link href={`/${locale}`} className="text-base font-bold text-sky-300">
            Woxa
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-wider text-slate-400 sm:justify-start sm:gap-6">
            <Link href="#" className="hover:text-white">
              {dict.footer.privacyPolicy}
            </Link>
            <Link href="#" className="hover:text-white">
              {dict.footer.termsOfService}
            </Link>
            <Link href="#" className="hover:text-white">
              {dict.footer.riskDisclosure}
            </Link>
            <Link href="#" className="hover:text-white">
              {dict.footer.contact}
            </Link>
          </div>
        </div>

        <span className="text-xs text-slate-500">{dict.footer.copyright}</span>
      </div>

      <div className="mx-auto max-w-8xl px-10 pb-3 text-center text-[11px] leading-relaxed text-slate-600">
        {dict.footer.demoNotice}
      </div>
    </footer>
  );
}
