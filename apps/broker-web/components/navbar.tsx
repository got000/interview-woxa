'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useLocale } from '@/lib/i18n/locale-context';
import { LanguageSwitcher } from './language-switcher';

export function Navbar() {
  const { data: session, status } = useSession();
  const { locale, dict } = useLocale();
  const pathname = usePathname();

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const navLinkClass = (active: boolean) =>
    `pb-1 transition-colors ${
      active
        ? 'border-b-2 border-sky-400 text-white'
        : 'border-b-2 border-transparent text-slate-300 hover:text-white'
    }`;

  return (
    <header className="bg-slate-950">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="text-xl font-bold text-sky-300">
          Woxa
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium sm:flex">
          <Link href={`/${locale}`} className={navLinkClass(isHome)}>
            {dict.nav.brokers}
          </Link>
          <Link href="#" className={navLinkClass(false)}>
            {dict.nav.markets}
          </Link>
          <Link href="#" className={navLinkClass(false)}>
            {dict.nav.analysis}
          </Link>
          <Link href="#" className={navLinkClass(false)}>
            {dict.nav.education}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {status === 'authenticated' && (
            <>
              <Link
                href={`/${locale}/create`}
                className="hidden rounded border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800 sm:inline-block"
              >
                {dict.nav.createBroker}
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="hidden rounded bg-sky-400 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-sky-300 sm:inline-block"
              >
                {dict.nav.logout}
              </button>
            </>
          )}

          {status === 'unauthenticated' && (
            <>
              <Link
                href={`/${locale}/login`}
                className="hidden text-sm text-slate-300 hover:text-white sm:inline-block"
              >
                {dict.nav.login}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="hidden rounded bg-sky-400 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-sky-300 sm:inline-block"
              >
                {dict.nav.register}
              </Link>
            </>
          )}

          <LanguageSwitcher />

          <button
            type="button"
            aria-label="Notifications"
            className="text-slate-300 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12 22a2.25 2.25 0 0 0 2.236-2h-4.472A2.25 2.25 0 0 0 12 22Z" />
              <path
                fillRule="evenodd"
                d="M12 2a6.5 6.5 0 0 0-6.5 6.5v2.69c0 .55-.16 1.087-.46 1.546L3.6 14.74c-.83 1.27.066 2.96 1.582 2.96h13.636c1.516 0 2.412-1.69 1.582-2.96l-1.44-2.004A2.78 2.78 0 0 1 18.5 11.19V8.5A6.5 6.5 0 0 0 12 2Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <Link
            href={status === 'authenticated' ? `/${locale}/create` : `/${locale}/login`}
            aria-label="Account"
            className="text-slate-300 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
