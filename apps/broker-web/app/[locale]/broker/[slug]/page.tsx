import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBrokerBySlug } from '@/lib/api';
import { resolveLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/translations';

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const AVAILABLE_MARKETS: { key: 'forexPairs' | 'indices' | 'commodities' | 'equities' | 'sovereignBonds' | 'cryptoEtps'; value: string }[] = [
  { key: 'forexPairs', value: '80+' },
  { key: 'indices', value: '25' },
  { key: 'commodities', value: '18' },
  { key: 'equities', value: '4,000+' },
  { key: 'sovereignBonds', value: '12' },
  { key: 'cryptoEtps', value: '5' },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const broker = await getBrokerBySlug(slug);

  if (!broker) {
    return {
      title: 'Broker not found',
    };
  }

  return {
    title: broker.name[locale],
    description: broker.desc[locale],
  };
}

export default async function BrokerDetailPage({ params }: PageProps) {
  const { slug, locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const broker = await getBrokerBySlug(slug);
  const dict = getDictionary(locale);

  if (!broker) {
    notFound();
  }

  const metrics = broker.performance_metrics;

  return (
    <div className="-mx-6 flex flex-col gap-10">
      <div
        className="relative flex min-h-[420px] flex-col justify-end bg-slate-800 bg-cover bg-center px-6 py-10 sm:px-10"
        style={{ backgroundImage: `url(${broker.logo_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />

        <div className="relative flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded bg-sky-200 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-900">
              {dict.detail.gradeLabel}
            </span>
            <span className="text-sky-300" aria-hidden="true">
              ★★★★★
            </span>
          </div>

          <h1 className="font-serif text-4xl font-bold leading-tight text-slate-100 sm:text-5xl">
            {broker.name[locale]}
          </h1>

          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">{broker.desc[locale]}</p>

          <div className="mt-2 flex flex-wrap gap-3">
            <a
              href={broker.contact_detail.web_site}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-gradient-to-r from-sky-200 to-blue-500 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90"
            >
              {dict.detail.visitWebsite}
            </a>
            <a
              href="#"
              className="rounded border border-slate-700 bg-slate-900/60 px-5 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-800"
            >
              {dict.detail.downloadProspectus}
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <section>
              <h2 className="font-serif text-2xl font-bold text-slate-100">
                {broker.content_detail.title[locale]}
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {broker.content_detail.paragraph.map((p, index) => (
                  <p key={index} className="text-sm leading-relaxed text-slate-400">
                    {p[locale]}
                  </p>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sky-300">
                  <ShieldIcon />
                </span>
                <h3 className="mt-3 font-semibold text-slate-100">{dict.detail.complianceTitle}</h3>
                <p className="mt-1 text-sm text-slate-400">{dict.detail.complianceDescription}</p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sky-300">
                  <GaugeIcon />
                </span>
                <h3 className="mt-3 font-semibold text-slate-100">{dict.detail.executionTitle}</h3>
                <p className="mt-1 text-sm text-slate-400">{dict.detail.executionDescription}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {metrics && (
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                <h3 className="font-serif text-lg font-bold text-slate-100">{dict.detail.performanceMetrics}</h3>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">{dict.detail.aumGrowth}</p>
                    <p className="mt-1 text-xl font-bold text-slate-100">+{metrics.aum_growth}%</p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded bg-slate-800 text-sky-300">
                    <TrendIcon />
                  </span>
                </div>

                <div className="mt-5 border-t border-slate-800 pt-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{dict.detail.liquidityAccess}</p>
                  <p className="mt-1 text-xl font-bold text-slate-100">{metrics.liquidity_access}%</p>
                </div>

                <div className="mt-5 border-t border-slate-800 pt-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{dict.detail.clientRetention}</p>
                  <p className="mt-1 text-xl font-bold text-slate-100">{metrics.client_retention}%</p>
                </div>

                <a
                  href="#"
                  className="mt-6 block rounded border border-slate-700 py-2.5 text-center text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800"
                >
                  {dict.detail.viewFullAuditReport}
                </a>
              </div>
            )}

            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {dict.detail.contactDetails}
              </h3>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <PinIcon />
                  <span>{broker.contact_detail.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MailIcon />
                  <a href={`mailto:${broker.contact_detail.email}`} className="hover:text-sky-400">
                    {broker.contact_detail.email}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <GlobeIcon />
                  <a
                    href={broker.contact_detail.web_site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline"
                  >
                    {broker.contact_detail.web_site}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section>
          <h2 className="font-serif text-2xl font-bold text-slate-100">{dict.detail.availableMarkets}</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {AVAILABLE_MARKETS.map((market) => (
              <div key={market.key} className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-500">{dict.detail[market.key]}</p>
                <p className="mt-1 font-serif text-xl font-bold text-slate-100">{market.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M12 3 4.5 6v5c0 4.5 3 7.5 7.5 9 4.5-1.5 7.5-4.5 7.5-9V6L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0-9-9c0 2 .6 3.8 1.6 5.3M12 21a9 9 0 0 0 7.4-3.7M12 12l4-4M12 12v3" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17 9 11l4 4 8-8M21 9v6h-6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 9 6 9-6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M3 12h18M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
    </svg>
  );
}
