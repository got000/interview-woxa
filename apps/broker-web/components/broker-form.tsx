'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkSlugAvailableAction, createBrokerAction } from '@/lib/actions';
import { BROKER_TYPES, BrokerType, CreateBrokerInput } from '@/lib/types';
import { useLocale } from '@/lib/i18n/locale-context';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { isValidUrl } from '@/lib/validation';

const emptyForm: CreateBrokerInput = {
  name: { th: '', en: '' },
  desc: { th: '', en: '' },
  slug: '',
  broker_type: 'cfd',
  logo_url: '',
  region: '',
  content_detail: {
    title: { th: '', en: '' },
    paragraph: [{ th: '', en: '' }],
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
  const [form, setForm] = useState<CreateBrokerInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const debouncedSlug = useDebounce(form.slug, 400);

  const logoUrlValid = form.logo_url === '' || isValidUrl(form.logo_url);
  const websiteValid = form.contact_detail.web_site === '' || isValidUrl(form.contact_detail.web_site);

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

  const canSubmit = slugStatus !== 'taken' && slugStatus !== 'checking' && logoUrlValid && websiteValid;

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
      return;
    }

    router.push(`/${locale}`);
    router.refresh();
  };

  const addParagraph = () => {
    setForm((prev) => ({
      ...prev,
      content_detail: {
        ...prev.content_detail,
        paragraph: [...prev.content_detail.paragraph, { th: '', en: '' }],
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

  const updateParagraph = (index: number, lang: 'th' | 'en', value: string) => {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-lg font-semibold">{dict.create.basicInfo}</legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={dict.create.nameTh}>
            <input
              required
              value={form.name.th}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: { ...p.name, th: e.target.value } }))
              }
              className={inputClass}
            />
          </Field>
          <Field label={dict.create.nameEn}>
            <input
              required
              value={form.name.en}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: { ...p.name, en: e.target.value } }))
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
                setForm((p) => ({ ...p, desc: { ...p.desc, th: e.target.value } }))
              }
              className={inputClass}
              rows={2}
            />
          </Field>
          <Field label={dict.create.descEn}>
            <textarea
              required
              value={form.desc.en}
              onChange={(e) =>
                setForm((p) => ({ ...p, desc: { ...p.desc, en: e.target.value } }))
              }
              className={inputClass}
              rows={2}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label={dict.create.slug}>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className={inputClass}
              aria-invalid={slugStatus === 'taken'}
            />
            {slugStatus === 'checking' && (
              <span className="text-xs text-zinc-500">{dict.create.slugChecking}</span>
            )}
            {slugStatus === 'taken' && (
              <span className="text-xs text-red-600">{dict.create.slugTaken}</span>
            )}
            {slugStatus === 'available' && (
              <span className="text-xs text-green-600">{dict.create.slugAvailable}</span>
            )}
          </Field>

          <Field label={dict.create.brokerType}>
            <select
              value={form.broker_type}
              onChange={(e) =>
                setForm((p) => ({ ...p, broker_type: e.target.value as BrokerType }))
              }
              className={inputClass}
            >
              {BROKER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </Field>

          <Field label={dict.create.region}>
            <input
              required
              value={form.region}
              onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label={dict.create.logoUrl}>
          <input
            required
            value={form.logo_url}
            onChange={(e) => setForm((p) => ({ ...p, logo_url: e.target.value }))}
            className={inputClass}
            aria-invalid={!logoUrlValid}
          />
          {!logoUrlValid && <span className="text-xs text-red-600">{dict.create.invalidUrl}</span>}
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-lg font-semibold">{dict.create.contentDetail}</legend>

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
              value={form.content_detail.title.en}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  content_detail: {
                    ...p.content_detail,
                    title: { ...p.content_detail.title, en: e.target.value },
                  },
                }))
              }
              className={inputClass}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium">{dict.create.paragraphs}</span>
          {form.content_detail.paragraph.map((p, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-2 rounded border border-black/10 p-3 sm:grid-cols-2 dark:border-white/10"
            >
              <Field label={dict.create.paragraphTh.replace('{n}', String(index + 1))}>
                <textarea
                  required
                  value={p.th}
                  onChange={(e) => updateParagraph(index, 'th', e.target.value)}
                  className={inputClass}
                  rows={2}
                />
              </Field>
              <Field label={dict.create.paragraphEn.replace('{n}', String(index + 1))}>
                <textarea
                  required
                  value={p.en}
                  onChange={(e) => updateParagraph(index, 'en', e.target.value)}
                  className={inputClass}
                  rows={2}
                />
              </Field>
              {form.content_detail.paragraph.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="sm:col-span-2 text-left text-sm text-red-600"
                >
                  {dict.create.removeParagraph}
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addParagraph}
            className="self-start rounded border border-black/10 px-3 py-1.5 text-sm dark:border-white/10"
          >
            {dict.create.addParagraph}
          </button>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-lg font-semibold">{dict.create.contactDetail}</legend>

        <Field label={dict.create.address}>
          <input
            required
            value={form.contact_detail.address}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                contact_detail: { ...p.contact_detail, address: e.target.value },
              }))
            }
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={dict.create.email}>
            <input
              type="email"
              required
              value={form.contact_detail.email}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  contact_detail: { ...p.contact_detail, email: e.target.value },
                }))
              }
              className={inputClass}
            />
          </Field>
          <Field label={dict.create.website}>
            <input
              required
              value={form.contact_detail.web_site}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  contact_detail: { ...p.contact_detail, web_site: e.target.value },
                }))
              }
              className={inputClass}
              aria-invalid={!websiteValid}
            />
            {!websiteValid && <span className="text-xs text-red-600">{dict.create.invalidUrl}</span>}
          </Field>
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || !canSubmit}
        className="self-start rounded bg-zinc-900 px-5 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-black"
      >
        {loading ? dict.create.submitting : dict.create.submit}
      </button>
    </form>
  );
}

const inputClass =
  'w-full rounded border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-black';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
