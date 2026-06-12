'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BROKER_TYPES, BrokerType } from '@/lib/types';
import { useLocale } from '@/lib/i18n/locale-context';
import { useDebounce } from '@/lib/hooks/use-debounce';

const SEARCH_DEBOUNCE_MS = 400;

const TYPE_LABELS: Record<BrokerType, string> = {
  cfd: 'CFD',
  bond: 'Bond',
  stock: 'Stock',
  crypto: 'Crypto',
};

export function BrokerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dict } = useLocale();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [type, setType] = useState(searchParams.get('type') ?? '');
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const isFirstRender = useRef(true);

  const applyFilters = (nextSearch: string, nextType: string) => {
    const params = new URLSearchParams();
    if (nextSearch) params.set('search', nextSearch);
    if (nextType) params.set('type', nextType);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    applyFilters(debouncedSearch, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleTypeSelect = (nextType: string) => {
    setType(nextType);
    applyFilters(search, nextType);
  };

  return (
    <div className="mb-8 flex flex-col gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters(search, type);
        }}
      >
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={dict.home.searchPlaceholder}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 pl-12 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
          />
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {dict.home.assetFocus}
        </span>

        <button
          type="button"
          onClick={() => handleTypeSelect('')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            type === ''
              ? 'bg-sky-200 text-slate-900'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {dict.home.allTypes}
        </button>

        {BROKER_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTypeSelect(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              type === t
                ? 'bg-sky-200 text-slate-900'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>
    </div>
  );
}
