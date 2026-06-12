import { Dictionary } from '@/lib/i18n/translations';

export function RateLimitNotice({ dict }: { dict: Dictionary }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-6 py-12 text-center">
      <h2 className="font-serif text-lg font-bold text-slate-100">
        {dict.common.rateLimitTitle}
      </h2>
      <p className="max-w-md text-sm text-slate-400">
        {dict.common.rateLimitDescription}
      </p>
    </div>
  );
}
