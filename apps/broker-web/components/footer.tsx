'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';

export function Footer() {
  const { locale, dict } = useLocale();

  return (
    <footer className="bg-slate-950">
      <div className="mx-auto grid max-w-8xl grid-cols-1 items-center gap-4 px-6 py-3 text-xl sm:grid-cols-3 sm:px-10">
        <Link
          href={`/${locale}`}
          className="justify-self-center text-base font-bold text-sky-300 sm:justify-self-start"
        >
          Woxa
        </Link>

        <div className="flex flex-wrap items-center justify-start gap-6 text-xs uppercase tracking-wider text-slate-400">
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

        <span className="justify-self-center text-xs text-slate-500 sm:justify-self-end">
          {dict.footer.copyright}
        </span>
      </div>

      <div className="mx-auto max-w-8xl px-10 pb-3 text-center text-[11px] leading-relaxed text-slate-600">
        {dict.footer.demoNotice}
      </div>
    </footer>
  );
}
