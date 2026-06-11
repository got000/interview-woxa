export type Locale = 'us' | 'th';

export const LOCALES: Locale[] = ['us', 'th'];
export const DEFAULT_LOCALE: Locale = 'us';
export const LOCALE_COOKIE = 'locale';

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as string[]).includes(value);
}

export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
