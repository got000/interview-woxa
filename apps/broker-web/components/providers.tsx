'use client';

import { SessionProvider } from 'next-auth/react';
import { Locale } from '@/lib/i18n/config';
import { LocaleProvider } from '@/lib/i18n/locale-context';

export function Providers({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
    </SessionProvider>
  );
}
