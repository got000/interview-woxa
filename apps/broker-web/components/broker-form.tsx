'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkSlugAvailableAction, createBrokerAction } from '@/lib/actions';
import { BROKER_TYPES, BrokerType, CreateBrokerInput } from '@/lib/types';
import { useLocale } from '@/lib/i18n/locale-context';
import { useToast } from '@/lib/toast/toast-context';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { isValidUrl, isValidEmail } from '@/lib/validation';
import { RegionSelect } from '@/components/region-select';

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
      setError(result.message);
      showToast('error', result.message);
      return;
    }

    showToast('success', dict.toast.brokerCreateSuccess);
    router.push(`/${locale}`);
    router.refresh();
  };

  const addParagraph = () => {
    setForm((prev) => ({
      ...prev,
      content_detail: {
        ...prev.content_detail,
        paragraph: [...prev.content_detail.paragraph, { th: '', us: '' }],
      },
    }));
  };

  const removeParagraph = (index: number) => {
    setForm((prev) => ({
      ...prev,
      content_detail: {
        ...prev.content_detail,
        paragraph: prev.content_detail.paragraph.filter((_, i) => i !== index),
      },
    }));
  };

  const updateParagraph = (index: number, lang: 'th' | 'us', value: string) => {
    setForm((prev) => ({
      ...prev,
      content_detail: {
        ...prev.content_detail,
        paragraph: prev.content_detail.paragraph.map((p, i) =>
          i === index ? { ...p, [lang]: value } : p,
        ),
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <legend>{dict.create.basicInfo}</legend>
      <fieldset className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={dict.create.nameTh}>
            <input
              required
              value={form.name.th}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  name: { ...p.name, th: e.target.value },
                }))
              }
              className={inputClass}
            />
          </Field>
          <Field label={dict.create.nameEn}>
            <input
              required
              value={form.name.us}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  name: { ...p.name, us: e.target.value },
                }))
              }
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={dict.create.descTh}>
            <textarea
              required
              value={form.desc.th}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  desc: { ...p.desc, th: e.target.value },
                }))
              }
              className={inputClass}
              rows={2}
            />
          </Field>
          <Field label={dict.create.descEn}>
            <textarea
              required
              value={form.desc.us}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  desc: { ...p.desc, us: e.target.value },
                }))
              }
              className={inputClass}
              rows={2}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={dict.create.slug}>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className={inputClass}
              aria-invalid={slugStatus === 'taken'}
            />
            {slugStatus === 'checking' && (
              <span className="text-xs text-slate-500">
                {dict.create.slugChecking}
              </span>
            )}
            {slugStatus === 'taken' && (
              <span className="text-xs text-red-400">
                {dict.create.slugTaken}
              </span>
            )}
            {slugStatus === 'available' && (
              <span className="text-xs text-green-400">
                {dict.create.slugAvailable}
              </span>
            )}
          </Field>

          <Field label={dict.create.region}>
            <RegionSelect
              value={form.region}
              onChange={(region) => setForm((p) => ({ ...p, region }))}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label={dict.create.brokerType}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BROKER_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  setForm((p) => ({ ...p, broker_type: t as BrokerType }))
                }
                className={
                  form.broker_type === t
                    ? 'rounded-lg border border-sky-400 bg-sky-400/10 px-4 py-3 text-sm font-semibold text-sky-300 transition-colors'
                    : 'rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600'
                }
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={dict.create.logoUrl}>
            <input
              required
              value={form.logo_url}
              onChange={(e) =>
                setForm((p) => ({ ...p, logo_url: e.target.value }))
              }
              className={inputClass}
              aria-invalid={!logoUrlValid}
            />
            {!logoUrlValid && (
              <span className="text-xs text-red-400">
                {dict.create.invalidUrl}
              </span>
            )}
          </Field>
          <Field label={dict.create.website}>
            <input
              required
              value={form.contact_detail.web_site}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  contact_detail: {
                    ...p.contact_detail,
                    web_site: e.target.value,
                  },
                }))
              }
              className={inputClass}
              aria-invalid={!websiteValid}
            />
            {!websiteValid && (
              <span className="text-xs text-red-400">
                {dict.create.invalidUrl}
              </span>
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-lg font-semibold text-slate-100">
          {dict.create.contentDetail}
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={dict.create.titleTh}>
            <input
              required
              value={form.content_detail.title.th}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  content_detail: {
                    ...p.content_detail,
                    title: { ...p.content_detail.title, th: e.target.value },
                  },
                }))
              }
              className={inputClass}
            />
          </Field>
          <Field label={dict.create.titleEn}>
            <input
              required
              value={form.content_detail.title.us}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  content_detail: {
                    ...p.content_detail,
                    title: { ...p.content_detail.title, us: e.target.value },
                  },
                }))
              }
              className={inputClass}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {dict.create.paragraphs}
          </span>
          {form.content_detail.paragraph.map((p, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-2 rounded border border-slate-800 p-3 sm:grid-cols-2"
            >
              <Field
                label={dict.create.paragraphTh.replace(
                  '{n}',
                  String(index + 1),
                )}
              >
                <textarea
                  required
                  value={p.th}
                  onChange={(e) => updateParagraph(index, 'th', e.target.value)}
                  className={inputClass}
                  rows={2}
                />
              </Field>
              <Field
                label={dict.create.paragraphEn.replace(
                  '{n}',
                  String(index + 1),
                )}
              >
                <textarea
                  required
                  value={p.us}
                  onChange={(e) => updateParagraph(index, 'us', e.target.value)}
                  className={inputClass}
                  rows={2}
                />
              </Field>
              {form.content_detail.paragraph.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="sm:col-span-2 text-left text-sm text-red-400"
                >
                  {dict.create.removeParagraph}
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addParagraph}
            className="self-start rounded border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-slate-600"
          >
            {dict.create.addParagraph}
          </button>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-lg font-semibold text-slate-100">
          {dict.create.contactDetail}
        </legend>

        <Field label={dict.create.address}>
          <input
            required
            value={form.contact_detail.address}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                contact_detail: {
                  ...p.contact_detail,
                  address: e.target.value,
                },
              }))
            }
            className={inputClass}
          />
        </Field>

        <Field label={dict.create.email}>
          <input
            type="email"
            required
            value={form.contact_detail.email}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                contact_detail: {
                  ...p.contact_detail,
                  email: e.target.value,
                },
              }))
            }
            className={inputClass}
            aria-invalid={!emailValid}
          />
          {!emailValid && (
            <span className="text-xs text-red-400">
              {dict.create.invalidEmail}
            </span>
          )}
        </Field>
      </fieldset>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-end gap-6 border-t border-slate-800 pt-6">
        <button
          type="button"
          onClick={() => router.push(`/${locale}`)}
          className="text-sm font-semibold text-slate-300 hover:text-slate-100"
        >
          {dict.create.cancel}
        </button>
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

const inputClass =
  'w-full rounded border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-sky-400 focus:outline-none';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}
