'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkSlugAvailableAction, updateBrokerAction } from '@/lib/actions';
import { Broker, CreateBrokerInput } from '@/lib/types';
import { useLocale } from '@/lib/i18n/locale-context';
import { useToast } from '@/lib/toast/toast-context';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { isValidUrl, isValidEmail } from '@/lib/validation';
import { BrokerFormFields } from '@/components/broker-form-fields';

function brokerToFormInput(broker: Broker): CreateBrokerInput {
  return {
    name: broker.name,
    desc: broker.desc,
    slug: broker.slug,
    broker_type: broker.broker_type,
    logo_url: broker.logo_url,
    region: broker.region,
    content_detail: broker.content_detail,
    contact_detail: broker.contact_detail,
  };
}

export function BrokerEditModal({
  broker,
  onClose,
}: {
  broker: Broker;
  onClose: () => void;
}) {
  const router = useRouter();
  const { dict } = useLocale();
  const { showToast } = useToast();
  const [form, setForm] = useState<CreateBrokerInput>(() =>
    brokerToFormInput(broker),
  );
  const [error, setError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
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

    checkSlugAvailableAction(slug, broker._id).then((available) => {
      if (cancelled) return;
      setSlugStatus(available ? 'available' : 'taken');
      setSlugError(null);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedSlug, broker._id]);

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

    const result = await updateBrokerAction(broker._id, form);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      showToast('error', result.message);
      if (result.code === 'SLUG_ALREADY_EXISTS') {
        setSlugStatus('taken');
        setSlugError(result.message);
      }
      return;
    }

    showToast('success', dict.toast.brokerUpdateSuccess);
    onClose();
    router.refresh();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="font-serif text-lg font-bold text-slate-100">
            {dict.create.editTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-6"
        >
          <BrokerFormFields
            form={form}
            setForm={setForm}
            dict={dict}
            slugStatus={slugStatus}
            slugErrorMessage={slugError}
            logoUrlValid={logoUrlValid}
            websiteValid={websiteValid}
            emailValid={emailValid}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex items-center justify-end gap-6 border-t border-slate-800 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-slate-300 hover:text-slate-100"
            >
              {dict.home.cancel}
            </button>
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="rounded bg-gradient-to-r from-sky-200 to-blue-500 px-6 py-2.5 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? dict.create.saving : dict.create.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
