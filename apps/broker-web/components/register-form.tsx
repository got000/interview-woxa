'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerAction } from '@/lib/actions';
import { useLocale } from '@/lib/i18n/locale-context';

export function RegisterForm() {
  const router = useRouter();
  const { locale, dict } = useLocale();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await registerAction({
      full_name: fullName,
      email,
      password,
      confirm_password: confirmPassword,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.push(`/${locale}/login`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="full_name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {dict.register.fullName}
        </label>
        <input
          id="full_name"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={dict.register.fullNamePlaceholder}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-sky-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {dict.register.email}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.register.emailPlaceholder}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-sky-400 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {dict.register.password}
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-sky-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm_password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {dict.register.confirmPassword}
          </label>
          <input
            id="confirm_password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-sky-400 focus:outline-none"
          />
        </div>
      </div>

      <label htmlFor="agreement" className="flex items-start gap-3 text-sm text-slate-300">
        <input
          id="agreement"
          type="checkbox"
          required
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 accent-sky-400"
        />
        <span>
          {dict.register.agreementPrefix}{' '}
          <Link href="#" className="text-sky-400 hover:underline">
            {dict.register.agreementMsa}
          </Link>{' '}
          {dict.register.agreementAnd}{' '}
          <Link href="#" className="text-sky-400 hover:underline">
            {dict.register.agreementPrivacy}
          </Link>
          .
        </span>
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading || !agreed}
        className="flex items-center justify-center gap-2 rounded bg-gradient-to-r from-sky-200 to-blue-500 py-2.5 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? dict.register.submitting : dict.register.submit}
        {!loading && <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}
