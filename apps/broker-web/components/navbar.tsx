'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useLocale } from '@/lib/i18n/locale-context';
import { LanguageSwitcher } from './language-switcher';

export function Navbar() {
  const { data: session, status } = useSession();
  const { locale, dict } = useLocale();
  const pathname = usePathname();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isHome =
    pathname === `/${locale}` ||
    pathname === `/${locale}/` ||
    pathname.startsWith(`/${locale}/broker/`) ||
    pathname.startsWith(`/${locale}/create`);

  const isMarket = pathname.startsWith(`/${locale}/market`);
  const isAnalysis = pathname.startsWith(`/${locale}/analysis`);
  const isEducation = pathname.startsWith(`/${locale}/education`);

  const navLinkClass = (active: boolean) =>
    `pb-1 transition-colors ${
      active
        ? 'border-b-2 border-sky-400 text-white'
        : 'border-b-2 border-transparent text-slate-300 hover:text-white'
    }`;

  return (
    <header className="bg-slate-950">
      <nav className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4 sm:grid sm:grid-cols-3 sm:px-10">
        <Link href={`/${locale}`} className="justify-self-start text-xl font-bold text-sky-300">
          Woxa
        </Link>

        <div className="hidden items-center justify-center gap-8 text-sm font-medium sm:flex">
          <Link href={`/${locale}`} className={navLinkClass(isHome)}>
            {dict.nav.brokers}
          </Link>
          <Link href={`/${locale}/market`} className={navLinkClass(isMarket)}>
            {dict.nav.markets}
          </Link>
          <Link href={`/${locale}/analysis`} className={navLinkClass(isAnalysis)}>
            {dict.nav.analysis}
          </Link>
          <Link href={`/${locale}/education`} className={navLinkClass(isEducation)}>
            {dict.nav.education}
          </Link>
        </div>

        <div className="flex items-center justify-end gap-4">
          {status === 'authenticated' && (
            <Link
              href={`/${locale}/create`}
              className="hidden items-center gap-1.5 rounded bg-gradient-to-r from-sky-200 to-blue-500 px-3 py-1.5 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90 sm:inline-flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              {dict.nav.createBroker}
            </Link>
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

          {status === 'authenticated' && (
            <button
              type="button"
              aria-label="Notifications"
              className="text-slate-300 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M12 22a2.25 2.25 0 0 0 2.236-2h-4.472A2.25 2.25 0 0 0 12 22Z" />
                <path
                  fillRule="evenodd"
                  d="M12 2a6.5 6.5 0 0 0-6.5 6.5v2.69c0 .55-.16 1.087-.46 1.546L3.6 14.74c-.83 1.27.066 2.96 1.582 2.96h13.636c1.516 0 2.412-1.69 1.582-2.96l-1.44-2.004A2.78 2.78 0 0 1 18.5 11.19V8.5A6.5 6.5 0 0 0 12 2Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          {status === 'authenticated' && (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                aria-label="Account"
                aria-expanded={accountMenuOpen}
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="text-slate-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 z-20 mt-2 w-48 rounded border border-slate-800 bg-slate-900 py-2 shadow-lg">
                  <p className="truncate px-4 py-1.5 text-sm font-medium text-slate-100">
                    {session?.user?.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      signOut({ callbackUrl: `/${locale}` });
                    }}
                    className="block w-full px-4 py-1.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    {dict.nav.logout}
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="text-slate-300 hover:text-white sm:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              {mobileMenuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-slate-800 px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium">
            <Link href={`/${locale}`} className={navLinkClass(isHome)}>
              {dict.nav.brokers}
            </Link>
            <Link href={`/${locale}/market`} className={navLinkClass(isMarket)}>
              {dict.nav.markets}
            </Link>
            <Link href={`/${locale}/analysis`} className={navLinkClass(isAnalysis)}>
              {dict.nav.analysis}
            </Link>
            <Link href={`/${locale}/education`} className={navLinkClass(isEducation)}>
              {dict.nav.education}
            </Link>

            {status === 'authenticated' && (
              <Link href={`/${locale}/create`} className={navLinkClass(false)}>
                {dict.nav.createBroker}
              </Link>
            )}

            {status === 'unauthenticated' && (
              <>
                <Link href={`/${locale}/login`} className={navLinkClass(false)}>
                  {dict.nav.login}
                </Link>
                <Link href={`/${locale}/register`} className={navLinkClass(false)}>
                  {dict.nav.register}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
