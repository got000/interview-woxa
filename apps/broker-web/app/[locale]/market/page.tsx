import type { Metadata } from 'next';
import { resolveLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/translations';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return { title: dict.market.title };
}

export default async function MarketPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return (
    <div className="flex flex-col gap-10 px-6 pt-8 sm:px-10 lg:px-30 mb-2">
      <div>
        <h1 className="font-serif text-4xl font-bold text-slate-100">
          {dict.market.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          {dict.market.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dict.market.items.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-slate-800 bg-slate-900 p-6"
          >
            <h2 className="font-serif text-lg font-bold text-slate-100">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
