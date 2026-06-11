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
      <h1 className="mb-6 text-2xl font-semibold">{dict.create.title}</h1>
      <BrokerForm />
    </div>
  );
}
