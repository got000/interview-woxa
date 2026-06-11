import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { BrokerForm } from '@/components/broker-form';
import { resolveLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/translations';

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
    <div>
      <h1 className="font-serif text-4xl font-bold text-slate-100">{dict.create.title}</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">{dict.create.description}</p>

      <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <BrokerForm />
      </div>
    </div>
  );
}
