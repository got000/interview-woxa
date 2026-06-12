import { Dispatch, SetStateAction } from 'react';
import { BROKER_TYPES, BrokerType, CreateBrokerInput } from '@/lib/types';
import { Dictionary } from '@/lib/i18n/translations';
import { RegionSelect } from '@/components/broker/region-select';

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken';

export const inputClass =
  'w-full rounded border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-sky-400 focus:outline-none';

const invalidInputClass =
  'w-full rounded border border-red-500 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-red-400 focus:outline-none';

export function Field({
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

export function BrokerFormFields({
  form,
  setForm,
  dict,
  slugStatus,
  slugErrorMessage,
  logoUrlValid,
  websiteValid,
  emailValid,
}: {
  form: CreateBrokerInput;
  setForm: Dispatch<SetStateAction<CreateBrokerInput>>;
  dict: Dictionary;
  slugStatus: SlugStatus;
  slugErrorMessage?: string | null;
  logoUrlValid: boolean;
  websiteValid: boolean;
  emailValid: boolean;
}) {
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

  const slugInvalid = slugStatus === 'taken';

  return (
    <>
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
              className={slugInvalid ? invalidInputClass : inputClass}
              aria-invalid={slugInvalid}
            />
            {slugStatus === 'checking' && (
              <span className="text-xs text-slate-500">
                {dict.create.slugChecking}
              </span>
            )}
            {slugStatus === 'taken' && (
              <span className="text-xs text-red-400">
                {slugErrorMessage ?? dict.create.slugTaken}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={dict.create.address}>
            <textarea
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
              rows={2}
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
        </div>
      </fieldset>
    </>
  );
}
