import Link from 'next/link';
import { getBrokers } from '@/lib/api';
import { BrokerType } from '@/lib/types';
import { BrokerFilters } from '@/components/broker-filters';
import { resolveLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/translations';

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; type?: string }>;
}) {
  const { search, type } = await searchParams;
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = getDictionary(locale);

  const data = await getBrokers({
    search,
    type: (type as BrokerType) ?? '',
    limit: 20,
  });

  const brokers = data.result ?? [];

  return (
    <div>
      <h1 className="font-serif text-4xl font-bold text-slate-100">{dict.home.title}</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">{dict.home.description}</p>

      <div className="mt-8">
        <BrokerFilters />
      </div>

      {brokers.length === 0 ? (
        <p className="text-slate-500">{dict.home.noBrokers}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brokers.map((broker) => (
            <Link
              key={broker._id}
              href={`/${locale}/broker/${broker.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900 transition-colors hover:border-slate-700"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                {broker.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={broker.logo_url}
                    alt={broker.name[locale]}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-600">
                    <BuildingIcon />
                  </div>
                )}
                {broker.region && (
                  <span className="absolute right-3 top-3 rounded bg-slate-950/70 px-2 py-1 text-xs uppercase tracking-wider text-slate-200 backdrop-blur">
                    {broker.region}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="font-serif text-lg font-bold text-slate-100">{broker.name[locale]}</h2>
                <p className="line-clamp-3 text-sm text-slate-400">{broker.desc[locale]}</p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
                  <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500">
                    <ShieldIcon />
                    {broker.broker_type}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-sky-400 group-hover:underline">
                    {dict.home.viewDetails}
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}

          <Link
            href={`/${locale}/create`}
            className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-slate-700 p-8 text-center transition-colors hover:border-sky-400"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-sky-300">
              <HandshakeIcon />
            </span>
            <h2 className="font-serif text-lg font-bold text-slate-100">{dict.home.partnerTitle}</h2>
            <p className="text-sm text-slate-400">{dict.home.partnerDescription}</p>
            <span className="rounded bg-sky-200 px-4 py-2 text-sm font-semibold text-slate-900">
              {dict.home.inquireNow}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
      <path d="M12 3 4.5 6v5c0 4.5 3 7.5 7.5 9 4.5-1.5 7.5-4.5 7.5-9V6L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V7l8-4 8 4v14M4 21h16M9 21v-6h6v6M9 11h.01M15 11h.01M9 7h.01M15 7h.01" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11 17 1.5 1.5a2.121 2.121 0 0 0 3-3L13 13M11 17l-2.5-2.5M11 17l-1.5 1.5a2.121 2.121 0 0 1-3-3L8 13m5 0 2.5-2.5a2.121 2.121 0 0 0-3-3L11 9m2 4-2-2m-3 2 3.5-3.5a2.121 2.121 0 0 0-3-3L7 8 4 11l4 4" />
    </svg>
  );
}
