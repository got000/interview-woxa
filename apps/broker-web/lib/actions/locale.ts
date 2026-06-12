'use server';

import { cookies } from 'next/headers';
import { Locale, LOCALE_COOKIE } from '../i18n/config';

export async function setLocaleAction(locale: Locale): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
}
