'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useLocale } from '@/lib/i18n/locale-context';

export function LoginForm() {
  const router = useRouter();
  const { locale, dict } = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(dict.login.error);
      return;
    }

    router.push(`/${locale}/create`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {dict.login.emailLabel}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <circle cx="12" cy="12" r="4" />
              <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-5.5 8.28" />
            </svg>
          </span>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.login.emailPlaceholder}
            className="w-full rounded border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-sky-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {dict.login.passwordLabel}
          </label>
          <a href="#" className="text-xs font-medium uppercase tracking-wider text-sky-400 hover:underline">
            {dict.login.forgotCredentials}
          </a>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-slate-100 focus:border-sky-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="Toggle password visibility"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <path d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-gradient-to-r from-sky-200 to-blue-500 py-2.5 text-sm font-semibold uppercase tracking-wider text-slate-900 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? dict.login.submitting : dict.login.submit}
      </button>
    </form>
  );
}
