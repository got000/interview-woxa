import Link from 'next/link';
import { getBrokers } from '@/lib/api';
import { BrokerType } from '@/lib/types';
import { BrokerFilters } from '@/components/broker-filters';
import { BrokerPagination } from '@/components/broker-pagination';
import { resolveLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/translations';

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; type?: string; page?: string }>;
}) {
  const { search, type, page } = await searchParams;
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = getDictionary(locale);

  const data = await getBrokers({
    search,
    type: (type as BrokerType) ?? '',
    limit: 9,
    skip: Number(page) || 1,
  });

  const brokers = data.result ?? [];

  const total = data.pagination?.total ?? 0;
  const totalPages = data.pagination?.total_pages ?? 0;
  const currentPage = data.pagination?.current_page ?? 1;

  // If the last page is completely full (9 brokers), push the
  // "Partner with Us" card onto its own extra page instead of
  // overflowing the grid.
  const lastPageFull = total > 0 && total % 9 === 0;
  const effectiveTotalPages = lastPageFull ? totalPages + 1 : totalPages;
  const showPartnerCard = total === 0 || currentPage === effectiveTotalPages;
  // When the partner card lands alone on its own row (3-column grid),
  // give it the height of two card rows so it doesn't look tiny.
  const partnerCardAlone = brokers.length % 3 === 0;

  return (
    <div className="mx-auto w-full max-w-8xl flex-1 px-12 mb-2">
      <h1 className="font-serif text-4xl font-bold text-slate-100">
        {dict.home.title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">
        {dict.home.description}
      </p>

      <div className="mt-8">
        <BrokerFilters />
      </div>

      {total === 0 && (
        <p className="mb-6 text-slate-500">{dict.home.noBrokers}</p>
      )}

      {(total > 0 || showPartnerCard) && (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {brokers.map((broker) => (
            <Link
              key={broker._id}
              href={`/${locale}/broker/${broker.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900 transition-colors hover:border-slate-700"
            >
              <div className="relative h44 sm:h50 lg:h-90 w-full overflow-hidden bg-slate-800">
                {broker.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={broker.logo_url}
                    alt={broker.name[locale]}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-600">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/icon/building.svg"
                      className="h-10 w-10"
                      alt=""
                    />
                  </div>
                )}
                {broker.region && (
                  <span className="absolute right-3 top-3 rounded bg-slate-950/70 px-2 py-1 text-xs uppercase tracking-wider text-slate-200 backdrop-blur">
                    {broker.region}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="font-serif text-lg font-bold text-slate-100">
                  {broker.name[locale]}
                </h2>
                <p className="line-clamp-3 text-sm text-slate-400">
                  {broker.desc[locale]}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
                  <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/icon/shield.svg"
                      className="h-3.5 w-3.5"
                      alt=""
                    />
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

          {showPartnerCard && (
            <Link
              href={`/${locale}/create`}
              className={`flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-slate-700 p-8 text-center transition-colors hover:border-sky-400 ${
                partnerCardAlone ? 'lg:min-h-[34rem]' : ''
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-sky-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon/handshake.svg" className="h-6 w-6" alt="" />
              </span>
              <h2 className="font-serif text-lg font-bold text-slate-100">
                {dict.home.partnerTitle}
              </h2>
              <p className="text-sm text-slate-400">
                {dict.home.partnerDescription}
              </p>
              <span className="rounded bg-sky-200 px-4 py-2 text-sm font-semibold text-slate-900">
                {dict.home.inquireNow}
              </span>
            </Link>
          )}
        </div>
      )}

      <BrokerPagination
        currentPage={currentPage}
        totalPages={effectiveTotalPages}
      />
    </div>
  );
}
