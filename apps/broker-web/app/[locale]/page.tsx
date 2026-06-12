import Link from 'next/link';
import { auth } from '@/auth';
import { getBrokers } from '@/lib/api/broker';
import { ApiError } from '@/lib/api/client';
import { BrokerType, PaginatedResponse, Broker } from '@/lib/types';
import { BrokerFilters } from '@/components/broker/broker-filters';
import { BrokerPagination } from '@/components/broker/broker-pagination';
import { BrokerCard } from '@/components/broker/broker-card';
import { RateLimitNotice } from '@/components/rate-limit-notice';
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

  const session = await auth();
  const isLoggedIn = Boolean(session?.accessToken);

  let data: PaginatedResponse<Broker> | undefined;
  let rateLimited = false;

  try {
    data = await getBrokers({
      search,
      type: (type as BrokerType) ?? '',
      status: isLoggedIn ? undefined : 'active',
      limit: 9,
      skip: Number(page) || 1,
    });
  } catch (err) {
    if (err instanceof ApiError && err.code === 'TOO_MANY_REQUESTS') {
      rateLimited = true;
    } else {
      throw err;
    }
  }

  const brokers = data?.result ?? [];

  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.total_pages ?? 0;
  const currentPage = data?.pagination?.current_page ?? 1;

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
    <div className="mx-auto w-full max-w-8xl flex-1 px-6 pt-8 sm:px-10 lg:px-30 mb-2">
      <h1 className="font-serif text-4xl font-bold text-slate-100">
        {dict.home.title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">
        {dict.home.description}
      </p>

      <div className="mt-8">
        <BrokerFilters />
      </div>

      {rateLimited && <RateLimitNotice dict={dict} />}

      {!rateLimited && total === 0 && (
        <p className="mb-6 text-slate-500">{dict.home.noBrokers}</p>
      )}

      {!rateLimited && (total > 0 || showPartnerCard) && (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {brokers.map((broker) => (
            <BrokerCard
              key={broker._id}
              broker={broker}
              isLoggedIn={isLoggedIn}
            />
          ))}

          {showPartnerCard && (
            <Link
              href={`/${locale}/create`}
              className={`flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-slate-700 p-8 text-center transition-colors hover:border-sky-400 ${
                partnerCardAlone ? 'lg:min-h-[29rem]' : ''
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

      {!rateLimited && (
        <BrokerPagination
          currentPage={currentPage}
          totalPages={effectiveTotalPages}
        />
      )}
    </div>
  );
}
