'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkSlugAvailableAction, createBrokerAction } from '@/lib/actions/broker';
import { CreateBrokerInput } from '@/lib/types';
import { useLocale } from '@/lib/i18n/locale-context';
import { useToast } from '@/lib/toast/toast-context';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { isValidUrl, isValidEmail } from '@/lib/validation';
import { resolveErrorMessage } from '@/lib/error-message';
import { BrokerFormFields } from '@/components/broker/broker-form-fields';

const emptyForm: CreateBrokerInput = {
  name: { th: '', us: '' },
  desc: { th: '', us: '' },
  slug: '',
  broker_type: 'cfd',
  logo_url: '',
  region: '',
  content_detail: {
    title: { th: '', us: '' },
    paragraph: [{ th: '', us: '' }],
  },
  contact_detail: {
    address: '',
    email: '',
    web_site: '',
  },
};

export function BrokerForm() {
  const router = useRouter();
  const { locale, dict } = useLocale();
  const { showToast } = useToast();
  const [form, setForm] = useState<CreateBrokerInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [slugStatus, setSlugStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle');
  const debouncedSlug = useDebounce(form.slug, 400);

  const logoUrlValid = form.logo_url === '' || isValidUrl(form.logo_url);
  const websiteValid =
    form.contact_detail.web_site === '' ||
    isValidUrl(form.contact_detail.web_site);
  const emailValid =
    form.contact_detail.email === '' || isValidEmail(form.contact_detail.email);

  useEffect(() => {
    const slug = debouncedSlug.trim();
    if (!slug) {
      setSlugStatus('idle');
      return;
    }

    let cancelled = false;
    setSlugStatus('checking');

    checkSlugAvailableAction(slug).then((available) => {
      if (cancelled) return;
      setSlugStatus(available ? 'available' : 'taken');
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedSlug]);

  const canSubmit =
    slugStatus !== 'taken' &&
    slugStatus !== 'checking' &&
    logoUrlValid &&
    websiteValid &&
    emailValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      return;
    }

    setLoading(true);

    const result = await createBrokerAction(form);

    setLoading(false);

    if (!result.success) {
      const message = resolveErrorMessage(result, dict);
      setError(message);
      showToast('error', message);
      if (result.code === 'SLUG_ALREADY_EXISTS') {
        setSlugStatus('taken');
      }
      return;
    }

    showToast('success', dict.toast.brokerCreateSuccess);
    router.push(`/${locale}`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <BrokerFormFields
        form={form}
        setForm={setForm}
        dict={dict}
        slugStatus={slugStatus}
        logoUrlValid={logoUrlValid}
        websiteValid={websiteValid}
        emailValid={emailValid}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-end gap-6 border-t border-slate-800 pt-6">
        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="rounded bg-gradient-to-r from-sky-200 to-blue-500 px-6 py-2.5 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? dict.create.submitting : dict.create.submit}
        </button>
      </div>
    </form>
  );
}
