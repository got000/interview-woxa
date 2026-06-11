import { NextResponse } from 'next/server';
import { auth } from './auth';
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from './lib/i18n/config';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  if (!isLocale(maybeLocale)) {
    const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
    const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
    const url = new URL(`/${locale}${pathname}`, req.url);
    return NextResponse.redirect(url);
  }

  const locale = maybeLocale;
  const isCreatePage = segments[2] === 'create';

  if (isCreatePage && !req.auth) {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
