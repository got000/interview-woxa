'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';

export function Footer() {
  const { locale, dict } = useLocale();

  return (
    <footer className="bg-slate-950">
      <div className="mx-auto flex max-w-8xl flex-wrap items-center justify-between gap-4 px-10 py-3 text-xl">
        <Link href={`/${locale}`} className="text-base font-bold text-sky-300">
          Woxa
        </Link>

        <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-wider text-slate-400">
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

        <span className="text-xs text-slate-500">{dict.footer.copyright}</span>
      </div>
    </footer>
  );
}
