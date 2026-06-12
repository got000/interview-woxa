'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { setLocaleAction } from '@/lib/actions/locale';
import { LOCALES, Locale } from '@/lib/i18n/config';
import { useLocale } from '@/lib/i18n/locale-context';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Locale;
    setLocale(next);

    const segments = pathname.split('/');
    if (LOCALES.includes(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const nextPath = segments.join('/') || '/';

    startTransition(async () => {
      await setLocaleAction(next);
      router.push(nextPath);
      router.refresh();
    });
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      disabled={isPending}
      aria-label="Language"
      className="rounded border border-slate-700 bg-transparent px-2 py-1 text-sm text-slate-200"
    >
      <option value="en">🇺🇸 EN</option>
      <option value="th">🇹🇭 TH</option>
    </select>
  );
}
