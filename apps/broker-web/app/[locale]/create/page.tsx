import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { BrokerForm } from '@/components/broker/broker-form';
import { resolveLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/translations';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return { title: dict.create.title };
}

export default async function CreateBrokerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  const session = await auth();

  if (!session?.accessToken) {
    redirect(`/${locale}/login`);
  }

  const dict = getDictionary(locale);

  return (
    <div className="mx-auto w-full max-w-8xl flex-1 px-6 pt-8 sm:px-10 mb-2 lg:px-30">
      <h1 className="font-serif text-4xl font-bold text-slate-100">
        {dict.create.title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">
        {dict.create.description}
      </p>

      <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <BrokerForm />
      </div>
    </div>
  );
}
