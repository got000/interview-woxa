'use client';

import { SessionProvider } from 'next-auth/react';
import { Locale } from '@/lib/i18n/config';
import { LocaleProvider } from '@/lib/i18n/locale-context';
import { ToastProvider } from '@/lib/toast/toast-context';
import { ToastContainer } from '@/components/toast-container';

export function Providers({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LocaleProvider initialLocale={locale}>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </LocaleProvider>
    </SessionProvider>
  );
}
